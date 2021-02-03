const { create } = require('../models/candidates');

module.exports.create = async (req, res) => {
  const user = await create(req.body);

  if (user) {
    return res.status(201).json(user);
  }
  return res.status(400).send('Impossible to create new user');
};
