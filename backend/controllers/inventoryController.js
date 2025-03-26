const Inventory = require('../models/inventoryModel');

exports.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({ userId: req.user.id });
        res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
};