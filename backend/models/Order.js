const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
});

const trackingSchema = new mongoose.Schema({
    trackingNumber: { type: String, required: true },
    carrier: { type: String },
    estimatedDelivery: { type: Date },
    notes: { type: String },
    updatedAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['draft', 'pending', 'approved', 'shipped', 'received', 'cancelled'], 
        default: 'draft' 
    },
    notes: { type: String },
    trackingInfo: {
        type: trackingSchema,
        required: false,
        default: null,
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);