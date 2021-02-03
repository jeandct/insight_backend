const router = require('express').Router();
const asynchandler = require('express-async-handler');
const candidatesController = require('../controllers/candidates');

router.post('/', asynchandler(candidatesController.create));

module.exports = router;
