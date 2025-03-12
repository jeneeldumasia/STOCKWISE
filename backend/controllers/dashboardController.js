const Inventory = require('../models/inventoryModel');
const Inward = require('../models/inwardModel');
const Outward = require('../models/outwardModel');

exports.getDashboardData = async (req, res) => {
    try {
        const inventory = await Inventory.find();
        const recentInwards = await Inward.find()
            .sort({ inwardDate: -1 })
            .limit(5);
        const recentOutwards = await Outward.find()
            .sort({ date: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                inventory,
                recentInwards,
                recentOutwards
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};