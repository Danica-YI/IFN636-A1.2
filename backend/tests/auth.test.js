const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    res.status(200).json({ message: 'Login successful' });
});

describe('Auth API', () => {
    test('should return 400 if email is missing', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ password: 'test123' });
        expect(res.statusCode).toBe(400);
    });

    test('should return 200 if email and password provided', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'test123' });
        expect(res.statusCode).toBe(200);
    });
});