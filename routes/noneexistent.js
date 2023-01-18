const router = require('express').Router();
const { NotFoundError } = require('../controllers/noneexistent');

router.use('/', NotFoundError);

module.exports = router;
