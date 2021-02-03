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

router.get(
  '/:user_id',
  requireCurrentUser,
  asynchandler(candidatesController.getUser)
);

module.exports = router;
