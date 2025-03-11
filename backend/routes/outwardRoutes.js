const express = require('express');
const { addOutward, getOutwards } = require('../controllers/outwardController');
const router = express.Router();

router.post('/', addOutward);
router.get('/', getOutwards);

module.exports = router;
