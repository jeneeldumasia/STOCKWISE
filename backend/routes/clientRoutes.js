const express = require('express');
const router = express.Router();
const { getClients, addClient, updateClient, deleteClient } = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getClients);
router.post('/', authMiddleware, addClient);
router.put('/:id', authMiddleware, updateClient);
router.delete('/:id', authMiddleware, deleteClient);

module.exports = router;