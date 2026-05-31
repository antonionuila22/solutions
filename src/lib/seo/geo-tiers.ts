/**
 * Geo SEO tiers — controls indexability of programmatic location/region pages.
 *
 * Problem: ~200 thin, near-duplicate geo pages were flagged "Crawled – currently
 * not indexed" by Google (same ~490-word template, only the place name changes).
 *
 * Fix: only pages with genuinely UNIQUE, substantial local content are "hubs"
 * (index,follow + included in sitemap). Everything else is "longtail"
 * (noindex,follow + excluded from sitemap) to protect crawl budget and site
 * quality. Quality > quantity.
 *
 * HOW TO PROMOTE A PAGE TO A HUB:
 *   Only after its markdown has real, unique local content (local market context,
 *   city-specific FAQs/stats, local proof/case studies), add its slug — the
 *   markdown filename without extension — to the matching set below.
 *
 * Both sets start empty: every geo page is noindexed until it earns hub status.
 */

/** Location slugs (src/content/locations/<slug>.md) that are enriched + indexable. */
export const HUB_LOCATIONS = new Set<string>([
  // e.g. "san-pedro-sula", "new-york-city" — add ONLY after the page has unique content
]);

/** Region slugs (src/content/regions/<slug>.md) that are enriched + indexable. */
export const HUB_REGIONS = new Set<string>([
  // add ONLY after the page has unique content
]);

export const isLocationHub = (slug: string): boolean => HUB_LOCATIONS.has(slug);
export const isRegionHub = (slug: string): boolean => HUB_REGIONS.has(slug);

/**
 * True when a sitemap URL is a NON-hub geo page that must be excluded from the
 * sitemap (so we never advertise a noindexed thin page to Google).
 */
export function isLongtailGeoUrl(url: string): boolean {
  const loc = url.match(/\/locations\/([^/]+)\/?$/);
  if (loc) return !isLocationHub(loc[1]);
  const reg = url.match(/\/regions\/([^/]+)\/?$/);
  if (reg) return !isRegionHub(reg[1]);
  return false;
}
