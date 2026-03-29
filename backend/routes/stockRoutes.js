const express = require('express');
const router = express.Router();
const { getAllStocks, getStockById, createStock, updateStock, deleteStock } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllStocks);
router.get('/:id', protect, getStockById);
router.post('/', protect, createStock);
router.put('/:id', protect, updateStock);
router.delete('/:id', protect, deleteStock);

module.exports = router;