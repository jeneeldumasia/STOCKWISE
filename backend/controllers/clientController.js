const Client = require('../models/clientModel');

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find({ userId: req.user.id });
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Server error while fetching clients' });
    }
};

exports.addClient = async (req, res) => {
    try {
        const client = new Client({
            ...req.body,
            userId: req.user.id
        });
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        console.error('Error adding client:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Client with this email already exists' });
        }
        res.status(500).json({ error: 'Server error while adding client' });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};