const { createOffer } = require('../models/companies');

module.exports.createOffer = async (req, res) => {
  const { company_id } = req.params;

  const offer = await createOffer(req.body, company_id);

  if (offer) {
    return res.status(201).json(offer);
  }
  return res.sendStatus(400);
};
