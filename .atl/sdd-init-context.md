# SDD Init Context — BookingIncaTrail

**Detected**: 2026-07-08
**Repo root**: /home/aekma/PERSONAL/BookingIncaTrail
**Persistence mode requested**: engram (mem_save tool unavailable in this session — see note at bottom)

## Stack

- Next.js 15.1.11, Pages Router (`src/pages`), no `app/` directory.
- React 19.2.3 / React DOM 19.2.3.
- Language: plain JavaScript (`jsconfig.json`, `@/*` -> `src/*`), no TypeScript.
- MongoDB + Mongoose 8.9.5 for persistence (trips, users).
- React Admin 5.14.3 mounted at `/admin/ra/[[...slug]]` (resources: trips, users).
- next-seo 6.6.0 for per-page SEO; @next/third-parties for GTM.
- Resend (contact form email) + Google reCAPTCHA.
- nextjs-cors for API route CORS.
- PayPal (react-paypal-button-v2) present but WeTravel (external checkout) + WhatsApp fallback is the active booking flow.
- Tailwind CSS 3.4.19 + PostCSS + Autoprefixer; Prettier configured (`.prettierrc`, no format script wired).
- i18n via Next.js built-in i18n routing: locales `es`/`en`, default `en`.
- Deployment: DigitalOcean VPS (per `.env.example` and `ecosystem.config.js` - PM2), not Vercel.

## Architecture

Layered: `page -> service -> repository -> MongoDB`.

- `src/pages` - public routes, admin routes, sitemaps, API routes.
- `src/components` - UI (category/, general/, home/, navbar/, travel/).
- `src/modules/trips`, `src/modules/auth`, `src/modules/users` - domain: controller, service, repository, model.
- `src/lib` - brand config, MongoDB connection, sitemap, GTM, WordPress client (present but apparently unused from pages), API client.
- `src/utils` - categories, CORS, images, validation, cache helpers.
- `src/data` - includes build-time generated `navbarSnapshot.json` (via `npm run navbar:generate`, wired into `npm run build`).
- `src/store` - global state via Context API.
- `src/lang/{es,en}` - bilingual copy; both must be updated together for any user-facing text change.
- `scripts/` - `generate-navbar-snapshot.mjs`, `migrate-trip-gallery-local.mjs` (only 2 scripts exist on disk; `backup-mongodb.js` and `generate-favicons.js` are referenced in package.json but missing from the repo tree - known gap, confirmed in docs/MIGRACION-v2.md).

Current data model: single flexible `Trip` Mongoose collection, one document per (slug, lang) pair, with loosely-typed arrays (`gallery`, `information`, `quickstats`, `ardiscounts`). Categories and FAQs are hardcoded in code (`categoryHelpers.js`, `CategoryFAQs.js`), not stored in DB.

## Known Architecture Debt / Risks (from docs/MIGRACION-v2.md)

- `Trip` model too flexible/monolithic; hard to validate, migrate, or drive SEO/admin reliably.
- i18n by duplicate documents per `lang` rather than a translation table; `getTripBySlug` requires exact `lang` match (no `lang: 'all'` fallback) - can 404.
- SEO multilanguage issues: canonical/hreflang problems, hardcoded `og:locale`, fake `aggregateRating` (structured data risk).
- Some admin GET endpoints (`/api/admin/trip`, `/api/admin/trip/[id]`) reportedly unauthenticated.
- Local image storage under `public/storage` is not durable for ephemeral deploys.
- Gallery/quickstats depend on array position/order rather than explicit roles/keys (fragile).
- Free-form HTML in `description`/`information` fields - XSS/sanitization risk.
- Hardcoded per-slug availability logic (only 3 slugs wired to an external API via a `switch`).
- `docs/tour-page/REDISEÑO-BD.md` defines a target normalized MongoDB schema (categories, category_translations, tours, tour_translations, tour_sections(+translations), media, tour_images, faqs(+translations), reviews(+translations)) intended as the "north star" for a future migration - design-only, not implemented yet.
- Migration analysis recommends: Pages Router -> App Router, JS -> TypeScript, Mongoose loose schema -> normalized model, next-seo -> Metadata API, local storage -> Cloudinary/S3/R2, by phases with idempotent migration scripts.

## Conventions (from GEMINI.md - de facto agent instructions; no AGENTS.md/CLAUDE.md/.cursorrules present)

- Next.js 15: `<Link>` needs no `<a>` child; `<Image>` uses `fill` not `layout="fill"`; `next.config.js` uses `remotePatterns`.
- API routes live in `pages/api/` (actually `src/pages/api/`); protected routes use `auth(req, res)` middleware; response shape is `{ msg, data }` or `{ err }`.
- Always `await connectDB()` before Mongoose operations; models under `src/modules/*/model/*.model.js` (not a flat `src/models/` as GEMINI.md states - GEMINI.md is slightly stale here).
- Tailwind utility classes; global styles in `src/styles/globals.css`.
- Any user-facing text change must update both `src/lang/es` and `src/lang/en`.
- Run `npm run backup` before modifying the DB.
- Use `sizes` prop with `next/image`.
- Never expose JWT secrets via `NEXT_PUBLIC_*`.

## Persistence

- Mode requested: **engram**. No `openspec/` directory created (per Hard Rules).
- Registry written to `.atl/skill-registry.md` (project root).
- Project-level skills: `seo-optimizer`, `frontend-design` (`.claude/skills/`).

## IMPORTANT — Engram unavailable

The `mem_save` / `mem_search` / `mem_get_observation` MCP tools were not exposed
in this execution session (only Read/Edit/Write/Bash were available). This file
and `.atl/testing-capabilities.md` are a **local fallback** so the detected
context is not lost. When the Engram MCP server is reachable, run:

```
mem_save(
  title: "sdd-init/BookingIncaTrail",
  topic_key: "sdd-init/BookingIncaTrail",
  type: "architecture",
  project: "BookingIncaTrail",
  capture_prompt: false,
  content: <contents of this file>
)
mem_save(
  title: "sdd/BookingIncaTrail/testing-capabilities",
  topic_key: "sdd/BookingIncaTrail/testing-capabilities",
  type: "config",
  project: "BookingIncaTrail",
  capture_prompt: false,
  content: <contents of .atl/testing-capabilities.md>
)
mem_save(
  title: "skill-registry",
  topic_key: "skill-registry",
  type: "config",
  project: "BookingIncaTrail",
  capture_prompt: false,
  content: <contents of .atl/skill-registry.md>
)
```

## Recommended Next Step

`sdd-explore` - the migration analysis (`docs/MIGRACION-v2.md`) and DB redesign brief (`docs/tour-page/REDISEÑO-BD.md`) already exist as strong exploration input for a future `sdd-propose` targeting the App Router + TypeScript + normalized-schema migration.
