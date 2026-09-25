# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install         # Install dependencies (pnpm only, see Package manager below)
pnpm dev             # Start dev server (localhost:4321)
pnpm build           # Production build (astro build → dist/)
pnpm preview         # Preview production build locally
pnpm optimize-images # Run Sharp-based image optimization script
pnpm audit           # Audit dependencies (npm audit fails, there is no package-lock.json)
```

No test suite, linter or type check is configured. `astro check` does not work here either, because neither `@astrojs/check` nor `typescript` is a declared dependency, so the strict `tsconfig.json` currently checks nothing. Verify changes with `pnpm build`.

## Architecture

This is the **Codebrand** agency website — an Astro 7 SSR app deployed on Netlify. Canonical host: https://www.codebrand.us (the apex 301s to www). Two markets: US (English) and Honduras (Spanish, under `/hn/`).

### Rendering & Deployment

- `output: 'server'` via `@astrojs/netlify`, configured with `edgeMiddleware: false` (no edge functions). A route is server rendered unless it sets `export const prerender = true`. Most routes do set it (including `/`), but 28 do not and therefore run on a Netlify function on every request: `/contact`, `/404`, every `/hn/` page, every `/landing/template-*`, the `blog`, `books`, `products`, `projects`, `countryareas` and `team` index pages, `rss.xml.ts` and `api/health.ts`. Check the flag whenever you add or touch a page, because leaving it out silently takes that page off the CDN.
- Static assets in `public/` (icons, photos, fonts); reference with absolute paths (`/icons/...`, not `./icons/...`) — relative paths break on nested routes like `/hn/`
- CSS: TailwindCSS 4 via Vite plugin + lightningcss for minification and oklch fallbacks
- React islands via `@astrojs/react` with `client:*` directives (used sparingly — most UI is Astro components)

### Content Collections (Astro 7 glob loaders)

Defined in `src/content.config.ts`. Collections: `blog`, `books`, `products`, `countryareas`, `regions`, `projects`, `locations`. All load `**/*.md` under `src/content/<collection>/`, so an `.mdx` file inside a collection folder is ignored even though the `@astrojs/mdx` integration is installed. Dynamic routes at `src/pages/<collection>/[id].astro`.

### Component Config Pattern

Home page components (Hero, CaseStudies, ValueProposition, HowWeWork, BudgetModel, Faq, TechMarquee, PartnershipBanner, Ourteam) accept a `config?: Partial<Config>` prop with full defaults. This enables page variants (like `/hn/`) to override all text without changing the component:

```astro
interface Props {
  config?: Partial<SomeConfig>;
}
const c = { ...defaults, ...Astro.props.config };
```

For HTML-containing text (subtitles with `<span>`, `<a>` tags), use `<Fragment set:html={c.subtitle} />`.

### Service Pages

One template: **ServicePageTemplateV4.astro**. The nine service pages under `src/pages/services/` use it and define their data inline (see `src/pages/services/web-development.astro`). The tenth file there, `index.astro`, is the services listing and uses no template.

An older system (`ServicePageTemplate.astro`, `src/components/service-sections/` and nine configs in `src/configs/services/`) was deleted in September 2026 because no page imported it.

### Key Directories

- `src/configs/business.ts` — Centralized NAP (name, address, phone) and contact info. Single source of truth for Schema.org data.
- `src/utils/schema.ts` — Schema.org structured data generators (service, FAQ, HowTo, breadcrumb schemas). Imports from `business.ts`.
- `src/data/` — Static data files (testimonials). The site publishes no prices: every engagement is a fixed-price proposal built from the client's budget (see `src/components/BudgetModel.astro` and `/quoter/`).
- `src/lib/` — Utilities: HTML sanitization, form validation.
- `src/layouts/` — Layout.astro (main), LandingLayout.astro, HnLayout.astro (Honduras), BriefLayout.astro (the `/brief/` tool).
- `src/actions/index.ts`: Astro Actions, the only write path of the `/brief/` tool. It validates with the same Zod schemas the questions declare.
- `src/features/brief/`: the `/brief/` tool (React island plus its own config, lib and services). It persists to Supabase, has its own notes in `src/features/brief/README.md`, and its SQL lives in `supabase/migrations/`.

### API Routes

SSR endpoints under `src/pages/api/`:
- `contact.ts` — Contact form handler. Uses Resend for email and Turso (libSQL) both for IP rate limiting (`rate_limits`) and for storing submissions (`contacts`). CSRF origin checking.
- `health.ts` — Health check.

Environment variables (set in Netlify): `TURSO_AUTH_TOKEN`, `TURSO_DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, plus `BRIEF_SUPABASE_URL` and `BRIEF_SUPABASE_SERVICE_ROLE_KEY` for the `/brief/` tool.

### SEO Pages

Programmatic location/region pages for local SEO across US, LATAM, and Spain. Content in `src/content/locations/` and `src/content/regions/`, rendered by `src/pages/locations/[id].astro` and `src/pages/regions/[id].astro`.

### Package manager

pnpm only. `packageManager` pins `pnpm@11.9.0` and the repo ships `pnpm-lock.yaml` with no `package-lock.json`, so:

- install with `pnpm install`
- audit with `pnpm audit` (`npm audit` fails without a `package-lock.json`)
- verify with `pnpm build`

`.npmrc` is intentionally empty: it does not set `legacy-peer-deps` and nothing here needs it.
