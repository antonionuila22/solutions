/**
 * blog.ts — shared server-side helpers for the blog shell
 * (index, category pages, post template, PostCard, RelatedPosts).
 *
 * Everything here runs at render time on the server — zero client JS.
 */

/** A category entry as consumed by the CategoryFilter row. */
export interface CategoryLink {
  slug: string;
  name: string;
  count: number;
}

/**
 * Slug for a category name. MUST stay in sync with the route generation in
 * src/pages/blog/category/[id].astro (it is the same function, imported there).
 */
export const slugifyCategory = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[\/\s&]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Reading time in minutes computed from the raw markdown body at 220 wpm.
 * Falls back to the frontmatter `readtime` (then 1) when the body is empty.
 */
export function readingMinutes(
  body: string | undefined,
  fallback?: number
): number {
  const words = body ? body.split(/\s+/).filter(Boolean).length : 0;
  if (words === 0) return fallback ?? 1;
  return Math.max(1, Math.round(words / 220));
}

/** "Mar 28, 2025" — the compact date used on cards and meta rows. */
export function formatPostDate(
  date: Date | string | undefined,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", options);
}
