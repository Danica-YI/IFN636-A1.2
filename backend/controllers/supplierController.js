const Supplier = require('../models/Supplier');
const StockMovement = require('../models/stockMovement');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ status: 'active' });
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single supplier by ID
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get supplier transaction history
const getSupplierTransactions = async (req, res) => {
    try {
        const transactions = await StockMovement.find({ supplier: req.params.id })
            .populate('stock', 'name sku')
            .populate('performedBy', 'name email');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new supplier
const createSupplier = async (req, res) => {
    try {
        const { name, contactPerson, contactEmail, phone, address, categories } = req.body;
        const supplier = await Supplier.create({
            name, contactPerson, contactEmail, phone, address, categories
        });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update supplier
const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        const { name, contactPerson, contactEmail, phone, address, categories, status } = req.body;
        supplier.name = name || supplier.name;
        supplier.contactPerson = contactPerson || supplier.contactPerson;
        supplier.contactEmail = contactEmail || supplier.contactEmail;
        supplier.phone = phone || supplier.phone;
        supplier.address = address || supplier.address;
        supplier.categories = categories || supplier.categories;
        supplier.status = status || supplier.status;

        const updatedSupplier = await supplier.save();
        res.status(200).json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        await supplier.deleteOne();
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllSuppliers, getSupplierById, getSupplierTransactions, createSupplier, updateSupplier, deleteSupplier };