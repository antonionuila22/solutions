import { useMemo, useState } from "react";

/**
 * NearshoreCostCalculator — public, free tool.
 *
 * Compares the true cost of four ways to staff a software engineer:
 *   1. US in-house employee (salary + employer burden + overhead)
 *   2. US contractor / staffing agency
 *   3. Nearshore Honduras (Codebrand)
 *   4. Eastern Europe (Poland)
 *
 * HONESTY RULE: every assumption except Codebrand's own published rates is
 * user-editable, because we cannot state other companies' costs as fact.
 * Codebrand's rates ($45 / $65 / $95 per hour) are the only fixed figures.
 * The written methodology lives in the .astro page so it is crawlable —
 * this island is client:only and renders nothing server-side.
 */

const WHATSAPP = "50487380714";

type Level = "mid" | "senior" | "lead";
type ByLevel = Record<Level, string>;

type Model = {
  key: string;
  name: string;
  detail: string;
  /** null when the visitor cleared an input this row depends on. We render "no figure"
   *  rather than a zero, because a $0.00/hour row that "saves 100%" is simply false. */
  hourly: number | null;
  /** The model everything else is compared against. */
  baseline: boolean;
  /** Marks the Codebrand row so it can carry the accent colour. */
  us?: boolean;
};

const LEVELS: { key: Level; label: string; blurb: string }[] = [
  { key: "mid", label: "Mid", blurb: "3–5 years · ships features independently" },
  { key: "senior", label: "Senior", blurb: "6+ years · owns architecture and quality" },
  { key: "lead", label: "Lead / Architect", blurb: "anchors delivery for a whole team" },
];

/** Codebrand's published hourly rates. The only figures here we state as fact. */
const CODEBRAND_RATES: Record<Level, number> = { mid: 45, senior: 65, lead: 95 };

/** Defaults are market estimates, not quotes. See "Methodology" on the page. */
const DEFAULT_SALARY: ByLevel = { mid: "110000", senior: "133000", lead: "170000" };
const DEFAULT_CONTRACTOR: ByLevel = { mid: "80", senior: "110", lead: "150" };
const DEFAULT_POLAND: ByLevel = { mid: "50", senior: "70", lead: "95" };
const DEFAULT_BURDEN = "30";
const DEFAULT_OVERHEAD = "15000";
const DEFAULT_PRODUCTIVE_HOURS = "1880";

/** Fields where zero is a legitimate answer: burden and overhead can honestly be 0. */
const num = (s: string) => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Fields where zero means nothing: a salary, an hourly rate, a count of hours.
 * Blank or invalid returns null so the row can say "no figure entered" instead of
 * inventing one. Silently substituting our own default would put a number on screen
 * that the visitor never typed, which is the opposite of what this page promises.
 */
const positive = (s: string): number | null => {
  const n = Number.parseFloat(s);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const usd0 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const usd2 = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });


// Confetti on the WhatsApp handoff — it opens a new tab, so the burst is
// visible on this page. canvas-confetti is imported on first click only;
// disableForReducedMotion honors the site's motion rules.
const preloadConfetti = () => { import("canvas-confetti"); };
const fireConfetti = (e: React.PointerEvent<HTMLAnchorElement>) => {
  const el = e.currentTarget;
  import("canvas-confetti").then(({ default: confetti }) => {
    const r = el.getBoundingClientRect();
    confetti({
      particleCount: 60,
      spread: 70,
      startVelocity: 28,
      scalar: 0.9,
      ticks: 120,
      colors: ["#f48200", "#fbbf24", "#ffffff", "#94a3b8"],
      origin: {
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height / 2) / window.innerHeight,
      },
      disableForReducedMotion: true,
    });
  });
};

export default function NearshoreCostCalculator() {
  const [level, setLevel] = useState<Level>("senior");
  const [devs, setDevs] = useState(3);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [months, setMonths] = useState(12);

  const [salary, setSalary] = useState<ByLevel>(DEFAULT_SALARY);
  const [contractor, setContractor] = useState<ByLevel>(DEFAULT_CONTRACTOR);
  const [poland, setPoland] = useState<ByLevel>(DEFAULT_POLAND);
  const [burden, setBurden] = useState(DEFAULT_BURDEN);
  const [overhead, setOverhead] = useState(DEFAULT_OVERHEAD);
  const [productiveHours, setProductiveHours] = useState(DEFAULT_PRODUCTIVE_HOURS);

  const [showAssumptions, setShowAssumptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const levelLabel = LEVELS.find((l) => l.key === level)!.label;

  const resetAssumptions = () => {
    setSalary(DEFAULT_SALARY);
    setContractor(DEFAULT_CONTRACTOR);
    setPoland(DEFAULT_POLAND);
    setBurden(DEFAULT_BURDEN);
    setOverhead(DEFAULT_OVERHEAD);
    setProductiveHours(DEFAULT_PRODUCTIVE_HOURS);
  };

  // Reset clears all three seniority levels, so the indicator has to watch all three too:
  // editing Mid and then switching to Senior must still read as edited.
  const sameByLevel = (a: ByLevel, b: ByLevel) =>
    a.mid === b.mid && a.senior === b.senior && a.lead === b.lead;

  const edited =
    !sameByLevel(salary, DEFAULT_SALARY) ||
    !sameByLevel(contractor, DEFAULT_CONTRACTOR) ||
    !sameByLevel(poland, DEFAULT_POLAND) ||
    burden !== DEFAULT_BURDEN ||
    overhead !== DEFAULT_OVERHEAD ||
    productiveHours !== DEFAULT_PRODUCTIVE_HOURS;

  const model = useMemo(() => {
    const weeks = months * (52 / 12);
    const hoursPerDev = hoursPerWeek * weeks;
    const totalHours = hoursPerDev * devs;

    const baseSalary = positive(salary[level]);
    // Burden and overhead may legitimately be zero, so a blank field counts as zero.
    const burdenRate = num(burden) / 100;
    const overheadAnnual = num(overhead);
    const hoursAvailable = positive(productiveHours);

    // Without a salary there is no in-house figure, and without productive hours there is
    // nothing to divide it by. In either case the column reports no figure at all.
    const loadedAnnual = baseSalary === null ? null : baseSalary * (1 + burdenRate) + overheadAnnual;
    const inhouseHourly =
      loadedAnnual === null || hoursAvailable === null ? null : loadedAnnual / hoursAvailable;

    /** What payroll actually commits you to, regardless of how many hours you need. */
    const payrollCommitment = loadedAnnual === null ? null : loadedAnnual * devs * (months / 12);

    const rows: Model[] = [
      {
        key: "inhouse",
        name: "US in-house employee",
        detail: "Salary + employer burden + overhead, spread over productive hours",
        hourly: inhouseHourly,
        baseline: true,
      },
      {
        key: "contractor",
        name: "US contractor / staffing agency",
        detail: "Billed hourly, no benefits or overhead on your books",
        hourly: positive(contractor[level]),
        baseline: false,
      },
      {
        key: "codebrand",
        name: "Nearshore Honduras — Codebrand",
        detail: "US Central Time, English-fluent, billed hourly for hours worked",
        hourly: CODEBRAND_RATES[level],
        baseline: false,
        us: true,
      },
      {
        key: "poland",
        name: "Eastern Europe — Poland",
        detail: "Offshore agency rate, 6–9 hours ahead of US time zones",
        hourly: positive(poland[level]),
        baseline: false,
      },
    ];

    const inhouseTotal = inhouseHourly === null ? null : inhouseHourly * totalHours;

    const results = rows.map((r) => {
      const total = r.hourly === null ? null : r.hourly * totalHours;

      // The in-house annual run rate is loaded payroll, not an hourly rate multiplied out:
      // an employee costs the same salary whether you need 40 hours a week or 10. Using the
      // hourly figure here inflated the baseline by 2,080/1,880 and contradicted the payroll
      // commitment shown below it.
      const annual = r.baseline
        ? loadedAnnual === null
          ? null
          : loadedAnnual * devs
        : r.hourly === null
          ? null
          : r.hourly * hoursPerWeek * 52 * devs;

      let savings: number | null = null;
      let savingsPct: number | null = null;
      if (!r.baseline && total !== null && inhouseTotal !== null && inhouseTotal > 0) {
        savings = inhouseTotal - total;
        savingsPct = (savings / inhouseTotal) * 100;
      }

      return { ...r, total, annual, savings, savingsPct };
    });

    return {
      weeks,
      totalHours,
      hoursPerDev,
      hoursAvailable,
      loadedAnnual,
      inhouseHourly,
      payrollCommitment,
      results,
      inhouseTotal,
    };
  }, [level, devs, hoursPerWeek, months, salary, contractor, poland, burden, overhead, productiveHours]);

  // Our own rate is fixed, so this total always exists — no need to guard it.
  const codebrandTotal = CODEBRAND_RATES[level] * model.totalHours;

  const configLine = `${devs} ${levelLabel} developer${devs === 1 ? "" : "s"}, ${hoursPerWeek} hrs/week, ${months} month${months === 1 ? "" : "s"}`;

  const summaryText = useMemo(
    () =>
      [
        `Nearshore cost comparison — ${configLine} (${Math.round(model.totalHours).toLocaleString("en-US")} engineering hours)`,
        ...model.results.map((r) => {
          if (r.hourly === null || r.total === null) return `${r.name}: no figure entered`;
          const head = `${r.name}: ${usd2(r.hourly)}/hr — ${usd0(r.total)}`;
          if (r.baseline) return `${head} (baseline)`;
          if (r.savings === null || r.savingsPct === null) return head;
          return `${head} — ${r.savings >= 0 ? "saves" : "costs extra"} ${usd0(Math.abs(r.savings))} (${Math.abs(Math.round(r.savingsPct))}%)`;
        }),
        "Estimates only. Calculated at codebrand.us/nearshore-cost-calculator",
      ].join("\n"),
    [configLine, model],
  );

  const waUrl = useMemo(() => {
    const msg = `Hi Codebrand — I used your nearshore cost calculator. My setup: ${configLine}. At your rates that comes to ${usd0(codebrandTotal)}. I'd like to talk about staffing this.`;
    return `https://api.whatsapp.com/send/?phone=${WHATSAPP}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
  }, [configLine, codebrandTotal]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const stepDevs = (d: number) => setDevs((n) => Math.max(1, Math.min(50, n + d)));

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_-24px_rgba(15,23,42,0.25)]">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* ── Controls ─────────────────────────────────────────── */}
        <div className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Your team
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Configure the engagement
          </h3>

          {/* Seniority */}
          <div className="mt-8">
            <span className="text-sm font-medium text-slate-700">Seniority</span>
            <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Seniority level">
              {LEVELS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => setLevel(l.key)}
                  aria-pressed={level === l.key}
                  className={
                    "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors duration-200 " +
                    (level === l.key
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900")
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-500">
              {LEVELS.find((l) => l.key === level)!.blurb} · Codebrand rate{" "}
              <span className="font-semibold tabular-nums text-slate-900">
                ${CODEBRAND_RATES[level]}/hr
              </span>
            </p>
          </div>

          {/* Developers */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <span className="text-sm font-medium text-slate-700">Developers</span>
              <p className="text-sm text-slate-500">How many engineers at this level</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => stepDevs(-1)}
                disabled={devs <= 1}
                aria-label="Remove one developer"
                className="h-10 w-10 rounded-xl border border-slate-200 text-lg font-semibold leading-none text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40"
              >
                −
              </button>
              <span className="w-10 text-center text-xl font-semibold tabular-nums text-slate-900">
                {devs}
              </span>
              <button
                type="button"
                onClick={() => stepDevs(1)}
                aria-label="Add one developer"
                className="h-10 w-10 rounded-xl border border-slate-200 text-lg font-semibold leading-none text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Hours per week */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label htmlFor="hpw" className="text-sm font-medium text-slate-700">
                Hours per week, each developer
              </label>
              <span className="text-sm font-semibold tabular-nums text-slate-900">{hoursPerWeek} h</span>
            </div>
            <input
              id="hpw"
              type="range"
              min={5}
              max={40}
              step={5}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="mt-3 w-full accent-[#f48200]"
            />
          </div>

          {/* Duration */}
          <div className="mt-7">
            <div className="flex items-baseline justify-between">
              <label htmlFor="months" className="text-sm font-medium text-slate-700">
                Engagement length
              </label>
              <span className="text-sm font-semibold tabular-nums text-slate-900">
                {months} month{months === 1 ? "" : "s"}
              </span>
            </div>
            <input
              id="months"
              type="range"
              min={1}
              max={36}
              step={1}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-3 w-full accent-[#f48200]"
            />
          </div>

          <p className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500">
            That is{" "}
            <span className="font-semibold tabular-nums text-slate-900">
              {Math.round(model.totalHours).toLocaleString("en-US")}
            </span>{" "}
            engineering hours in total.
          </p>

          {/* Assumptions */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowAssumptions((v) => !v)}
              aria-expanded={showAssumptions}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <span>
                Edit the assumptions
                {edited && <span className="ml-2 font-normal text-[#f48200]">edited</span>}
              </span>
              <span aria-hidden="true" className="text-slate-500">
                {showAssumptions ? "−" : "+"}
              </span>
            </button>

            {showAssumptions && (
              <div className="mt-4 space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-sm leading-relaxed text-slate-600">
                  Every number below is an estimate, not a quote. Replace them with your own
                  payroll data or with real quotes you have received — the result is then{" "}
                  <em>your</em> comparison, not our claim.
                </p>

                <Field
                  id="a-salary"
                  label={`${levelLabel} base salary, US in-house`}
                  prefix="$"
                  suffix="/ year"
                  value={salary[level]}
                  onChange={(v) => setSalary({ ...salary, [level]: v })}
                />
                <Field
                  id="a-burden"
                  label="Employer burden on top of salary"
                  suffix="%"
                  value={burden}
                  onChange={setBurden}
                  hint="Payroll taxes, health insurance, retirement, paid leave, supplemental pay."
                />
                <Field
                  id="a-overhead"
                  label="Overhead per employee"
                  prefix="$"
                  suffix="/ year"
                  value={overhead}
                  onChange={setOverhead}
                  hint="Workstation, software licences, facilities, HR admin, amortised recruiting cost. Set it to 0 if you are fully remote and prefer not to count it."
                />
                <Field
                  id="a-hours"
                  label="Productive hours per employee"
                  suffix="/ year"
                  value={productiveHours}
                  onChange={setProductiveHours}
                  hint="2,080 paid hours minus paid leave and public holidays."
                />
                <Field
                  id="a-contractor"
                  label={`${levelLabel} US contractor rate`}
                  prefix="$"
                  suffix="/ hour"
                  value={contractor[level]}
                  onChange={(v) => setContractor({ ...contractor, [level]: v })}
                />
                <Field
                  id="a-poland"
                  label={`${levelLabel} Poland agency rate`}
                  prefix="$"
                  suffix="/ hour"
                  value={poland[level]}
                  onChange={(v) => setPoland({ ...poland, [level]: v })}
                />

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-500">
                    Codebrand's rate is fixed at ${CODEBRAND_RATES[level]}/hr — it is our published
                    price, not an estimate.
                  </p>
                  <button
                    type="button"
                    onClick={resetAssumptions}
                    className="shrink-0 text-sm font-semibold text-slate-600 underline underline-offset-4 transition-colors hover:text-slate-900"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Results ──────────────────────────────────────────── */}
        <div className="bg-slate-50/60 p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Cost comparison
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {devs} {levelLabel} developer{devs === 1 ? "" : "s"} · {months} month
            {months === 1 ? "" : "s"}
          </h3>

          <div className="mt-7 space-y-3">
            {model.results.map((r) => (
              <div
                key={r.key}
                className={
                  "rounded-2xl border bg-white p-5 transition-all duration-300 " +
                  (r.us
                    ? "border-[#f48200]/50 ring-1 ring-[#f48200]/20"
                    : r.baseline
                      ? "border-slate-300"
                      : "border-slate-200")
                }
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-semibold text-slate-900">{r.name}</h4>
                  <span className="text-sm tabular-nums text-slate-500">
                    {r.hourly === null ? "No figure entered" : `${usd2(r.hourly)} / hour`}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {r.baseline ? "Baseline · " : ""}
                  {r.hourly === null
                    ? r.baseline
                      ? "Enter a base salary and a productive-hours figure to build this column."
                      : "Enter a rate in the assumptions panel to include this option."
                    : r.detail}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                      {months} month{months === 1 ? "" : "s"}
                    </dt>
                    <dd
                      className={
                        "mt-1 text-xl font-semibold tabular-nums sm:text-2xl " +
                        (r.us ? "text-[#f48200]" : "text-slate-900")
                      }
                    >
                      {r.total === null ? <span className="text-slate-500">—</span> : usd0(r.total)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                      {/* Different measurement for the baseline: payroll is owed whole, not by the hour. */}
                      {r.baseline ? "Annual payroll" : "Annual run rate"}
                    </dt>
                    <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-700 sm:text-2xl">
                      {r.annual === null ? (
                        <span className="text-slate-500">—</span>
                      ) : (
                        usd0(r.annual)
                      )}
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                      vs in-house
                    </dt>
                    <dd className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">
                      {r.savings === null || r.savingsPct === null ? (
                        <span className="text-slate-500">—</span>
                      ) : r.savings >= 0 ? (
                        <span className="text-slate-900">
                          −{usd0(r.savings)}{" "}
                          <span className="text-sm font-medium text-slate-500">
                            ({Math.round(r.savingsPct)}%)
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-900">
                          +{usd0(Math.abs(r.savings))}{" "}
                          <span className="text-sm font-medium text-slate-500">
                            ({Math.abs(Math.round(r.savingsPct))}% more)
                          </span>
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            {model.payrollCommitment === null ? (
              <p className="text-sm leading-relaxed text-slate-600">
                Enter a base salary in the assumptions panel to see what in-house payroll commits
                you to over {months} month{months === 1 ? "" : "s"}. We will not guess it for you.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-slate-600">
                An employee is a fixed cost, so at less than full time the in-house column flatters
                itself. Hiring {devs} in-house {levelLabel.toLowerCase()} engineer
                {devs === 1 ? "" : "s"} for {months} month{months === 1 ? "" : "s"} commits you to
                about{" "}
                <span className="font-semibold tabular-nums text-slate-900">
                  {usd0(model.payrollCommitment)}
                </span>{" "}
                of loaded payroll whether or not you need {hoursPerWeek} hours a week of their
                time.
              </p>
            )}
            {model.payrollCommitment !== null &&
              model.hoursAvailable !== null &&
              hoursPerWeek * 52 > model.hoursAvailable && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Above full time it runs the other way. {hoursPerWeek} hours a week is{" "}
                  <span className="font-semibold tabular-nums text-slate-900">
                    {(hoursPerWeek * 52).toLocaleString("en-US")}
                  </span>{" "}
                  hours of engineering a year and one salaried employee delivers{" "}
                  <span className="font-semibold tabular-nums text-slate-900">
                    {model.hoursAvailable.toLocaleString("en-US")}
                  </span>
                  , so the in-house column above prices the hours you asked for rather than a single
                  payslip. That is why its engagement total sits above its annual payroll.
                </p>
              )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-2xl bg-[#f48200] px-6 py-4 text-center font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d97400]"
              onPointerDown={fireConfetti}
              onMouseEnter={preloadConfetti}
            >
              Discuss this on WhatsApp
            </a>
            <button
              type="button"
              onClick={copySummary}
              className="rounded-2xl border border-slate-300 px-6 py-4 text-center font-semibold text-slate-700 transition-colors duration-300 hover:border-slate-400 hover:bg-white"
            >
              {copied ? "Copied" : "Copy results"}
            </button>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? "Results copied to clipboard" : ""}
          </p>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Estimates for planning only, not a quote or an offer. Every figure except Codebrand's
            own hourly rates is an editable market estimate — see the methodology below.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-2">
        {prefix && <span className="text-sm text-slate-500">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-[9rem] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold tabular-nums text-slate-900 outline-none transition-colors focus:border-[#f48200] focus:ring-1 focus:ring-[#f48200]"
        />
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{hint}</p>}
    </div>
  );
}
