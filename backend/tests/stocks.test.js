const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Stock = require('../models/Stock');
const { createStock, getAllStocks, updateStock, deleteStock } = require('../controllers/stockController');
const { expect } = chai;

describe('Stock Controller Tests', () => {

    // Test 1: Create Stock
    it('should create a new stock successfully', async () => {
        const req = {
            body: {
                name: 'Test Product',
                sku: 'SKU-001',
                category: 'Electronics',
                quantity: 100,
                unit: 'pcs',
                price: 99.99,
                lowStockThreshold: 10,
                description: 'Test description'
            }
        };
        const createdStock = { _id: new mongoose.Types.ObjectId(), ...req.body };
        const createStub = sinon.stub(Stock, 'create').resolves(createdStock);
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await createStock(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdStock)).to.be.true;
        createStub.restore();
    });

    // Test 2: Create Stock Error
    it('should return 500 if create stock fails', async () => {
        const req = { body: {} };
        const createStub = sinon.stub(Stock, 'create').throws(new Error('DB Error'));
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await createStock(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        createStub.restore();
    });

    // Test 3: Get All Stocks
    it('should get all stocks successfully', async () => {
        const req = {};
        const stocks = [{ name: 'Product 1' }, { name: 'Product 2' }];
        const findStub = sinon.stub(Stock, 'find').resolves(stocks);
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await getAllStocks(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(stocks)).to.be.true;
        findStub.restore();
    });

    // Test 4: Delete Stock Not Found
    it('should return 404 if stock not found on delete', async () => {
        const req = { params: { id: new mongoose.Types.ObjectId() } };
        const findByIdStub = sinon.stub(Stock, 'findById').resolves(null);
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await deleteStock(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        findByIdStub.restore();
    });

});