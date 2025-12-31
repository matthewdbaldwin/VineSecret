# React Starter

> This repo contains boilerplate code to aid in the creation of a new React app with Redux. Follow the below setup instructions to get started.

### Setup Instructions

> 1. Make sure you have a recent Node.js LTS release installed (Node 18+ works best with the current Vite setup).
> 1. Fork this repo.
> 1. Clone your forked copy of this repo.
>    - `git clone https://github.com/[Your Username]/react_starter.git`
> 1. Change directory into the newly cloned repo.
>    - `cd react_starter`
> 1. Install dependencies so Vite and React can run.
>    - `npm install`
>    - If you hit a `403 Forbidden` fetching packages through a proxy, rerun with proxies disabled:
>      - `npm run install:noproxy`
> 1. Start the Vite dev server (this is what `npm start` is wired to do in `package.json`).
>    - `npm start`
> 1. Open a browser and navigate to `http://localhost:3000` — the app should render from `src/main.jsx` into the `#root` div provided by `index.html`.

### Analytics

- Google Analytics 4 is pre-wired with measurement ID `G-DXQG8V0F15` via the gtag embed. To point to your own property, set `VITE_GA_MEASUREMENT_ID` in a `.env` file and rebuild; the runtime will prefer the env value.

### Email receipts and Gmail

- Guest checkout calls `/api/notifications/guest-order` with the buyer's email address. As long as that backend route is wired to a working mail provider (SMTP relay, SendGrid, Resend, etc.), the same payload can deliver to Gmail inboxes. Deliverability to Gmail depends on your mail service being authorized (SPF/DKIM) and not blocking the sender. If the email service is unreachable, the app falls back to saving the receipt locally and surfaces that status in the confirmation screen.

### Build For Deployment

> 1. Build the project for production.
>    - `npm run build`
>
> **NOTE:** *After building, use `npm run preview` to serve the production bundle locally for smoke testing. Preview binds to port 3000 just like the dev server, as configured in `vite.config.js`.*
