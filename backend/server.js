// Warehouse Inventory Management System - Backend API
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));
app.use('/api/movements', require('./routes/stockMovementRoutes'));
app.use('/api/adjustments', require('./routes/stockAdjustmentRoutes'));
app.use('/api/suppliers', require('./routes/supplierRoutes'));

// Export the app object for testing
if (require.main === module) {
    connectDB();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;