const router = require('express').Router();
const asynchandler = require('express-async-handler');
const candidatesController = require('../controllers/candidates');
const handleUpload = require('../middlewares/handleUpload');
const requireCurrentUser = require('../middlewares/requireCurrentUser');

router.post(
  '/:user_id/upload',
  requireCurrentUser,
  handleUpload,
  asynchandler(candidatesController.upload)
);

router.post('/', asynchandler(candidatesController.create));

router.post(
  '/:user_id/offers/:offer_id',
  requireCurrentUser,
  asynchandler(candidatesController.apply)
);

router.put(
  '/:user_id/offers/:offer_id',
  requireCurrentUser,
  asynchandler(candidatesController.acceptMeeting)
);

router.get(
  '/:user_id/offers',
  requireCurrentUser,
  asynchandler(candidatesController.getMeetings)
);

router.get('/offers', asynchandler(candidatesController.getOffers));

router.get(
  '/:user_id/applies',
  requireCurrentUser,
  asynchandler(candidatesController.getApplies)
);

router.get(
  '/:user_id',
  requireCurrentUser,
  asynchandler(candidatesController.getUser)
);

module.exports = router;
