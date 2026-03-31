const express = require('express');
const router = express.Router();
const { getAllSuppliers, getSupplierById, getSupplierTransactions, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
// all users can get supplier info
router.get('/', protect, getAllSuppliers);
router.get('/:id', protect,  getSupplierById);
router.get('/:id/transactions', protect,  getSupplierTransactions);
// only admins can create, update, delete supplier info.
router.post('/', protect, adminOnly, createSupplier);
router.put('/:id', protect, adminOnly, updateSupplier);
router.delete('/:id', protect, adminOnly, deleteSupplier);

module.exports = router;