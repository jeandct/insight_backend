const { findOne } = require('../models/companies');

module.exports = async (req, res, next) => {
  const user = await findOne(req.session.userId);
  if (user && parseInt(req.params.company_id, 10) === user.id) {
    delete user.encrypted_password;
    req.currentUser = user;
    return next();
  }

  return res.sendStatus(401);
};
