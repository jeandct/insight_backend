const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const session = require('express-session');
const {
  inTestEnv,
  inProdEnv,
  SERVER_PORT,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_SECRET,
  CORS_ALLOWED_ORIGINS,
  SESSION_COOKIE_DOMAIN,
} = require('./env');
const sessionStore = require('./sessionStore');
const handleValidationError = require('./middlewares/handleValidationError');
const handleFileTypeError = require('./middlewares/handleFileTypeError');

const app = express();

// docs
if (!inProdEnv && !inTestEnv) {
  const swaggerDocument = YAML.load('./docs/swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

const allowedOrigins = CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// pre-route middlewares
app.use(cors(corsOptions));
app.use('/static', express.static('file-storage/private'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    key: SESSION_COOKIE_NAME,
    secret: SESSION_COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      secure: inProdEnv,
      domain: SESSION_COOKIE_DOMAIN,
    },
  })
);

// routes
require('./routes')(app);

// post-route middlewares
app.set('x-powered-by', false);
app.use(handleValidationError);
app.use(handleFileTypeError);

// server setup
const server = app.listen(SERVER_PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${SERVER_PORT}`);
  }
});

// process setup
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((error) => {
    if (error) console.error(JSON.stringify(error), error.stack);
  });
});

module.exports = server;
