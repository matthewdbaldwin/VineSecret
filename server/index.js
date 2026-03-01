'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Resend } = require('resend');
const { buildInvoiceEmail } = require('./email/invoice');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const EMAIL_FROM = process.env.EMAIL_FROM || 'orders@vinesecret.com';

// Lazily created so the server starts even if RESEND_API_KEY is not yet set.
// An error will be logged at send time if the key is missing.
let _resend = null;
const getResend = () => {
    if (!_resend) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set in your .env file');
        }
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
};

// In-memory order store for this demo session
const orders = new Map();

app.use(cors());
app.use(express.json());

// POST /api/orders/guest
// Create a guest order and return an order ID
app.post('/api/orders/guest', (req, res) => {
    const guest = req.body || {};
    const orderId = `VS-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const order = {
        id: orderId,
        message: 'Order received. A confirmation email is on its way.',
        guest,
        createdAt: Date.now(),
    };

    orders.set(orderId, order);

    res.json({ id: orderId, message: order.message });
});

// GET /api/orders/guest/:orderId?email=
// Retrieve a stored order, validated by email
app.get('/api/orders/guest/:orderId', (req, res) => {
    const { orderId } = req.params;
    const email = (req.query.email || '').toLowerCase();
    const order = orders.get(orderId);

    if (!order || (order.guest?.email || '').toLowerCase() !== email) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
});

// POST /api/notifications/guest-order
// Build invoice HTML and send via Resend
app.post('/api/notifications/guest-order', async (req, res) => {
    const { orderId, email, name, cart } = req.body || {};

    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }

    const html = buildInvoiceEmail({ orderId, name, cart });

    try {
        await getResend().emails.send({
            from: EMAIL_FROM,
            to: email,
            subject: `VineSecret Order Confirmation – ${orderId}`,
            html,
        });

        res.json({ success: true });
    } catch (err) {
        console.error('Resend error:', err?.message || err);
        res.status(500).json({ error: 'Failed to send email', detail: err?.message });
    }
});

app.listen(PORT, () => {
    console.log(`VineSecret API server listening on port ${PORT}`);
});
