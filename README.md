# VineSecret

A demo e-commerce site for a fictional Orange County estate winery. Built with React, Redux, and an Express API backend. Features guest checkout, order confirmation emails via Resend, a mobile-first responsive design, and an age gate.

---

## Tech Stack

**Frontend**
- React 18 + Redux + React Router v5
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

- Node.js 18+

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
├── actions/          # Redux actions
├── analytics/        # Google Analytics tracking
├── assets/           # Images, global CSS
│   └── css/app.css   # Design tokens, global utilities
├── components/
│   ├── about/
│   ├── agegate/
│   ├── cart/
│   ├── checkout/
│   ├── contact/
│   ├── footer/
│   ├── header/
│   ├── home/
│   ├── legal/        # Terms of Use, Privacy Policy
│   ├── nav/
│   └── products/
├── data/products.js  # Local product catalogue (with images)
├── reducers/
└── main.jsx

server/
├── data/products.js  # Server-side product data (no images)
├── email/invoice.js  # Order confirmation email template
└── index.js          # Express app
```

---

## Features

- **Guest checkout** — no account required; orders saved to browser local storage
- **Order confirmation email** — sent via Resend on successful checkout
- **Age gate** — sessionStorage-persisted age verification overlay
- **Mobile-first** — bottom tab navigation, wizard checkout on small screens, sticky product CTAs
- **Legal pages** — Terms of Use and Privacy Policy at `/legal/terms` and `/legal/privacy`
- **Product catalogue** — 8 estate wines with tasting notes, pricing, and bottle artwork

---

## Deployment

Build the frontend and serve everything from Express:

```bash
npm run serve
```

Express serves the built `dist/` folder as static files and falls back to `index.html` for client-side routing. Set `SERVER_PORT` to `3000` (or `80`/`443`) and `ALLOWED_ORIGIN` to your production domain in `.env`.

---

## Notes

- This is a demonstration site. No real products are sold and no payments are processed.
- Product images are SVGs bundled by Vite; the Express API serves product data without images and the frontend merges them.
- Google Analytics is wired with measurement ID `G-DXQG8V0F15`. To use your own property, set `VITE_GA_MEASUREMENT_ID` in `.env`.
