const express = require('express');
const router = express.Router();
const { getAllAdjustments, getAdjustmentById, createAdjustment, updateAdjustmentStatus, deleteAdjustment } = require('../controllers/stockAdjustmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllAdjustments);
router.get('/:id', protect, getAdjustmentById);
router.post('/', protect, createAdjustment);
router.put('/:id', protect, updateAdjustmentStatus);
router.delete('/:id', protect, deleteAdjustment);

module.exports = router;