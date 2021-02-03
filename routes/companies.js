const router = require('express').Router();
const asynchandler = require('express-async-handler');
const Companies = require('../controllers/companies');

router.post('/:company_id/offers', asynchandler(Companies.createOffer));

module.exports = router;
