const Candidate = require('../models/candidates');
const Company = require('../models/companies');

module.exports.register = async (req, res) => {
  const { environment } = req.params;
  let user;

  if (environment === 'candidate') {
    user = await Candidate.create(req.body);
  } else if (environment === 'company') {
    user = await Company.create(req.body);
  }

  if (user) {
    return res.status(201).json(user);
  }
  return res.status(400).send('Impossible to create new user');
};

module.exports.login = async (req, res) => {
  const { environment } = req.params;
  let user;
  if (environment === 'candidate') {
    user = await Candidate.findByEmail(req.body.email);
  } else if (environment === 'company') {
    user = await Company.findByEmail(req.body.email);
  }

  if (
    user &&
    (await Candidate.verifyPassword(user.encrypted_password, req.body.password))
  ) {
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;
    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) return res.sendStatus(500);
      const userDetails = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        cv: user.cv,
      };
      return res.status(200).json(userDetails);
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('session_id', { path: '/' });
    if (err) return res.sendStatus(500);
    return res.sendStatus(200);
  });
};
