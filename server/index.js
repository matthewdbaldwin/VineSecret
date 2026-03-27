'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { buildInvoiceEmail } = require('./email/invoice');

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const EMAIL_FROM = process.env.EMAIL_FROM || 'orders@vinesecret.com';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

// Lazily created so the server starts even if SMTP credentials are not yet set.
// An error will be logged at send time if the configuration is missing.
let _transporter = null;
const getTransporter = () => {
    if (!_transporter) {
        const host = process.env.SMTP_HOST;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        if (!host || !user || !pass) {
            throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASS must be set in your .env file');
        }

        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        const secure = process.env.SMTP_SECURE === 'true' || port === 465;

        _transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
        });
    }
    return _transporter;
};

// In-memory order store for this demo session
const orders = new Map();

app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/orders/guest
// Create a guest order and return an order ID
app.post('/api/orders/guest', orderLimiter, (req, res) => {
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
// Build invoice HTML and send via SMTP
app.post('/api/notifications/guest-order', orderLimiter, async (req, res) => {
    const { orderId, email, name, cart } = req.body || {};

    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }

    const html = buildInvoiceEmail({ orderId, name, cart });

    try {
        await getTransporter().sendMail({
            from: EMAIL_FROM,
            to: email,
            subject: `VineSecret Order Confirmation – ${orderId}`,
            html,
        });

        res.json({ success: true });
    } catch (err) {
        console.error('SMTP error:', err?.message || err);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Return 404 for any /api/* route not matched above.
// Without this, unimplemented routes fall through to the static file handler
// which returns the React app HTML with status 200, causing the frontend's
// cart actions to treat the HTML as a valid API response and empty the cart.
app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Serve the production build when dist/ exists.
// API routes above take precedence; this catches everything else.
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    // SPA fallback — send index.html for any non-API route so client-side
    // routing works when the page is refreshed or linked directly.
    app.use((req, res, next) => {
        if (req.path.startsWith('/api/')) return next();
        res.sendFile(path.join(distDir, 'index.html'));
    });
}

app.listen(PORT, () => {
    const mode = fs.existsSync(distDir) ? 'production (serving dist/)' : 'API only';
    console.log(`VineSecret server listening on port ${PORT} [${mode}]`);
});
