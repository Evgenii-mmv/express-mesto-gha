const router = require('express').Router();
const { notfoundpagerout } = require('../controllers/noneexistent');

router.use('/', notfoundpagerout);

module.exports = router;
