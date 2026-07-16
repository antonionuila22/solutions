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

/**
 * Location slugs (src/content/locations/<slug>.md) to keep NOINDEXED (also excluded
 * from the sitemap). Populated 2026-07-15 after a GSC audit: the LATAM + Spain city
 * pages are thin, near-duplicate templated content (many share byte-identical FAQ
 * answers) AND they target the markets we HIRE from, not the US/Honduras markets we
 * SELL to. Noindexing them protects the domain's quality signal and concentrates crawl
 * budget on the US buyer geo + the Honduras home market (both kept indexed).
 */
export const EXCLUDED_LOCATIONS = new Set<string>([
  "alajuela-city", "antigua-guatemala", "antofagasta", "apopa", "arraijan",
  "barcelona", "barranquilla", "bilbao", "bogota", "bucaramanga", "cali",
  "cancun", "cartagena", "cartago-city", "chitre", "coban", "colon-city",
  "concepcion", "cucuta", "david-panama", "escazu", "escuintla", "guadalajara",
  "guatemala-city", "heredia", "huehuetenango", "la-chorrera", "liberia-cr",
  "limon", "madrid", "manizales", "medellin", "mejicanos", "mexico-city",
  "mixco", "monterrey", "panama-city", "pereira", "puebla", "puerto-montt",
  "puntarenas-city", "queretaro", "quetzaltenango", "san-jose-cr", "san-miguel-sv",
  "san-salvador", "santa-ana-sv", "santa-tecla", "santiago-chile", "santiago-panama",
  "sevilla", "soyapango", "temuco", "usulutan", "valencia", "valparaiso",
  "villa-nueva", "vina-del-mar",
]);

/** Region slugs (src/content/regions/<slug>.md) to keep NOINDEXED (non-US/non-HN — same rationale as EXCLUDED_LOCATIONS). */
export const EXCLUDED_REGIONS = new Set<string>([
  "alajuela", "andalucia", "antioquia", "araucania", "atlantico", "biobio",
  "bogota-dc", "bolivar", "cartago", "cataluna", "chiriqui", "ciudad-de-mexico",
  "colon-panama", "comunidad-de-madrid", "comunidad-valenciana", "guanacaste",
  "guatemala-department", "heredia", "jalisco", "la-libertad", "los-lagos",
  "nuevo-leon", "pais-vasco", "panama-oeste", "panama-provincia", "puebla",
  "puntarenas", "queretaro", "quetzaltenango", "quintana-roo", "region-metropolitana",
  "sacatepequez", "san-jose-cr", "san-salvador", "santa-ana-sv", "valle-del-cauca",
  "valparaiso-region", "veraguas",
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
