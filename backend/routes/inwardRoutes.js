const express = require('express');
const router = express.Router();
const Inward = require('../models/inwardModel');

router.post('/', async (req, res) => {
    try {
        const { inwardDate, party, commodity, weight, marking, quantity } = req.body;
        
        // Validate required fields
        if (!inwardDate) return res.status(400).json({ error: 'Inward date is required' });
        if (!party) return res.status(400).json({ error: 'Party name is required' });
        if (!commodity) return res.status(400).json({ error: 'Commodity is required' });
        if (!weight) return res.status(400).json({ error: 'Weight is required' });
        if (!marking) return res.status(400).json({ error: 'Marking is required' });
        if (!quantity) return res.status(400).json({ error: 'Quantity is required' });
        
        // Log the received data for debugging
        console.log('Received inward data:', req.body);
        
        // Create inward entry
        const inward = new Inward(req.body);
        const savedInward = await inward.save();
        
        res.status(201).json(savedInward);
    } catch (error) {
        console.error('Error saving inward:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
