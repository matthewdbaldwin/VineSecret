'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { Resend } = require('resend');
// const Stripe = require('stripe');
const { z } = require('zod');
const { buildInvoiceEmail } = require('./email/invoice');
const { products } = require('./data/products');

const guestOrderSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.email('A valid email is required'),
    phone: z.string().optional(),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    region: z.string().min(1, 'State/Province is required'),
    postal: z.string().min(1, 'Postal code is required'),
    notes: z.string().optional(),
    shippingMethod: z.enum(['standard', 'express']).default('standard'),
});

const notificationSchema = z.object({
    orderId: z.string().min(1, 'orderId is required'),
    email: z.email('A valid email is required'),
    name: z.string().optional(),
    cart: z.record(z.string(), z.unknown()).optional(),
});

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

const getResend = () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY must be set in your .env file');
    return new Resend(apiKey);
};

// const getStripe = () => {
//     const key = process.env.STRIPE_SECRET_KEY;
//     if (!key) throw new Error('STRIPE_SECRET_KEY must be set in your .env file');
//     return new Stripe(key);
// };

// In-memory order store for this demo session
const orders = new Map();

// ── Social-crawler meta injection ─────────────────────────────────────────────
const SOCIAL_BOT = /facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|discordbot|googlebot|bingbot|pinterest|embedly|iframely/i;

const SITE_URL  = (process.env.SITE_URL || 'https://vinesecret.com').replace(/\/$/, '');
const OG_IMAGE  = `${SITE_URL}/social/vinesecret-og.jpg`;

const PAGE_META = {
    '/': {
        title:       'VineSecret — Estate Wines from Orange County, CA',
        description: 'Small-lot California wines from five estate vineyards. Guest checkout, cold-pack delivery, and cellar tastings by appointment.',
    },
    '/products': {
        title:       'Shop Estate Wines — VineSecret',
        description: 'Browse limited releases: Chardonnay, Pinot Noir, Cabernet, Rosé and more. Tax-inclusive pricing with temperature-controlled shipping.',
    },
    '/about': {
        title:       'Our Story — VineSecret Estate Winery',
        description: 'Five estate vineyards in Orange County farmed by hand. We ferment in small lots, taste every barrel, and blend blind until it\'s right.',
    },
    '/contact': {
        title:       'Visit & Tastings — VineSecret',
        description: 'Intimate seated tastings, private events for up to 12 guests, and concierge shipping. Book a tasting or drop us a note.',
    },
    '/club': {
        title:       'Wine Club — VineSecret',
        description: 'Quarterly allocations of estate wines delivered to your cellar. Three tiers from 3 to 12 bottles. Cancel anytime.',
    },
};

function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildBotHtml({ title, description, url }) {
    const t = escHtml(title), d = escHtml(description), u = escHtml(url);
    return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><title>${t}</title>
<meta name="description" content="${d}">
<meta property="og:site_name" content="VineSecret">
<meta property="og:type" content="website">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${escHtml(OG_IMAGE)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="VineSecret — estate winery, small-lot California wines">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@vinesecret">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${escHtml(OG_IMAGE)}">
</head><body><a href="${u}">${t}</a></body></html>`;
}

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc:      ["'self'"],
            scriptSrc: [
                "'self'",
                // 'https://js.stripe.com',
                // 'https://m.stripe.network',
                'https://www.googletagmanager.com',
                'https://www.google-analytics.com',
                'https://ssl.google-analytics.com',
                // Stripe-injected inline script hashes (required for Stripe.js to initialise)
                // "'sha256-7PZaH7TzFg4JdT5xJguN7Och6VcMcP1LW4N3fQ936Fs='",
                // "'sha256-MqH8JJslY2fF2bGYY1rZlpCNrRCnWKRzrrDefixUJTI='",
                // "'sha256-ZswfTY7H35rbv8WC7NXBoiC7WNu86vSzCDChNWwZZDM='",
            ],
            styleSrc:        ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc:         ["'self'", 'https://fonts.gstatic.com'],
            imgSrc:          ["'self'", 'data:', 'blob:', /* 'https://*.stripe.com', */ 'https://www.google-analytics.com', 'https://www.googletagmanager.com'],
            connectSrc: [
                "'self'",
                // 'https://api.stripe.com',
                'https://www.google-analytics.com',
                'https://analytics.google.com',
                'https://region1.google-analytics.com',
                'https://region1.analytics.google.com',
            ],
            // frameSrc:     ['https://js.stripe.com', 'https://hooks.stripe.com', 'https://m.stripe.network'],
            frameAncestors:  ["'none'"],
            objectSrc:       ["'none'"],
            baseUri:         ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/products
app.get('/api/products', (_req, res) => {
    res.json({ products });
});

// GET /api/products/:productId
app.get('/api/products/:productId', (req, res) => {
    const product = products.find((p) => p.id === req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

// POST /api/orders/guest
// Create a guest order and return an order ID
app.post('/api/orders/guest', orderLimiter, (req, res) => {
    const result = guestOrderSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Invalid request', issues: z.flattenError(result.error).fieldErrors });
    }
    const guest = result.data;
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
    const result = notificationSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Invalid request', issues: z.flattenError(result.error).fieldErrors });
    }
    const { orderId, email, name, cart } = result.data;

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
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// POST /api/club/signup
const clubSignupSchema = z.object({
    name:       z.string().min(1, 'Name is required'),
    email:      z.email('A valid email is required'),
    phone:      z.string().optional(),
    tier:       z.enum(['explorer', 'enthusiast', 'collector']),
    preference: z.enum(['mixed', 'reds', 'whites', 'no-preference']).default('mixed'),
    notes:      z.string().optional(),
});

const clubSignups = new Map();

app.post('/api/club/signup', orderLimiter, (req, res) => {
    const result = clubSignupSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Invalid request', issues: z.flattenError(result.error).fieldErrors });
    }
    const id = `CLUB-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    clubSignups.set(id, { id, ...result.data, createdAt: Date.now() });
    res.json({ id, message: 'Application received. We will be in touch within one business day.' });
});

// POST /api/payments/create-intent — Stripe integration (commented out)
// const paymentIntentSchema = z.object({
//     amount: z.number().int().min(50, 'Amount must be at least 50 cents'),
// });
//
// app.post('/api/payments/create-intent', orderLimiter, async (req, res) => {
//     const result = paymentIntentSchema.safeParse(req.body);
//     if (!result.success) {
//         return res.status(400).json({ error: 'Invalid request', issues: z.flattenError(result.error).fieldErrors });
//     }
//     try {
//         const intent = await getStripe().paymentIntents.create({
//             amount: result.data.amount,
//             currency: 'usd',
//             automatic_payment_methods: { enabled: true },
//             metadata: { source: 'vinesecret-checkout' },
//         });
//         res.json({ clientSecret: intent.client_secret });
//     } catch (err) {
//         console.error('Stripe error:', err?.message || err);
//         res.status(500).json({ error: 'Could not initialize payment' });
//     }
// });

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
    // SPA fallback — send index.html for regular browsers, or an OG-tag page
    // for social crawlers so each route gets its own link preview.
    // Static asset paths (/assets/, /icons/, /social/) that weren't found by
    // express.static get a 404 rather than index.html to avoid MIME-type errors.
    app.use((req, res, next) => {
        if (req.path.startsWith('/api/')) return next();
        if (/^\/(assets|icons|social)\//.test(req.path)) return res.status(404).end();

        const ua = req.get('User-Agent') || '';
        if (SOCIAL_BOT.test(ua)) {
            let meta = PAGE_META[req.path];

            if (!meta && req.path.startsWith('/products/')) {
                const id = req.path.slice('/products/'.length);
                const product = products.find((p) => p.id === id);
                if (product) {
                    meta = {
                        title:       `${product.name} — VineSecret`,
                        description: `${product.caption || product.name}. Limited estate release. Tax-inclusive with cold-pack shipping.`,
                    };
                }
            }

            if (!meta) meta = PAGE_META['/'];
            return res.send(buildBotHtml({ ...meta, url: `${SITE_URL}${req.path}` }));
        }

        res.sendFile(path.join(distDir, 'index.html'));
    });
}

app.listen(PORT, () => {
    const mode = fs.existsSync(distDir) ? 'production (serving dist/)' : 'API only';
    console.log(`VineSecret server listening on port ${PORT} [${mode}]`);
});
