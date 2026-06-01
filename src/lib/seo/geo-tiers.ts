/**
 * Geo SEO tiers — controls indexability of programmatic location/region pages.
 *
 * Decision (2026-06): every location and region service-area page is now ENRICHED
 * with unique, substantial local content (longDescription, local industries,
 * market highlights, local FAQs, regional stats, major cities). They are therefore
 * INDEXED by default — index,follow + included in the sitemap.
 *
 * Quality gate: a page should only ship indexed if it has genuinely unique local
 * content. To keep a specific page OUT of the index (a thin draft, or a market we
 * don't yet serve), add its slug — the markdown filename without the extension —
 * to the matching EXCLUDED_* set below. Empty sets = every geo page is indexed.
 */

/** Location slugs (src/content/locations/<slug>.md) to keep NOINDEXED. Empty = all indexed. */
export const EXCLUDED_LOCATIONS = new Set<string>([
  // e.g. "some-thin-city" — add ONLY to keep a page out of the index
]);

/** Region slugs (src/content/regions/<slug>.md) to keep NOINDEXED. Empty = all indexed. */
export const EXCLUDED_REGIONS = new Set<string>([
  // e.g. "some-thin-region" — add ONLY to keep a page out of the index
]);

/** A location page is a hub (indexable) unless explicitly excluded. */
export const isLocationHub = (slug: string): boolean => !EXCLUDED_LOCATIONS.has(slug);

/** A region page is a hub (indexable) unless explicitly excluded. */
export const isRegionHub = (slug: string): boolean => !EXCLUDED_REGIONS.has(slug);

/**
 * True when a sitemap URL is an EXCLUDED geo page that must be left out of the
 * sitemap (so we never advertise a noindexed page to Google). With both EXCLUDED_*
 * sets empty, this returns false for every geo URL (all are advertised).
 */
export function isLongtailGeoUrl(url: string): boolean {
  const loc = url.match(/\/locations\/([^/]+)\/?$/);
  if (loc) return !isLocationHub(loc[1]);
  const reg = url.match(/\/regions\/([^/]+)\/?$/);
  if (reg) return !isRegionHub(reg[1]);
  return false;
}
