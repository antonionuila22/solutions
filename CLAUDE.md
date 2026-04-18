# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build (astro build → dist/)
npm run preview      # Preview production build locally
npm run optimize-images  # Run Sharp-based image optimization script
```

No test suite or linter is configured. Verify changes with `npm run build`.

## Architecture

This is the **Codebrand** agency website — an Astro 6 SSR app deployed on Netlify. Site: codebrand.us. Two markets: US (English) and Honduras (Spanish, under `/hn/`).

### Rendering & Deployment

- `output: 'server'` — all pages are SSR by default via `@astrojs/netlify`
- Static assets in `public/` (icons, photos, fonts); reference with absolute paths (`/icons/...`, not `./icons/...`) — relative paths break on nested routes like `/hn/`
- CSS: TailwindCSS 4 via Vite plugin + lightningcss for minification and oklch fallbacks
- React islands via `@astrojs/react` with `client:*` directives (used sparingly — most UI is Astro components)

### Content Collections (Astro 6 glob loaders)

Defined in `src/content.config.ts`. Collections: `blog`, `books`, `products`, `countryareas`, `regions`, `projects`, `locations`. All use markdown files under `src/content/<collection>/`. Dynamic routes at `src/pages/<collection>/[id].astro`.

### Component Config Pattern

Home page components (Hero, CaseStudies, ValueProposition, HowWeWork, Pricing, Faq, TechMarquee, PartnershipBanner, Ourteam) accept a `config?: Partial<Config>` prop with full defaults. This enables page variants (like `/hn/`) to override all text without changing the component:

```astro
interface Props {
  config?: Partial<SomeConfig>;
}
const c = { ...defaults, ...Astro.props.config };
```

For HTML-containing text (subtitles with `<span>`, `<a>` tags), use `<Fragment set:html={c.subtitle} />`.

### Service Pages — Two Template Systems

1. **ServicePageTemplate.astro** — Original template importing from `src/components/service-sections/` (HeroSection, ServicesGrid, BenefitsSection, ProcessSection, etc.). Used by older service pages via configs in `src/configs/services/*.config.ts`.

2. **ServicePageTemplateV4.astro** — Newer template. Service pages under `src/pages/services/` define data inline and pass it directly (see `src/pages/services/web-development.astro`).

### Key Directories

- `src/configs/business.ts` — Centralized NAP (name, address, phone) and contact info. Single source of truth for Schema.org data.
- `src/utils/schema.ts` — Schema.org structured data generators (service, FAQ, HowTo, breadcrumb schemas). Imports from `business.ts`.
- `src/data/` — Static data files (testimonials, quiz data, quoter pricing).
- `src/lib/` — Utilities: HTML sanitization, form validation.
- `src/layouts/` — Layout.astro (main), LandingLayout.astro, HnLayout.astro (Honduras).

### API Routes

SSR endpoints under `src/pages/api/`:
- `contact.ts` — Contact form handler. Uses Resend for email, Turso (libSQL) for rate limiting. CSRF origin checking.
- `contactValidate.ts` — Email validation endpoint.
- `health.ts` — Health check.

Environment variables (set in Netlify): `TURSO_AUTH_TOKEN`, `TURSO_DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_RECIPIENT_EMAIL`.

### SEO Pages

Programmatic location/region pages for local SEO across US, LATAM, and Spain. Content in `src/content/locations/` and `src/content/regions/`, rendered by `src/pages/locations/[id].astro` and `src/pages/regions/[id].astro`.

### npm

`.npmrc` has `legacy-peer-deps=true` — required for dependency resolution.
