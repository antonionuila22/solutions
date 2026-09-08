import { useMemo, useState } from "react";

/**
 * PlatformPicker — four questions, one honest recommendation. The rules are
 * the same ones we apply on the first call; the visitor gets them without
 * booking one.
 */

type Q = { key: string; label: string; options: { v: string; l: string }[] };

const QUESTIONS: Q[] = [
  { key: "catalog", label: "How many products?", options: [{ v: "s", l: "Under 100" }, { v: "m", l: "100 to 5,000" }, { v: "l", l: "5,000+" }] },
  { key: "editor", label: "Who updates the store?", options: [{ v: "team", l: "My team, daily" }, { v: "us", l: "An agency, monthly" }] },
  { key: "logic", label: "Custom business rules?", options: [{ v: "none", l: "Standard retail" }, { v: "some", l: "Some: bundles, subscriptions" }, { v: "heavy", l: "Heavy: B2B pricing, quotes, ERP" }] },
  { key: "priority", label: "What matters most?", options: [{ v: "speed", l: "Launch fast" }, { v: "fees", l: "Lowest monthly fees" }, { v: "seo", l: "Speed and search rankings" }] },
];

type Rec = { name: string; why: string[]; caveat: string };

function recommend(a: Record<string, string>): Rec | null {
  if (Object.keys(a).length < QUESTIONS.length) return null;
  const heavy = a.logic === "heavy";
  const big = a.catalog === "l";
  const seo = a.priority === "seo";
  const fees = a.priority === "fees";

  if (heavy || (big && seo)) {
    return {
      name: "Headless with Astro or Next",
      why: [
        heavy ? "B2B pricing, quoting and ERP sync are code, not plugins. A custom front end makes them first-class." : "A large catalog and a search-first priority reward a front end that ships almost no JavaScript.",
        "Product and category pages render in milliseconds, which is what Google rewards and what shoppers stay for.",
        "The commerce backend can still be Shopify or WooCommerce; only the storefront is custom.",
      ],
      caveat: "Highest build cost of the three. Worth it above a few thousand orders a month or when the business rules are the product.",
    };
  }
  if (fees || a.editor === "team" && !seo && a.catalog !== "s") {
    return {
      name: "WooCommerce",
      why: [
        "No platform fee and no transaction cut: the store runs on hosting you control.",
        "Your team edits products, pages and content in WordPress the same day.",
        "Thousands of extensions for subscriptions, bundles, wholesale and shipping rules.",
      ],
      caveat: "Performance and security are ongoing work, not a launch-day checkbox. Budget for hosting and maintenance.",
    };
  }
  return {
    name: "Shopify",
    why: [
      "Fastest path to a store that takes payments: checkout, taxes, fraud and hosting are handled.",
      "Reliable under traffic spikes and sales, with no server to manage.",
      "A mature app ecosystem for reviews, email, upsells and subscriptions.",
    ],
    caveat: "Monthly fee plus a transaction cut, and deep customization runs into platform limits. Fine for most retail stores, tight for B2B.",
  };
}

export default function PlatformPicker() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const rec = useMemo(() => recommend(answers), [answers]);
  const answered = Object.keys(answers).length;

  return (
    <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Which platform fits? Four questions</p>
        {QUESTIONS.map((q) => (
          <fieldset key={q.key}>
            <legend className="text-sm font-semibold text-slate-900">{q.label}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((o) => {
                const on = answers[q.key] === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAnswers((s) => ({ ...s, [q.key]: o.v }))}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${on ? "border-cyan-700 bg-cyan-700 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-cyan-600"}`}
                  >
                    {o.l}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="lg:col-span-5" aria-live="polite">
        {rec ? (
          <div className="h-full rounded-xl border border-cyan-200 bg-cyan-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Our recommendation</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{rec.name}</p>
            <ul className="mt-4 space-y-2">
              {rec.why.map((w) => (
                <li key={w} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-cyan-700" aria-hidden="true" />{w}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-cyan-200 pt-3 text-xs leading-relaxed text-slate-600"><span className="font-semibold text-slate-800">The catch: </span>{rec.caveat}</p>
          </div>
        ) : (
          <div className="flex h-full min-h-[12rem] items-center rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
            Answer the {QUESTIONS.length - answered} remaining question{QUESTIONS.length - answered === 1 ? "" : "s"} and the recommendation appears here, with the reasons and the catch.
          </div>
        )}
      </div>
    </div>
  );
}
