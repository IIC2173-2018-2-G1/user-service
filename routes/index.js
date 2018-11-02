const express = require('express');
const router = express.Router();

// router.use('/api', require('./api'));
router.use('/users', require('./users'));

module.exports = router;