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

module.exports.getOffers = async (req, res) => {
  let offers;

  console.log(req.query);

  if (req.query.title || req.query.location) {
    offers = await candidateModel.getOffersByQuery(req.query);
  } else {
    offers = await candidateModel.getOffers();
  }

  if (offers) {
    return res.json(offers);
  }
  return res.sendStatus(400);
};

module.exports.apply = async (req, res) => {
  let { user_id, offer_id } = req.params;
  user_id = parseInt(user_id, 10);
  offer_id = parseInt(offer_id, 10);

  const applied = await candidateModel.applyOffer(user_id, offer_id);

  if (applied) {
    return res.status(201).json(applied);
  }
  return res.sendStatus(400);
};

module.exports.getApplies = async (req, res) => {
  let { user_id } = req.params;
  user_id = parseInt(user_id, 10);

  const applies = await candidateModel.getApplies(user_id);
  if (applies) {
    return res.status(201).json(applies);
  }
  return res.sendStatus(400);
};

module.exports.acceptMeeting = async (req, res) => {
  let { user_id, offer_id } = req.params;
  user_id = parseInt(user_id, 10);
  offer_id = parseInt(offer_id, 10);

  const meeting = await candidateModel.acceptMeeting(
    req.body,
    user_id,
    offer_id
  );

  if (meeting) {
    return res.sendStatus(200);
  }
  return res.sendStatus(400);
};

module.exports.getMeetings = async (req, res) => {
  let { user_id } = req.params;
  user_id = parseInt(user_id, 10);

  const meetings = await candidateModel.getMeetings(user_id);

  if (meetings) {
    return res.json(meetings);
  }
  return res.sendStatus(400);
};
