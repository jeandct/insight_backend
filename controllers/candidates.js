const candidateModel = require('../models/candidates');

module.exports.upload = async (req, res) => {
  console.log(req.file);
  const { filename } = req.file;
  const uploaded = await candidateModel.upload(req.currentUser.id, filename);
  if (uploaded) {
    return res.status(200).json(req.file.filename);
  }
  return res.status(400).send('An error occured during upload');
};

module.exports.getUser = async (req, res) => {
  const user = await candidateModel.findOne(req.currentUser.id);
  if (user) {
    delete user.encrypted_password;
    return res.json(user);
  }
  return res.sendStatus(400);
};
