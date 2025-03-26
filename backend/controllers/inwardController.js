const Inward = require('../models/inwardModel');
const Inventory = require('../models/inventoryModel');

exports.addInward = async (req, res) => {
    try {
        const { inwardDate, party, commodity, weight, marking, quantity } = req.body;

        // Create inward entry
        const inward = new Inward({
            inwardDate,
            party,
            commodity,
            weight,
            marking,
            quantity,
            userId: req.user.id // Associate with logged-in user
        });

        await inward.save();

        // Update inventory
        await Inventory.findOneAndUpdate(
            { commodity, marking, userId: req.user.id },
            { 
                $inc: { quantity: quantity, weight: weight },
                $setOnInsert: { commodity, marking, userId: req.user.id }
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ success: true, data: inward });
    } catch (error) {
        console.error('Error in addInward:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getInwards = async (req, res) => {
    try {
        const inwards = await Inward.find({ userId: req.user.id }).sort({ inwardDate: -1 });
        res.json({ success: true, data: inwards });
    } catch (error) {
        console.error('Error in getInwards:', error);
        res.status(500).json({ error: 'Server error while fetching inward entries' });
    }
};
