const express = require('express');
const router = express.Router();
const { 
    getAllAlerts, 
    getActiveAlerts, 
    getAlertById, 
    resolveAlert, 
    ignoreAlert 
} = require('../controllers/alertController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getAllAlerts);
router.get('/active', protect, getActiveAlerts);
router.get('/:id', protect, getAlertById);
router.put('/:id/resolve', protect, adminOnly, resolveAlert);
router.put('/:id/ignore', protect, adminOnly, ignoreAlert);

module.exports = router;