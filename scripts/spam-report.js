#!/usr/bin/env node
/**
 * Spam and abuse report for the contact form.
 *
 * Shows who is submitting, from where, and what got blocked. Reads the same
 * Turso database the site writes to. Nothing here writes or deletes: it is a
 * read only report, except for the optional --purge flag which is explicit.
 *
 * Usage, with the Netlify environment loaded:
 *   netlify env:import .env            # or export the two vars by hand
 *   node scripts/spam-report.js        # last 7 days
 *   node scripts/spam-report.js 30     # last 30 days
 *   node scripts/spam-report.js 7 --purge-blocked   # delete blocked rows older than 90 days
 *
 * Required environment variables:
 *   TURSO_DATABASE_URL
 *   TURSO_AUTH_TOKEN
 */

import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN.");
  console.error("Load them first, for example:  eval \"$(netlify env:list --json | node -e '...')\"");
  console.error("or run:  netlify env:get TURSO_DATABASE_URL");
  process.exit(1);
}

const days = Number(process.argv[2]) || 7;
const purge = process.argv.includes("--purge-blocked");
const db = createClient({ url, authToken });

const pad = (s, n) => String(s ?? "").slice(0, n).padEnd(n);
const rule = (n = 78) => console.log("-".repeat(n));

async function tableExists(name) {
  const r = await db.execute({
    sql: "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?",
    args: [name],
  });
  return r.rows.length > 0;
}

async function columns(table) {
  const r = await db.execute(`PRAGMA table_info(${table})`);
  return r.rows.map((x) => x.name);
}

async function section(title) {
  console.log("");
  console.log(title.toUpperCase());
  rule();
}

async function main() {
  console.log(`\nContact form abuse report, last ${days} day(s)`);
  console.log(`Generated ${new Date().toISOString()}`);

  const hasBlocked = await tableExists("blocked_submissions");
  const contactCols = await columns("contacts");
  const hasForensics = contactCols.includes("ip");

  if (!hasForensics) {
    console.log("\nNOTE: the contacts table has no ip column yet.");
    console.log("It is added automatically the first time the deployed API receives a submission.");
  }

  // 1. Volume over time
  await section("submissions accepted per day");
  const perDay = await db.execute({
    sql: `SELECT date(created_at) AS d, COUNT(*) AS n
          FROM contacts WHERE created_at >= datetime('now', ?)
          GROUP BY d ORDER BY d DESC`,
    args: [`-${days} days`],
  });
  if (!perDay.rows.length) console.log("  none");
  for (const r of perDay.rows) {
    console.log(`  ${r.d}  ${String(r.n).padStart(5)}  ${"#".repeat(Math.min(50, Number(r.n)))}`);
  }

  if (hasForensics) {
    // 2. Who
    await section("top source ip addresses (accepted)");
    const byIp = await db.execute({
      sql: `SELECT ip, country, city, COUNT(*) AS n,
                   MIN(created_at) AS first_seen, MAX(created_at) AS last_seen
            FROM contacts WHERE created_at >= datetime('now', ?) AND ip IS NOT NULL
            GROUP BY ip ORDER BY n DESC LIMIT 20`,
      args: [`-${days} days`],
    });
    console.log(`  ${pad("ip", 40)} ${pad("geo", 16)} ${pad("count", 6)} last seen`);
    for (const r of byIp.rows) {
      console.log(`  ${pad(r.ip, 40)} ${pad(`${r.country || "?"} ${r.city || ""}`, 16)} ${pad(r.n, 6)} ${r.last_seen}`);
    }
    if (!byIp.rows.length) console.log("  none");

    // 3. Where
    await section("countries (accepted)");
    const byCountry = await db.execute({
      sql: `SELECT COALESCE(NULLIF(country,''),'?') AS c, COUNT(*) AS n
            FROM contacts WHERE created_at >= datetime('now', ?)
            GROUP BY c ORDER BY n DESC LIMIT 15`,
      args: [`-${days} days`],
    });
    for (const r of byCountry.rows) console.log(`  ${pad(r.c, 6)} ${String(r.n).padStart(6)}`);
    if (!byCountry.rows.length) console.log("  none");

    // 4. Captcha scores
    await section("recaptcha score distribution (accepted)");
    const scores = await db.execute({
      sql: `SELECT CASE
                     WHEN recaptcha_score IS NULL THEN 'not checked'
                     WHEN recaptcha_score >= 0.9 THEN '0.9 to 1.0 human'
                     WHEN recaptcha_score >= 0.7 THEN '0.7 to 0.9'
                     WHEN recaptcha_score >= 0.5 THEN '0.5 to 0.7 borderline'
                     ELSE 'below 0.5' END AS bucket,
                   COUNT(*) AS n
            FROM contacts WHERE created_at >= datetime('now', ?)
            GROUP BY bucket ORDER BY n DESC`,
      args: [`-${days} days`],
    });
    for (const r of scores.rows) console.log(`  ${pad(r.bucket, 24)} ${String(r.n).padStart(6)}`);
    if (!scores.rows.length) console.log("  none");
  }

  // 5. Blocked
  if (hasBlocked) {
    await section("blocked submissions by reason");
    const byReason = await db.execute({
      sql: `SELECT reason, COUNT(*) AS n FROM blocked_submissions
            WHERE ts >= datetime('now', ?) GROUP BY reason ORDER BY n DESC`,
      args: [`-${days} days`],
    });
    for (const r of byReason.rows) console.log(`  ${pad(r.reason, 30)} ${String(r.n).padStart(6)}`);
    if (!byReason.rows.length) console.log("  none");

    await section("top blocked ip addresses");
    const blockedIps = await db.execute({
      sql: `SELECT ip, country, city, COUNT(*) AS n, MAX(ts) AS last_seen,
                   GROUP_CONCAT(DISTINCT reason) AS reasons
            FROM blocked_submissions WHERE ts >= datetime('now', ?)
            GROUP BY ip ORDER BY n DESC LIMIT 25`,
      args: [`-${days} days`],
    });
    console.log(`  ${pad("ip", 40)} ${pad("geo", 14)} ${pad("n", 5)} reasons`);
    for (const r of blockedIps.rows) {
      console.log(`  ${pad(r.ip, 40)} ${pad(`${r.country || "?"} ${r.city || ""}`, 14)} ${pad(r.n, 5)} ${String(r.reasons || "").slice(0, 40)}`);
    }
    if (!blockedIps.rows.length) console.log("  none");

    await section("most recent blocked attempts");
    const recent = await db.execute({
      sql: `SELECT ts, ip, country, reason, email, subject, snippet
            FROM blocked_submissions ORDER BY ts DESC LIMIT 15`,
    });
    for (const r of recent.rows) {
      console.log(`  ${r.ts}  ${pad(r.ip, 26)} ${pad(r.country || "?", 4)} ${pad(r.reason, 22)}`);
      if (r.email || r.subject) console.log(`      ${String(r.email || "").slice(0, 50)}  |  ${String(r.subject || "").slice(0, 50)}`);
      if (r.snippet) console.log(`      ${String(r.snippet).replace(/\s+/g, " ").slice(0, 90)}`);
    }
    if (!recent.rows.length) console.log("  none");
  } else {
    console.log("\nNo blocked_submissions table yet. It is created the first time the");
    console.log("deployed API rejects a submission, so an empty table means no blocks.");
  }

  // 6. Repeat offenders visible in the accepted leads
  await section("repeated identical messages (accepted)");
  const dupes = await db.execute({
    sql: `SELECT substr(message,1,60) AS snippet, COUNT(*) AS n, COUNT(DISTINCT email) AS emails
          FROM contacts WHERE created_at >= datetime('now', ?)
          GROUP BY message HAVING n > 1 ORDER BY n DESC LIMIT 10`,
    args: [`-${days} days`],
  });
  for (const r of dupes.rows) {
    console.log(`  x${String(r.n).padStart(4)}  ${String(r.emails).padStart(3)} sender(s)  ${String(r.snippet).replace(/\s+/g, " ")}`);
  }
  if (!dupes.rows.length) console.log("  none");

  if (purge) {
    await section("purge");
    const res = await db.execute("DELETE FROM blocked_submissions WHERE ts < datetime('now','-90 days')");
    console.log(`  deleted ${res.rowsAffected} blocked rows older than 90 days`);
  }

  console.log("");
}

main().catch((e) => {
  console.error("Report failed:", e.message);
  process.exit(1);
});
