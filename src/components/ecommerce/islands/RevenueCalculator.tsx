import { useState } from "react";

/**
 * RevenueCalculator — the visitor's own numbers, and what small improvements
 * are worth in dollars. It is arithmetic, not a promise: we never claim a
 * specific uplift, we show what one would mean for this store.
 */

const usd0 = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Field({
  label, value, min, max, step, suffix, onChange,
}: { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (v: number) => void }) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-200">{label}</label>
        <div className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 bg-transparent text-right text-sm font-bold text-white outline-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          />
          {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-cyan-400"
      />
    </div>
  );
}

export default function RevenueCalculator() {
  const [visitors, setVisitors] = useState(20000);
  const [conversion, setConversion] = useState(1.5);
  const [aov, setAov] = useState(85);

  const orders = visitors * (conversion / 100);
  const revenue = orders * aov;

  const convUp = visitors * ((conversion + 0.5) / 100) * aov - revenue;
  const aovUp = orders * aov * 0.1;
  const both = visitors * ((conversion + 0.5) / 100) * (aov * 1.1) - revenue;

  return (
    <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Your store, your numbers</p>
        <Field label="Monthly visitors" value={visitors} min={1000} max={500000} step={1000} onChange={setVisitors} />
        <Field label="Conversion rate" value={conversion} min={0.2} max={6} step={0.1} suffix="%" onChange={setConversion} />
        <Field label="Average order value" value={aov} min={10} max={1000} step={5} suffix="$" onChange={setAov} />
        <p className="text-xs leading-relaxed text-slate-400">Arithmetic only. We do not promise a specific lift; this shows what one is worth to you before you decide what to fix first.</p>
      </div>

      <dl className="space-y-3 lg:col-span-6" style={{ fontVariantNumeric: "tabular-nums" }} aria-live="polite">
        <div className="rounded-xl border border-white/10 bg-[#0b1f2a] p-4">
          <dt className="text-xs uppercase tracking-wider text-slate-400">Today</dt>
          <dd className="mt-1 text-3xl font-extrabold text-white">{usd0(revenue)}<span className="text-base font-semibold text-slate-400"> / month</span></dd>
          <dd className="mt-1 text-sm text-slate-400">{Math.round(orders).toLocaleString("en-US")} orders a month</dd>
        </div>
        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4">
          <dt className="text-sm font-semibold text-white">Conversion up half a point <span className="font-normal text-slate-300">({conversion.toFixed(1)}% to {(conversion + 0.5).toFixed(1)}%)</span></dt>
          <dd className="mt-1 text-2xl font-extrabold text-cyan-300">+{usd0(convUp)}<span className="text-sm font-semibold text-slate-400"> / month</span></dd>
          <dd className="text-xs text-slate-400">Faster pages, a shorter checkout, product pages that answer the question.</dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <dt className="text-sm font-semibold text-white">Average order up 10% <span className="font-normal text-slate-300">({usd0(aov)} to {usd0(aov * 1.1)})</span></dt>
          <dd className="mt-1 text-2xl font-extrabold text-white">+{usd0(aovUp)}<span className="text-sm font-semibold text-slate-400"> / month</span></dd>
          <dd className="text-xs text-slate-400">Bundles, a free-shipping threshold, one honest upsell in the cart.</dd>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <dt className="text-sm font-semibold text-white">Both together</dt>
          <dd className="mt-1 text-2xl font-extrabold text-white">+{usd0(both)}<span className="text-sm font-semibold text-slate-400"> / month</span> <span className="text-sm text-slate-400">· {usd0(both * 12)} a year</span></dd>
        </div>
      </dl>
    </div>
  );
}
