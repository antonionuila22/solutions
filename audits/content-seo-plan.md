# Content & Index Plan — Fix Duplicate/Thin Content (codebrand.us)

> Goal: get Google to index the pages it's currently dropping as "duplicate / thin / crawled-not-indexed", by making each page substantial, unique, and oriented to its specific entity (zone, product, service).

## Diagnosis (verified)
- Programmatic pages: **121 locations + 77 regions + 10 countryareas + 12 products ≈ 220**.
- Fields ARE populated (every location has `longDescription`, `faqs`, `localStats`) — but each page is **~490 words, 0 lines of body**. Content lives in structured fields rendered in an identical layout with only the entity name swapped.
- Result: near-duplicate, thin pages → Google: *"Duplicate, Google chose a different canonical"* / *"Crawled – currently not indexed"* / *"Discovered – currently not indexed"*.

## Root causes
1. **Thin** — ~490 words; below the ~800–1,400 unique-word threshold needed to differentiate from 120 siblings.
2. **Formulaic** — same sentence templates, swapped city/region → low uniqueness ratio.
3. **Index bloat** — 220 thin pages dilute site quality + crawl budget. (Google's helpful-content signals penalize mass thin pages.)

## Strategy — 3 levers

### A. Triage the index (keep / merge / noindex)
- Pull the **Search Console "Pages" report** ("Why pages aren't indexed" → duplicate / crawled-not-indexed lists).
- **Keep + enrich** the zones/products/services you actually target.
- **noindex or consolidate** the long-tail you don't target or can't make genuinely unique.
- Principle: **40 strong indexed pages beat 220 thin ignored ones.**

### B. Enrich the keepers — unique, entity-oriented content (target 900–1,400 unique words)
Per page type, MANDATORY unique blocks (no shared boilerplate phrasing):
- **Locations** — city-specific intro; the industries that actually dominate that city; areas/neighborhoods served; 3–4 **city-specific** FAQs; real local stats; "why businesses in {city} choose us" with local angle; nearby areas.
- **Regions** — regional economy, major cities, region-specific industries + FAQs.
- **Products/Services** — product-specific benefits, use cases, specs, deliverables, pricing context, unique FAQs (not generic).
- **Vary structure + wording** so no two pages read alike.

### C. Keyword orientation per entity
- `title` / `H1` / `meta` / `og`: e.g. *"{Service} in {City}, {State} | Codebrand"* + local intent terms.
- Body weaves the entity's real target keywords (from your MD).
- Internal linking: hub→spoke (region → its cities; service → relevant locations) for topical authority.

## Template work (so the unique content actually surfaces)
- `/locations/[id]` + `/regions/[id]`: render ALL unique fields prominently; ensure unique `<title>`/meta/single-H1 per page.
- Self-canonical (already fixed via the www-anchor change), `BreadcrumbList` + `LocalBusiness` schema per location.
- Confirm none of these are accidentally canonicaled away or sitemap-excluded.

## Execution options (for the ~220 pages)
1. **Multi-agent content pass** (workflow) — fan out unique-content generation per entity (fastest at scale). *Requires your go-ahead to run a workflow.*
2. **Prioritize top-N** target zones/products + `noindex` the long tail (leanest, safest for site quality).
3. **You provide copy** per page; I wire it in.

## Validation
- Re-submit sitemap; track Search Console **Pages → indexed vs not** over 2–4 weeks. Spot-check uniqueness.

## What I need from your MD
1. **Page list** (URLs / which entities).
2. Per page or per type: **target keywords + content angle/specifics + priority**.
3. (If available) **Search Console export** of the "not indexed / duplicate" pages.
4. **Who writes the unique copy** — I generate per-entity, or you supply it.
