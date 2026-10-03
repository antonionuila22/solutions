#!/usr/bin/env node
/**
 * Post-build SEO and markup guard.
 *
 * Every rule here exists because the problem it catches actually shipped and
 * was found later by an external crawl, not by us. The point is that the next
 * one fails the build instead.
 *
 * Usage:
 *   node scripts/seo-check.mjs            # fails the build on any error
 *   node scripts/seo-check.mjs --warn     # report only, always exit 0
 *   node scripts/seo-check.mjs --live     # fetch the deployed site instead
 *
 * The default mode reads dist/, which is fast and runs on every build, but it
 * can only see prerendered pages. This project renders 28 routes on demand, so
 * they leave no file behind and the build mode is blind to them. That blind
 * spot hid 15 real defects until a live crawl found them, including ten landing
 * pages with no <main> at all. Run --live against the deploy to cover those.
 *
 * It parses the built HTML in dist/ with regular expressions rather than a DOM
 * library, deliberately: the checks are structural and local, the input is our
 * own generated markup, and adding a parser dependency to run on every build is
 * a worse trade than a few careful patterns. Where a rule would need real
 * parsing to be correct, it is written to under-report rather than to guess.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const DIST = "dist";
const PAGES_DIR = join("src", "pages");
const WARN_ONLY = process.argv.includes("--warn");

// Length limits. Google truncates around these; they are not hard SEO rules,
// so they are warnings rather than errors.
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

const errors = [];
const warnings = [];

const err = (page, rule, detail) => errors.push({ page, rule, detail });
const warn = (page, rule, detail) => warnings.push({ page, rule, detail });

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const stripTags = (s) => s.replace(/<[^>]+>/g, "").trim();

/**
 * Length limits are about what a person sees in a search result, so entities
 * have to be decoded first: "&amp;" occupies five characters in the markup and
 * one on screen. Measuring the raw HTML reports titles as too long when they
 * are not.
 */
const decodeEntities = (s) =>
  s
    .replace(/&(amp|#38);/g, "&")
    .replace(/&(lt|#60);/g, "<")
    .replace(/&(gt|#62);/g, ">")
    .replace(/&(quot|#34);/g, '"')
    .replace(/&(#39|apos|#x27);/g, "'")
    .replace(/&(nbsp|#160);/g, " ")
    .replace(/&(hellip|#8230);/g, "\u2026");

const visibleLength = (s) => decodeEntities(stripTags(s)).length;

/** Attributes of one tag, as a plain object. Quoted values only, which is what Astro emits. */
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z-:@]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

/** Strip <script>, <style> and comments so their contents never match a rule. */
function withoutInertRegions(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function checkPage(file, html, pages) {
  const page = "/" + relative(DIST, file).split(sep).join("/").replace(/index\.html$/, "");
  const body = withoutInertRegions(html);

  // ── Landmarks and headings ────────────────────────────────────────────────
  const mains = (body.match(/<main\b/gi) || []).length;
  if (mains > 1) err(page, "multiple-main", `${mains} <main> elements, expected 1`);

  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length > 1) err(page, "multiple-h1", `${h1s.length} <h1> elements`);
  if (h1s.length === 0) warn(page, "missing-h1", "no <h1> on the page");

  const levels = [...body.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      err(page, "heading-jump", `h${levels[i - 1]} followed by h${levels[i]}`);
      break; // one report per page is enough to act on
    }
  }

  // ── Images ────────────────────────────────────────────────────────────────
  for (const m of body.matchAll(/<(img|source)\b([^>]*)>/gi)) {
    const tag = m[0];
    const a = attrs(tag);
    const src = a.src || a.srcset || "";
    const first = src.split(",")[0].trim().split(/\s+/)[0];

    if (first.startsWith("//")) {
      err(page, "protocol-relative-src", first);
    } else if (first && !/^(https?:|data:|blob:|\/)/.test(first)) {
      // A src without a leading slash resolves against the current route, so
      // the same file 404s on nested pages and works on the home page.
      err(page, "route-relative-src", first);
    }

    if (m[1].toLowerCase() === "img") {
      if (a.alt === undefined) err(page, "img-missing-alt", first || "(no src)");
      if (!a.width || !a.height) {
        // Explicit intrinsic size is what stops the image contributing CLS.
        warn(page, "img-missing-dimensions", first || "(no src)");
      }
    }
  }

  // ── Links ─────────────────────────────────────────────────────────────────
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const a = attrs("<a" + m[1] + ">");
    const inner = m[2];
    const text = stripTags(inner);
    const imgAlt = [...inner.matchAll(/<img\b[^>]*>/gi)]
      .map((i) => attrs(i[0]).alt || "")
      .join("")
      .trim();
    const accessible = text || (a["aria-label"] || "").trim() || imgAlt || (a.title || "").trim();
    if (!accessible) err(page, "link-without-text", a.href || "(no href)");

    if (a.href === "https://www.codebrand.us") {
      err(page, "home-without-slash", "link to the bare host costs a redirect hop");
    }

    // Internal link to a page we did not build. Query strings and fragments are
    // stripped; anything the server renders on demand is unknown here, so only
    // flag paths that look like static pages.
    if (a.href && a.href.startsWith("/") && !a.href.startsWith("//")) {
      const path = a.href.split("#")[0].split("?")[0];
      if (path && !/\.[a-z0-9]{2,5}$/i.test(path)) {
        const normalized = path.endsWith("/") ? path : path + "/";
        const known =
          pages.exact.has(normalized) || pages.dynamic.some((p) => normalized.startsWith(p));
        if (!known) err(page, "internal-link-dead", normalized);
      }
    }
  }

  // ── Head ──────────────────────────────────────────────────────────────────
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  if (!title) err(page, "missing-title", "no <title>");
  else if (visibleLength(title) > TITLE_MAX) {
    warn(page, "title-too-long", `${visibleLength(title)} chars: ${decodeEntities(stripTags(title))}`);
  }

  const descTag = html.match(/<meta[^>]*name="description"[^>]*>/i);
  if (!descTag) err(page, "missing-description", "no meta description");
  else {
    const content = decodeEntities(attrs(descTag[0]).content || "");
    if (content.length > DESCRIPTION_MAX) {
      warn(page, "description-too-long", `${content.length} chars`);
    }
  }

  // A page that tells robots not to index it does not need to nominate a
  // canonical, and the /brief/ tool is deliberately noindex, nofollow.
  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);
  if (!noindex && !/<link[^>]*rel="canonical"/i.test(html)) {
    err(page, "missing-canonical", "no canonical tag");
  }

  // ── Structured data ───────────────────────────────────────────────────────
  const seenIds = new Map();
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    let parsed;
    try {
      parsed = JSON.parse(m[1]);
    } catch (e) {
      err(page, "jsonld-invalid", e.message.slice(0, 80));
      continue;
    }
    const nodes = Array.isArray(parsed)
      ? parsed
      : parsed["@graph"] && Array.isArray(parsed["@graph"])
        ? parsed["@graph"]
        : [parsed];
    for (const node of nodes) {
      const id = node && node["@id"];
      if (!id) continue;
      seenIds.set(id, (seenIds.get(id) || 0) + 1);
    }
  }
  for (const [id, count] of seenIds) {
    if (count > 1) {
      // Two nodes under one @id are merged by consumers, so a partial second
      // node can strip required fields off the complete one.
      err(page, "jsonld-duplicate-id", `${id} appears ${count} times`);
    }
  }

  return { page, html };
}

// ── hreflang reciprocity, which needs every page before it can be judged ─────
function checkHreflang(parsed) {
  const map = new Map();
  for (const { page, html } of parsed) {
    const links = [];
    for (const m of html.matchAll(/<link[^>]*rel="alternate"[^>]*>/gi)) {
      const a = attrs(m[0]);
      if (a.hreflang && a.href) links.push({ lang: a.hreflang, href: a.href });
    }
    if (links.length) map.set(page, links);
  }

  const toPath = (href) => {
    try {
      return new URL(href).pathname;
    } catch {
      return href;
    }
  };

  for (const [page, links] of map) {
    for (const { lang, href } of links) {
      if (lang === "x-default") continue;
      const target = toPath(href);
      if (target === page) continue;
      const theirs = map.get(target);
      // Only judge pages this build produced. A server rendered counterpart is
      // not in dist/, and reporting it would be noise, not a finding.
      if (!theirs) continue;
      const reciprocal = theirs.some((l) => toPath(l.href) === page);
      if (!reciprocal) {
        err(page, "hreflang-not-reciprocal", `declares ${lang} -> ${target}, which does not point back`);
      }
    }
  }
}

// ── Live mode ────────────────────────────────────────────────────────────────
const LIVE = process.argv.includes("--live");
const BASE =
  (process.argv.find((a) => a.startsWith("--base=")) || "").split("=")[1] ||
  "https://www.codebrand.us";

/** Routes this project renders on demand, read from src/pages so the list cannot drift. */
function serverRenderedRoutes() {
  const routes = [];
  if (!existsSync(PAGES_DIR)) return routes;
  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        visit(full);
        continue;
      }
      if (!name.endsWith(".astro")) continue;
      const source = readFileSync(full, "utf8");
      if (/export\s+const\s+prerender\s*=\s*true/.test(source)) continue;
      const route =
        "/" +
        relative(PAGES_DIR, full)
          .split(sep)
          .join("/")
          .replace(/\.astro$/, "")
          .replace(/(^|\/)index$/, "$1");
      if (route.includes("[")) continue; // needs a real param, skipped
      if (route === "/404") continue; // answering 404 is this route's job
      routes.push(route.endsWith("/") ? route : route + "/");
    }
  };
  visit(PAGES_DIR);
  return routes;
}

async function runLive() {
  const routes = serverRenderedRoutes();
  console.log(`seo-check --live: fetching ${routes.length} server rendered routes from ${BASE}`);
  const fetched = [];
  for (const route of routes) {
    try {
      const res = await fetch(BASE + route, { headers: { "User-Agent": "codebrand-seo-check" } });
      if (!res.ok) {
        warn(route, "live-fetch-failed", `HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      fetched.push(checkPageLive(route, html));
    } catch (e) {
      warn(route, "live-fetch-failed", String(e.message).slice(0, 60));
    }
  }
  checkHreflang(fetched);
  return fetched.length;
}

/** Same rules as the build mode, minus the internal link check, which needs the full route set. */
function checkPageLive(route, html) {
  // pages is already populated with the build's routes plus src/pages, so the
  // internal link rule stays meaningful here.
  const { page } = checkPage(join(DIST, route, "index.html"), html, pages);
  return { page: route, html };
}

// ── Run ──────────────────────────────────────────────────────────────────────
if (!existsSync(DIST)) {
  console.error(`seo-check: ${DIST}/ not found. Run the build first.`);
  process.exit(1);
}

const files = walk(DIST);

/**
 * Every route the site can serve, which is NOT the same as every file in dist/.
 * Routes without `export const prerender = true` are rendered on demand by a
 * Netlify function and leave no file behind, so judging internal links by dist/
 * alone reports thousands of working links as broken.
 *
 * Returns { exact, dynamic } where `dynamic` holds the prefixes of routes built
 * from a [param] segment, which this check treats as matching anything below.
 */
function knownRoutes() {
  const exact = new Set(
    files.map((f) => "/" + relative(DIST, f).split(sep).join("/").replace(/index\.html$/, "")),
  );
  const dynamic = [];
  if (!existsSync(PAGES_DIR)) return { exact, dynamic };

  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        visit(full);
        continue;
      }
      if (!/\.(astro|md|mdx|ts|js)$/.test(name)) continue;
      const route =
        "/" +
        relative(PAGES_DIR, full)
          .split(sep)
          .join("/")
          .replace(/\.(astro|md|mdx|ts|js)$/, "")
          .replace(/(^|\/)index$/, "$1");
      if (route.includes("[")) {
        // /blog/[id] -> anything under /blog/ resolves at request time.
        dynamic.push(route.slice(0, route.indexOf("[")));
      } else {
        exact.add(route.endsWith("/") ? route : route + "/");
      }
    }
  };
  visit(PAGES_DIR);
  return { exact, dynamic };
}

const pages = knownRoutes();

let scanned;
if (LIVE) {
  scanned = await runLive();
} else {
  const parsed = [];
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    parsed.push(checkPage(file, html, pages));
  }
  checkHreflang(parsed);
  scanned = files.length;
}

const group = (list) => {
  const by = new Map();
  for (const item of list) {
    if (!by.has(item.rule)) by.set(item.rule, []);
    by.get(item.rule).push(item);
  }
  return [...by.entries()].sort((a, b) => b[1].length - a[1].length);
};

const report = (label, list, limit) => {
  if (!list.length) return;
  console.log(`\n${label} (${list.length})`);
  for (const [rule, items] of group(list)) {
    console.log(`  ${rule}: ${items.length}`);
    for (const i of items.slice(0, limit)) console.log(`      ${i.page}  ${i.detail}`);
    if (items.length > limit) console.log(`      ... and ${items.length - limit} more`);
  }
};

console.log(`seo-check: scanned ${scanned} ${LIVE ? "live server rendered" : "built"} pages`);
report("WARNINGS", warnings, 3);
report("ERRORS", errors, 8);

if (!errors.length && !warnings.length) console.log("\nNo issues found.");

if (errors.length && !WARN_ONLY) {
  console.error(`\nseo-check failed: ${errors.length} error(s).`);
  process.exit(1);
}
process.exit(0);
