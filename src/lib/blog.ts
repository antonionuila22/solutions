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
  },
  locale: string = "en-US"
): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString(locale, options);
}

/* ── Blog shell i18n ──────────────────────────────────────────────────────
 * The shell (meta rows, ToC, related posts, closing CTA) renders around every
 * post; posts with frontmatter `lang: es` get the Spanish strings, everything
 * else keeps the original English. Post CONTENT is never touched — only the
 * chrome around it. One dictionary here instead of ternaries in templates. */

/** Shell strings, keyed per language. Both shapes must stay identical. */
const SHELL_STRINGS = {
  en: {
    /** Meta row: "By {author}" */
    by: "By",
    /** Meta row / card: "{n} min read" (n interpolated by the template) */
    minRead: "min read",
    tocSummary: "Table of contents",
    tocAside: "On this page",
    relatedOverline: "Keep reading",
    relatedTitle: "Related Articles",
    ctaTitle: "Do you want to read more articles?",
    ctaBody:
      "Visit our blog to explore more content on web development, design, and digital marketing.",
    ctaButton: "Read More Articles",
    breadcrumbHome: "Home",
  },
  es: {
    by: "Por",
    minRead: "min de lectura",
    tocSummary: "Contenido",
    tocAside: "En esta página",
    relatedOverline: "Sigue leyendo",
    relatedTitle: "Artículos relacionados",
    ctaTitle: "¿Quieres leer más artículos?",
    ctaBody:
      "Visita nuestro blog para explorar más contenido sobre desarrollo web, diseño y marketing digital.",
    ctaButton: "Leer más artículos",
    breadcrumbHome: "Inicio",
  },
} as const;

export type BlogShellStrings = (typeof SHELL_STRINGS)["en" | "es"];

/** Shell strings for a post's frontmatter `lang`. Anything but "es" → English. */
export function shellStrings(lang?: string): BlogShellStrings {
  return lang === "es" ? SHELL_STRINGS.es : SHELL_STRINGS.en;
}

/** Intl locale for a post's frontmatter `lang` ("es" → es-HN, else en-US). */
export function postLocale(lang?: string): string {
  return lang === "es" ? "es-HN" : "en-US";
}
