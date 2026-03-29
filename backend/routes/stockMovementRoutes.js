const express = require('express');
const router = express.Router();
const { getAllMovements, getMovementsByStock, createMovement } = require('../controllers/stockMovementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllMovements);
router.get('/stock/:stockId', protect, getMovementsByStock);
router.post('/', protect, createMovement);

module.exports = router;