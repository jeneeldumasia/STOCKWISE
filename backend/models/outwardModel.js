const mongoose = require('mongoose');

const outwardSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    partyName: { type: String, required: true },
    commodity: { type: String, required: true },
    marking: { type: String, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Outward', outwardSchema);
