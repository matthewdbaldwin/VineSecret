# VineSecret

A demo e-commerce site for a fictional Sonoma County estate winery. Built with React, Redux, and an Express API backend. Features guest checkout, order confirmation emails via Resend, a mobile-first responsive design, and an age gate.

---

## Tech Stack

**Frontend**
- React 19 + Redux Toolkit + React Router v7
- Vite (dev server & build)
- Plain CSS with design tokens (no CSS framework)

**Backend**
- Express 5
- Resend (transactional email)
- Zod (request validation)
- Helmet + CORS + rate limiting

---

## Getting Started

### Prerequisites

- Node.js 22+ (`package.json` requires `>=22`; `.nvmrc` pins 22 — Vite 8 needs it)

### Installation

```bash
git clone https://github.com/matthewdbaldwin/VineSecret.git
cd VineSecret
npm install
```

If you hit a `403 Forbidden` fetching packages through a proxy:

```bash
npm run install:noproxy
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key for order confirmation emails |
| `EMAIL_FROM` | Sender address (must be verified in Resend) |
| `SERVER_PORT` | Express server port (default: `3001`) |
| `ALLOWED_ORIGIN` | CORS origin (default: `http://localhost:3000`) |
| `SITE_URL` | Absolute base URL used in bot-facing pages and Open Graph tags (default: `https://vinesecret.com`) |
| `VITE_GA_MEASUREMENT_ID` | Optional Google Analytics 4 measurement ID; falls back to the demo ID below |

### Running Locally

```bash
npm start
```

This starts both the Vite dev server on port `3000` and the Express API on port `3001` concurrently. Vite proxies all `/api` requests to Express.

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Vite dev server + Express API |
| `npm run dev` | Vite dev server only |
| `npm run start:server` | Express API only |
| `npm run build` | Production build to `dist/` |
| `npm run serve` | Build then serve via Express |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on `src/` |

---

## Project Structure

```
src/
├── actions/          # Redux thunks + action types (localStorage cart, API calls)
├── analytics/        # Google Analytics tracking
├── assets/           # Images and global CSS
│   └── css/app.css   # Design tokens, global utilities
├── components/
│   ├── about/
│   ├── agegate/
│   ├── cart/
│   ├── checkout/
│   ├── club/         # Wine-club signup
│   ├── contact/
│   ├── footer/
│   ├── general/      # Money, schedule, varietal helpers, view-transition links
│   ├── header/
│   ├── home/
│   ├── legal/        # Terms of Use, Privacy Policy
│   ├── nav/          # Desktop nav + mobile bottom tab bar
│   ├── notfound/
│   └── products/
├── hooks/            # useFocusTrap
├── data/products.js  # Local product catalogue (with images)
├── reducers/
└── main.jsx

server/
├── data/products.js  # Server-side product data (no images)
├── email/invoice.js  # Order confirmation email template
└── index.js          # Express app: API, static dist/, bot-facing meta pages

public/               # Static files copied verbatim into dist/ by Vite
├── manifest.json     # PWA manifest
├── gtag-init.js      # GA init kept out of the CSP-restricted inline HTML
├── icons/            # PWA icons (generated; commit the PNGs)
└── social/           # Open Graph image

scripts/generate-icons.js  # Regenerates public/icons from VineSecretLogo.svg
railway.json               # Railway build/start/healthcheck config
```

`scripts/generate-icons.js` needs Sharp, which is intentionally not a dependency:

```bash
npm install --no-save sharp && node scripts/generate-icons.js
```

---

## Features

- **Guest checkout** — no account required; orders saved to browser local storage
- **Order confirmation email** — sent via Resend on successful checkout
- **Age gate** — sessionStorage-persisted age verification overlay
- **Mobile-first** — bottom tab navigation, wizard checkout on small screens, sticky product CTAs
- **Wine club signup** — POSTs to `/api/club/signup` (rate-limited, no accounts)
- **PWA** — manifest, generated icons, and speculation-rules prerendering of product pages
- **Legal pages** — Terms of Use and Privacy Policy at `/legal/terms` and `/legal/privacy`
- **Product catalogue** — 9 estate wines with tasting notes, pricing, and bottle artwork

---

## Deployment

Build the frontend and serve everything from Express:

```bash
npm run serve
```

Express serves the built `dist/` folder as static files and falls back to `index.html` for client-side routing (`postbuild` also copies it to `404.html` for static hosts). Set `SERVER_PORT` to `3000` (or `80`/`443`) and `ALLOWED_ORIGIN` to your production domain in `.env`. Port resolution order is `PORT` then `SERVER_PORT` then `3001`, so a host that injects `PORT` wins.

### Railway

`railway.json` drives the deploy: Nixpacks build with `npm run build`, start with `node server/index.js`, and a healthcheck against `/api/health`. No `npm ci` step — Railway installs dependencies itself.

### API surface

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Healthcheck |
| `GET /api/products`, `GET /api/products/:id` | Product data (frontend merges in images) |
| `POST /api/orders/guest`, `GET /api/orders/guest/:id` | Guest orders |
| `POST /api/notifications/guest-order` | Sends the confirmation email via Resend |
| `POST /api/club/signup` | Wine-club signup |

Cart endpoints are intentionally absent: the cart lives in browser local storage, and the frontend falls back to the bundled catalogue when the API is unreachable.

---

## Notes

- This is a demonstration site. No real products are sold and no payments are processed.
- Product images are SVGs bundled by Vite; the Express API serves product data without images and the frontend merges them.
- Google Analytics is wired with measurement ID `G-DXQG8V0F15`. To use your own property, set `VITE_GA_MEASUREMENT_ID` in `.env`.
