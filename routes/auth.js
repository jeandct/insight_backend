const router = require('express').Router();
const authController = require('../controllers/auth');

router.post('/candidates/login', authController.login);

module.exports = router;
