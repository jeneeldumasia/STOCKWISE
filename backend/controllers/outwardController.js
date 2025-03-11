const Outward = require('../models/outwardModel');

exports.addOutward = async (req, res) => {
    try {
        const outward = new Outward(req.body);
        await outward.save();
        res.status(201).json(outward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOutwards = async (req, res) => {
    try {
        const outwards = await Outward.find();
        res.json(outwards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
