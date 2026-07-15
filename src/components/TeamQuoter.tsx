import { useMemo, useState } from "react";

/**
 * TeamQuoter — client-facing self-quote for a dedicated nearshore team.
 * Hourly rates per seniority only (no monthly plans). The visitor picks how many
 * developers of each level and hours/week, and sees a live estimate + WhatsApp handoff.
 */

const WHATSAPP = "50487380714";

type Role = { key: "mid" | "senior" | "lead"; label: string; rate: number; blurb: string };

const ROLES: Role[] = [
  { key: "mid", label: "Mid Developer", rate: 45, blurb: "3–5 yrs · ships features on their own" },
  { key: "senior", label: "Senior Developer", rate: 65, blurb: "6+ yrs · architecture & ownership" },
  { key: "lead", label: "Tech Lead / Architect", rate: 95, blurb: "leads the team, owns delivery" },
];

const HOURS = [10, 20, 30, 40];

export default function TeamQuoter() {
  const [counts, setCounts] = useState<Record<Role["key"], number>>({ mid: 1, senior: 1, lead: 0 });
  const [hours, setHours] = useState(40);

  const step = (k: Role["key"], d: number) =>
    setCounts((c) => ({ ...c, [k]: Math.max(0, Math.min(20, c[k] + d)) }));

  const t = useMemo(() => {
    const devs = ROLES.reduce((n, r) => n + counts[r.key], 0);
    const teamRate = ROLES.reduce((s, r) => s + counts[r.key] * r.rate, 0); // $/hr for the whole team
    const weekly = teamRate * hours;
    const blended = devs ? teamRate / devs : 0;
    return { devs, teamRate, weekly, blended };
  }, [counts, hours]);

  const picked = ROLES.filter((r) => counts[r.key] > 0)
    .map((r) => `${counts[r.key]} ${r.label}${counts[r.key] > 1 ? "s" : ""}`)
    .join(", ");

  const waUrl = useMemo(() => {
    const msg = `Hi! I'd like a quote for a nearshore team: ${picked || "developers"} at ${hours} hrs/week.`;
    return `https://api.whatsapp.com/send/?phone=${WHATSAPP}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
  }, [picked, hours]);

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <div className="rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl border border-white/10">
      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        {/* Controls */}
        <div className="p-7 sm:p-9">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/15 border border-cyan-400/20 rounded-full text-cyan-300 text-xs font-bold mb-4">
            BUILD YOUR TEAM
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">Get an instant estimate</h3>
          <p className="text-slate-400 mb-7 text-sm sm:text-base">
            Pick how many developers you need and how many hours a week. Hourly rates, no monthly lock-in.
          </p>

          <div className="space-y-3">
            {ROLES.map((r) => (
              <div
                key={r.key}
                className="flex items-center gap-4 rounded-2xl bg-slate-800/60 border border-white/10 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{r.label}</span>
                    <span className="text-orange-400 font-bold tabular-nums">${r.rate}/hr</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{r.blurb}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label={`Remove one ${r.label}`}
                    onClick={() => step(r.key, -1)}
                    className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-lg font-bold leading-none transition-colors disabled:opacity-40"
                    disabled={counts[r.key] === 0}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-lg font-bold tabular-nums">{counts[r.key]}</span>
                  <button
                    type="button"
                    aria-label={`Add one ${r.label}`}
                    onClick={() => step(r.key, 1)}
                    className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-lg font-bold leading-none transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Hours per week (each dev)</span>
              <span className="text-sm text-slate-400 tabular-nums">{hours} h</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHours(h)}
                  className={
                    "px-4 py-2 rounded-xl text-sm font-bold transition-colors " +
                    (hours === h
                      ? "bg-orange-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700")
                  }
                >
                  {h === 40 ? "40 (full-time)" : h + "h"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-950/60 border-t lg:border-t-0 lg:border-l border-white/10 p-7 sm:p-9 flex flex-col">
          <p className="text-sm text-slate-400 mb-1">Your team</p>
          <p className="text-lg font-semibold mb-6 min-h-[3.5rem]">
            {t.devs === 0 ? "Add a developer to start" : picked}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-baseline justify-between">
              <span className="text-slate-400 text-sm">Team size</span>
              <span className="text-2xl font-bold tabular-nums">{t.devs}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-slate-400 text-sm">Blended rate</span>
              <span className="text-2xl font-bold tabular-nums text-orange-400">
                {t.devs ? fmt(t.blended) + "/hr" : "—"}
              </span>
            </div>
            <div className="pt-4 border-t border-white/10">
              <span className="text-slate-400 text-sm">Estimated / week</span>
              <div className="text-4xl font-bold tabular-nums mt-1">{fmt(t.weekly)}</div>
              <p className="text-xs text-slate-500 mt-1">
                {t.devs} dev{t.devs === 1 ? "" : "s"} × {hours} h · billed hourly, only for hours worked
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={t.devs === 0}
              className={
                "block w-full py-3.5 text-center font-bold rounded-2xl transition-all duration-300 " +
                (t.devs === 0
                  ? "bg-slate-700 text-slate-400 pointer-events-none"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg")
              }
            >
              Request this quote
            </a>
            <a
              href="/contact"
              className="block w-full py-3.5 text-center font-semibold rounded-2xl border border-white/15 text-white hover:bg-white/5 transition-colors"
            >
              Talk to us first
            </a>
            <p className="text-[11px] text-slate-500 text-center">
              Estimate only. US timezone · English-fluent · you own 100% of the code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
