/**
 * How a region page names its own area in the H1.
 *
 * Some region pages share their name with another page on the site: a city
 * page (Choluteca, Alajuela, New York), a country page (Guatemala, Panamá) or a
 * region in another country (Colón in Honduras and in Panama). Both pages then
 * carried the same H1, "Desarrollo Web en Choluteca", and nearly the same
 * title, so Google had two answers to one search and trusted neither.
 *
 * Each page gets its own search instead. The city page keeps the city, and the
 * region page names the administrative level, which is the whole area it
 * covers: "Desarrollo Web en el departamento de Choluteca".
 *
 * Only colliding names get the qualifier. "Desarrollo Web en Cortés" needs no
 * help, and "Web Development in Florida State" would read worse than the plain
 * name.
 */

export interface RegionHeading {
  /** Words before the place name, e.g. "el departamento de ". */
  before: string;
  /** The place name itself, highlighted in the H1. */
  name: string;
  /** Words after the place name, e.g. " State". */
  after: string;
}

const LEVEL: Record<string, { before?: string; after?: string }> = {
  honduras: { before: "el departamento de " },
  guatemala: { before: "el departamento de " },
  "el-salvador": { before: "el departamento de " },
  colombia: { before: "el departamento de " },
  "costa-rica": { before: "la provincia de " },
  panama: { before: "la provincia de " },
  mexico: { before: "el estado de " },
  chile: { before: "la Región de " },
  usa: { after: " State" },
};

// Areas the collision rule cannot see or would label wrongly. Mexico City is
// not a state, and its region page is about the business districts it lists,
// while the city page covers the city as a whole. The capital's city page is
// named "Washington DC", so no name collides, but a bare "Washington" next to
// it still reads as the capital.
const OVERRIDES: Record<string, RegionHeading> = {
  "ciudad-de-mexico": { before: "", name: "Polanco, Santa Fe y toda la CDMX", after: "" },
  washington: { before: "", name: "Washington", after: " State" },
};

/** Lowercase, no accents, single spaces. "Colón" and "colon" are one name. */
export function placeKey(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

interface Named {
  id: string;
  data: { name?: string; city?: string; country?: string };
}

/**
 * The ids of the regions whose name is also the name of a city, a country or
 * another region anywhere on the site.
 */
export function collidingRegionIds(regions: Named[], locations: Named[], countries: Named[]): Set<string> {
  const taken = new Map<string, number>();
  const add = (name: string | undefined) => {
    if (!name) return;
    const key = placeKey(name);
    taken.set(key, (taken.get(key) ?? 0) + 1);
  };
  for (const entry of locations) add(entry.data.city);
  for (const entry of countries) add(entry.data.name);

  const regionNames = new Map<string, number>();
  for (const entry of regions) {
    const key = placeKey(entry.data.name ?? "");
    regionNames.set(key, (regionNames.get(key) ?? 0) + 1);
  }

  const ids = new Set<string>();
  for (const entry of regions) {
    const key = placeKey(entry.data.name ?? "");
    if (taken.has(key) || (regionNames.get(key) ?? 0) > 1) ids.add(entry.id);
  }
  return ids;
}

export function regionHeading(id: string, name: string, country: string, collides: boolean): RegionHeading {
  if (OVERRIDES[id]) return OVERRIDES[id];
  const level = collides ? LEVEL[country] : undefined;
  return { before: level?.before ?? "", name, after: level?.after ?? "" };
}
