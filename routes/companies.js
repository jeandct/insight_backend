const router = require('express').Router();
const asynchandler = require('express-async-handler');
const Companies = require('../controllers/companies');
const requireCurrentCompany = require('../middlewares/requireCurrentCompany');

router.get(
  '/:company_id/candidates/:user_id',
  requireCurrentCompany,
  asynchandler(Companies.getUser)
);

router.post(
  '/:company_id/offers',
  requireCurrentCompany,
  asynchandler(Companies.createOffer)
);
router.get(
  '/:company_id/offers',
  requireCurrentCompany,
  asynchandler(Companies.getCollection)
);

router.get(
  '/:company_id/applies',
  requireCurrentCompany,
  asynchandler(Companies.getApplies)
);

router.get('/offers/:offer_id', asynchandler(Companies.getOne));

router.put(
  '/:company_id/offers/:offer_id',
  requireCurrentCompany,
  asynchandler(Companies.meetingProposal)
);

router.delete(
  '/:company_id/offers/:offer_id',
  requireCurrentCompany,
  asynchandler(Companies.deleteOffer)
);

module.exports = router;
