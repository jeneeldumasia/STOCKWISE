const mongoose = require('mongoose');

const outwardSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    commodity: { type: String, required: true },
    marking: { type: String, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Outward', outwardSchema);
