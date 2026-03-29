const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    alertType: { type: String, enum: ['low_stock'], default: 'low_stock' },
    threshold: { type: Number, required: true },
    quantityAtAlert: { type: Number, required: true },
    status: { type: String, enum: ['active', 'resolved', 'ignored'], default: 'active' },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    resolution: { 
        type: String, 
        enum: ['reorder', 'ignored'],
    },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);