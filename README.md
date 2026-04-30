# Final Project Frontend

Vue 3 + TypeScript frontend for a furniture ecommerce final project. This repository contains the customer-facing web app, while the backend is developed separately.

## Project Overview

The app focuses on a storefront experience with discovery, product browsing, product detail flows, room inspiration pages, account/auth flows, and post-purchase pages. It is built as a frontend-only project that connects to a separate backend.

## Key Features

- Home page and catalog browsing
- Product listing, product detail, room, and product-set detail pages
- Search flow
- Cart, favorites, orders, and account pages
- Login and registration pages
- Route guards for authenticated areas (`/cart`, `/favorites`, `/orders`, `/account`)
- Localization with Ukrainian and English UI locales
- Storybook setup for component development

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Bun
- Pinia
- Vue Router
- PrimeVue
- Tailwind CSS
- vue-i18n
- Storybook

## Folder Structure

```text
.
├── src/
│   ├── api/           # Data-access and integration modules
│   ├── assets/        # Global styles and static frontend assets
│   ├── components/    # Atomic Design components (atoms, molecules, organisms, templates)
│   ├── composables/   # Reusable Vue composition utilities
│   ├── data/          # Static frontend data helpers
│   ├── i18n/          # Localization setup and locale dictionaries
│   ├── pages/         # Route-level pages
│   ├── router/        # Vue Router configuration
│   ├── stores/        # Pinia stores
│   ├── stories/       # Storybook stories/examples
│   └── utils/         # Shared utility code
├── public/            # Public static assets
└── vite.config.ts     # Vite config
```

## Installation

Use Bun as the primary package manager.

```sh
bun install
```

## Running Locally

Start the frontend dev server:

```sh
bun run dev
```

Then open the Vite URL shown in the terminal.

## Backend Expectations

- The frontend expects a backend to be available during local development.
- Keep the backend running on **port 3000**.

## Available Scripts

- `bun run dev` — start the Vite dev server
- `bun run build` — type-check and build for production
- `bun run build-only` — build without the type-check wrapper
- `bun run preview` — preview the production build locally
- `bun run type-check` — run `vue-tsc`
- `bun run lint` — run all lint steps
- `bun run lint:oxlint` — run Oxlint with autofix
- `bun run lint:eslint` — run ESLint with autofix and cache
- `bun run format` — run Prettier on `src/`
- `bun run storybook` — start Storybook on port 6006
- `bun run build-storybook` — build Storybook

## Routes and App Areas

Current router entries include:

- `/` — home
- `/cat/:categorySlug` — product listing
- `/p/:productId` — product detail
- `/rooms` and `/rooms/:roomId` — room discovery/details
- `/rooms/:roomId/sets/:setId` — product set detail
- `/search` — search
- `/cart`, `/favorites`, `/orders`, `/orders/:orderId`, `/account` — authenticated user flows
- `/login`, `/register`
- `/terms-and-conditions`

## Localization

- Supported locales: `uk` and `en`
- Default locale: `uk`
- Fallback locale: `en`
- Locale is persisted in `localStorage`
- UI strings are managed through `vue-i18n` in `src/i18n/`
- Domain content is expected to come from the backend rather than be translated in the frontend
