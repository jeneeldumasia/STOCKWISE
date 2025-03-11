const Inward = require('../models/inwardModel');

exports.addInward = async (req, res) => {
    try {
        const inward = new Inward(req.body);
        await inward.save();
        res.status(201).json(inward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInwards = async (req, res) => {
    try {
        const inwards = await Inward.find();
        res.json(inwards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
