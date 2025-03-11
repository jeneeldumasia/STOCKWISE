const express = require('express');
const { addInward, getInwards } = require('../controllers/inwardController');
const router = express.Router();

router.post('/', addInward);
router.get('/', getInwards);

module.exports = router;
