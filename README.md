# Aerial Systems

A local Medusa commerce backend and Next.js storefront for the supplied drone
product documents. The project is based on the [Medusa DTC Starter](https://github.com/medusajs/dtc-starter).

## Local development

Requirements: Node.js 22.23.4 or newer (the project was tested with Node 24),
PostgreSQL (local or Docker, reachable on the configured host and port), and
npm. Environment files contain local credentials and must not be committed.

From the project root:

```bash
npm install
cp apps/backend/.env.template apps/backend/.env
cp apps/storefront/.env.template apps/storefront/.env.local
```

Set `DATABASE_URL` in `apps/backend/.env` to the PostgreSQL database, using the
credentials configured for that database (for example,
`postgres://USER:PASSWORD@localhost:5432/aerial_medusa`), and replace the JWT
and cookie secrets with random values. In `apps/storefront/.env.local`, set
`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` to a key created under Publishable API Keys
in Medusa Admin. The default region is Denmark (`dk`).

Run these in separate terminals:

```bash
npm run backend:dev
```

```bash
npm run storefront:dev
```

Open the Medusa admin at [http://localhost:9000/app](http://localhost:9000/app)
to finish store setup. Create a region, an active sales channel, and a shipping
profile before seeding the catalog. Then run:

```bash
npm run seed --workspace=apps/backend
```

The seed imports the 51 brochure products in eight public catalog categories,
removes the starter apparel examples, and is safe to rerun. Product pricing and
stock are intentionally left unset rather than invented.

Open the storefront at [http://localhost:3000](http://localhost:3000). Manage
products, categories, variants, and verified prices in the Medusa admin.
Checkout remains unavailable until real product prices are added.

Product detail pages use the supplied brochure-derived product images. Set
`NEXT_PUBLIC_SALES_EMAIL` in
`apps/storefront/.env.local` to enable the quote-request email link.

## Project layout

- `apps/backend`: Medusa API, admin, PostgreSQL integration, and catalog seed.
- `apps/backend/src/data/drone-catalog.json`: brochure-derived public catalog.
- `apps/storefront`: Next.js storefront with brochure product galleries.
- `apps/storefront/public/images/products`: copied product images.

Deployment and hosting are intentionally out of scope for this stage.
