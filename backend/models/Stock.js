const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    lowStockThreshold: { type: Number, default: 10 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);