const mongoose = require('mongoose');

const inwardSchema = new mongoose.Schema({
    inwardDate: {
        type: Date,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    commodity: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    marking: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Inward', inwardSchema);
