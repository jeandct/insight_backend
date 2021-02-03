const candidatesRouter = require('./candidates');
const authRouter = require('./auth');

// eslint-disable-next-line
module.exports = (app) => {
  app.use('/candidates', candidatesRouter);
  app.use('/auth', authRouter);
};
