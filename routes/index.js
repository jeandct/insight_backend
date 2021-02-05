const candidatesRouter = require('./candidates');
const authRouter = require('./auth');
const companiesRouter = require('./companies');

// eslint-disable-next-line
module.exports = (app) => {
  app.use('/candidates', candidatesRouter);
  app.use('/auth', authRouter);
  app.use('/companies', companiesRouter);
};
