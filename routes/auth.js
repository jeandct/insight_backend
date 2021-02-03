const router = require('express').Router();
const authController = require('../controllers/auth');

router.post('/candidates/signup', authController.register);
router.post('/candidates/login', authController.login);
router.get('/candidates/logout', authController.logout);

module.exports = router;
