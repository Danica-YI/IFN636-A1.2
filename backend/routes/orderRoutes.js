const express = require('express');
const router = express.Router();
const { 
    getAllOrders, 
    getOrderById, 
    createOrder,
    submitOrder,
    updateOrderStatus, 
    updateOrder, 
    deleteOrder, 
    updateTrackingInfo 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.put('/:id/submit', protect, submitOrder);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/tracking', protect, updateTrackingInfo);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

module.exports = router;