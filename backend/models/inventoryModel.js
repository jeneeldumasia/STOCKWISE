const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    commodity: { type: String, required: true },
    marking: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

inventorySchema.index({ commodity: 1, marking: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);