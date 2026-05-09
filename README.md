# Amanchi Events

Amanchi Events is a Next.js prototype for a modern event and community platform. It combines the core event workflows common to Luma-style products with additional organizer operations, guest CRM, segmented campaigns, commerce, analytics, integrations, and enterprise controls.

## Current Prototype

- Organizer dashboard
- Event listing, filtering, and draft creation
- Local JSON database for development persistence
- Cookie-based demo authentication
- Role-aware permissions for owner, manager, check-in, analyst, and viewer roles
- Guest CRM and segmentation surface
- Campaign automation board
- Analytics and registration funnel views
- Commerce, memberships, ticket bundles, sponsors, and accounting surfaces
- Integration and enterprise admin surfaces

## Run Locally

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Demo Accounts

- Owner: `titusemma2017@gmail.com` / `amanchi-owner`
- Manager: `manager@amanchi.test` / `amanchi-manager`
- Check-in: `checkin@amanchi.test` / `amanchi-checkin`

The development database is created automatically at `data/amanchi-db.json` when the API first reads or writes data. That file is ignored by git.

## Next Build Steps

- Build public event pages and checkout flows
- Add real registration, ticketing, waitlist, and approval workflows
- Connect payments, email/SMS/WhatsApp, calendar, and video integrations
- Replace the local JSON database and demo passwords with production auth and a managed database
