const {
  createOffer,
  getCollection,
  updateOffer,
  findOneOffer,
  deleteOffer,
  getApplies,
  findOneCandidate,
  meetingProposal,
} = require('../models/companies');

module.exports.createOffer = async (req, res) => {
  const { company_id } = req.params;

  const offer = await createOffer(req.body, company_id);

  if (offer) {
    return res.status(201).json(offer);
  }
  return res.sendStatus(400);
};

module.exports.getCollection = async (req, res) => {
  let { company_id } = req.params;
  company_id = parseInt(company_id, 10);

  const offers = await getCollection(company_id);

  if (offers) {
    return res.json(offers);
  }
  return res.sendStatus(400);
};

module.exports.getOne = async (req, res) => {
  const { offer_id } = req.params;

  const offer = await findOneOffer(offer_id);

  if (offer) {
    return res.json(offer);
  }
  return res.sendStatus(400);
};

module.exports.updateOffer = async (req, res) => {
  const { offer_id } = req.params;

  const offer = await updateOffer(req.body, offer_id);

  if (offer) {
    return res.json(offer);
  }
  return res.sendStatus(400);
};

module.exports.deleteOffer = async (req, res) => {
  const { offer_id } = req.params;

  const offer = await deleteOffer(offer_id);

  if (offer) {
    return res.sendStatus(204);
  }
  return res.sendStatus(400);
};

module.exports.getApplies = async (req, res) => {
  let { company_id } = req.params;
  company_id = parseInt(company_id, 10);

  const applies = await getApplies(company_id);
  if (applies) {
    return res.status(200).json(applies);
  }
  return res.sendStatus(400);
};

module.exports.getUser = async (req, res) => {
  let { user_id } = req.params;
  user_id = parseInt(user_id, 10);
  const user = await findOneCandidate(user_id);
  if (user) {
    delete user.encrypted_password;
    return res.json(user);
  }
  return res.sendStatus(400);
};

module.exports.meetingProposal = async (req, res) => {
  let { offer_id } = req.params;
  offer_id = parseInt(offer_id, 10);

  const meeting = await meetingProposal(req.body, offer_id);

  if (meeting) {
    return res.json(meeting);
  }
  return res.sendStatus(400);
};
