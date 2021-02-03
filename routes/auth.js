const router = require('express').Router();
const authController = require('../controllers/auth');

router.post('/:environment/signup', authController.register);
router.post('/:environment/login', authController.login);
router.get('/:environment/logout', authController.logout);

module.exports = router;
