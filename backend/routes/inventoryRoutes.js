const express = require('express');
const { getInventory } = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getInventory);

module.exports = router;