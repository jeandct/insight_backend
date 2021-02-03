const Candidate = require('../models/candidates');

module.exports.register = async (req, res) => {
  const user = await Candidate.create(req.body);

  if (user) {
    return res.status(201).json(user);
  }
  return res.status(400).send('Impossible to create new user');
};

module.exports.login = async (req, res) => {
  const user = await Candidate.findByEmail(req.body.email);

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
        role: user.role,
      };
      return res.status(200).json(userDetails);
    });
  } else {
    res.sendStatus(401);
  }
};
