const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    type: { type: String, enum: ['inbound', 'outbound_sale','outbound_return'], required: true },
    quantity: { type: Number, required: true },
    reason: { type: String },
    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Supplier',
        required: function() { 
            return this.type === 'inbound' || this.type === 'outbound_return'; 
        }
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);