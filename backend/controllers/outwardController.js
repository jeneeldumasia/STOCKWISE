const Outward = require('../models/outwardModel');
const Inventory = require('../models/inventoryModel');

exports.addOutward = async (req, res) => {
    try {
        const { date, partyName, commodity, marking, quantity, weight } = req.body;

        // Check if sufficient stock exists
        const inventory = await Inventory.findOne({
            commodity,
            marking,
            userId: req.user.id
        });

        if (!inventory || inventory.quantity < quantity || inventory.weight < weight) {
            return res.status(400).json({ error: 'Insufficient stock for this outward entry' });
        }

        // Create outward entry
        const outward = new Outward({
            date,
            partyName,
            commodity,
            marking,
            quantity,
            weight,
            userId: req.user.id
        });

        await outward.save();

        // Update inventory
        inventory.quantity -= quantity;
        inventory.weight -= weight;
        await inventory.save();

        res.status(201).json(outward);
    } catch (error) {
        console.error('Error in addOutward:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOutwards = async (req, res) => {
    try {
        const outwards = await Outward.find({ userId: req.user.id });
        res.json(outwards);
    } catch (error) {
        console.error('Error in getOutwards:', error);
        res.status(500).json({ error: error.message });
    }
};
