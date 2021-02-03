const candidateModel = require('../models/candidates');

module.exports = async (req, res, next) => {
  const user = await candidateModel.findOne(req.session.userId);
  if (user && parseInt(req.params.user_id, 10) === user.id) {
    delete user.encrypted_password;
    req.currentUser = user;
    return next();
  }

  return res.sendStatus(401);
};
