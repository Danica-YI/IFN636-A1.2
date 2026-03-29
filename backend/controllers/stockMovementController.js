const StockMovement = require('../models/stockMovement');
const Stock = require('../models/Stock');

// Get all stock movements
const getAllMovements = async (req, res) => {
    try {
        const movements = await StockMovement.find()
            .populate('stock', 'name sku')
            .populate('performedBy', 'name email')
            .populate('supplier', 'name contactEmail');
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get movements by stock ID
const getMovementsByStock = async (req, res) => {
    try {
        const movements = await StockMovement.find({ stock: req.params.stockId })
            .populate('stock', 'name sku')
            .populate('performedBy', 'name email')
            .populate('supplier', 'name contactEmail');
        res.status(200).json(movements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create stock movement
const createMovement = async (req, res) => {
    try {
        const { stockId, type, quantity, reason, supplierId } = req.body;

        // Validate supplier for inbound and outbound_return
        if ((type === 'inbound' || type === 'outbound_return') && !supplierId) {
            return res.status(400).json({ message: 'Supplier is required for inbound and return movements' });
        }

        // Find the stock
        const stock = await Stock.findById(stockId);
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        // Update stock quantity
        if (type === 'inbound') {
            stock.quantity += quantity;
        } else if (type === 'outbound_sale' || type === 'outbound_return') {
            if (stock.quantity < quantity) {
                return res.status(400).json({ message: 'Insufficient stock quantity' });
            }
            stock.quantity -= quantity;
        }
        await stock.save();

        // Create movement record
        const movement = await StockMovement.create({
            stock: stockId,
            type,
            quantity,
            reason,
            supplier: supplierId || null,
            performedBy: req.user.id,
        });

        res.status(201).json(movement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllMovements, getMovementsByStock, createMovement };