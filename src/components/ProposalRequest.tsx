import { useState, type FormEvent } from "react";

/**
 * ProposalRequest — the island behind /quoter/.
 *
 * Codebrand no longer publishes prices. Every engagement is scoped from the
 * client's budget and the resources the project needs (a website, a store, an
 * application, or N developers with a given stack). This form collects exactly
 * that and posts it to the existing /api/contact endpoint as multipart form
 * data, so nothing in the API or the contact page had to change.
 *
 * The API validates `message` against a strict character whitelist (letters,
 * digits, spaces and , . ! ? ; : ' " ( ) - and newlines). Everything the user
 * types into the structured fields is folded into the message, so the values
 * are normalised before they are sent.
 */

type Need = {
  id: string;
  label: string;
  hint: string;
  service: string;
};

const NEEDS: Need[] = [
  { id: "website", label: "Website", hint: "Corporate site, landing pages, redesign", service: "Web Development" },
  { id: "store", label: "Online store", hint: "Catalog, checkout, payments, inventory", service: "Web Development" },
  { id: "app", label: "Web application or custom software", hint: "CRM, internal tools, SaaS, integrations", service: "Web Development" },
  { id: "developers", label: "Developers for my team", hint: "One or more engineers with a specific stack", service: "Web Development" },
  { id: "design", label: "Design or branding", hint: "UX/UI, brand identity, design system", service: "UX/UI Design" },
  { id: "seo", label: "SEO or marketing", hint: "Technical SEO, content, social media", service: "SEO" },
];

const DEV_COUNTS = ["1", "2", "3 to 5", "6 or more"];
const SENIORITIES = ["Senior", "Lead or architect", "Mixed team"];
const TIMELINES = ["As soon as possible", "Within 1 to 3 months", "Within 3 to 6 months", "Flexible"];
const INDUSTRIES = [
  "Automotive", "Construction", "Content Creators", "E-commerce",
  "Fitness", "Healthcare", "Law Firms", "Real Estate",
  "Restaurants", "Travel Agency", "Technology", "Other",
];

/** Keep only what the API's message whitelist accepts. */
function clean(value: string): string {
  return value
    .replace(/\//g, " or ")
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/[$€£]/g, "")
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-,.!?;:'"()\n\r]/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-300 focus:border-[#f48200] focus:outline-none focus:ring-2 focus:ring-[#f48200]/20";
const labelClass = "mb-2 block text-sm font-semibold text-slate-900";
const chipBase =
  "cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 select-none";

export default function ProposalRequest() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [devCount, setDevCount] = useState("");
  const [seniority, setSeniority] = useState("");
  const [stack, setStack] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  const wantsDevelopers = needs.includes("developers");

  const toggleNeed = (id: string) =>
    setNeeds((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));

  const buildMessage = (): string => {
    const lines: string[] = [];
    const chosen = NEEDS.filter((n) => needs.includes(n.id)).map((n) => n.label);
    lines.push(`What they need: ${chosen.join(", ") || "Not specified"}`);
    if (wantsDevelopers) {
      lines.push(`Developers: ${devCount || "Not specified"}`);
      lines.push(`Seniority: ${seniority || "Not specified"}`);
      lines.push(`Stack: ${stack || "Not specified"}`);
    }
    lines.push(`Timeline: ${timeline || "Not specified"}`);
    lines.push(`Budget (USD): ${budget || "Not specified"}`);
    lines.push(`Company: ${company || "Not specified"}`);
    lines.push("");
    lines.push("Project details:");
    lines.push(details || "Not provided");
    return clean(lines.join("\n"));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (needs.length === 0) {
      setError("Tell us what you need so we can scope the proposal.");
      return;
    }
    if (!budget.trim()) {
      setError("Share the budget you have in mind. It is what we build the proposal around.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const fd = new FormData();
    fd.set("honey", honey);
    fd.set("name", clean(name).replace(/[0-9,.!?;:"()]/g, "").trim());
    fd.set("email", email.trim());
    fd.set("phone", phone.trim());
    fd.set("industry", industry || "Other");
    const chosen = NEEDS.filter((n) => needs.includes(n.id));
    fd.set("subject", `Proposal request: ${chosen.map((n) => n.label).join(", ")}`.slice(0, 100));
    fd.set("message", buildMessage().slice(0, 2000));
    Array.from(new Set(chosen.map((n) => n.service))).forEach((s) => fd.append("services", s));

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (res.ok) {
        window.location.href = "/thank-you/";
        return;
      }
      let msg = "Something went wrong. Please try again.";
      try {
        const json = await res.json();
        if (json?.error) msg = json.error;
      } catch {
        /* not JSON */
      }
      setError(msg);
      setStatus("error");
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-12" aria-label="Request a proposal">
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="proposal-website">Website</label>
        <input
          id="proposal-website"
          type="text"
          name="honey"
          tabIndex={-1}
          autoComplete="new-password"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </div>

      {/* 01 · What you need */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">01 · What you need</legend>
        <p className="mt-3 text-sm text-slate-600">Pick everything that applies.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {NEEDS.map((n) => {
            const active = needs.includes(n.id);
            return (
              <label
                key={n.id}
                className={`${chipBase} ${active ? "border-[#f48200] bg-orange-50 text-slate-900 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={() => toggleNeed(n.id)}
                />
                <span className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border ${active ? "border-[#f48200] bg-[#f48200] text-white" : "border-slate-300 bg-white text-transparent"}`}
                    aria-hidden="true"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  <span>
                    <span className="block font-semibold">{n.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{n.hint}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* 02 · Resources (only when developers are requested) */}
      {wantsDevelopers && (
        <fieldset>
          <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">02 · The team you need</legend>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <span className={labelClass}>How many developers?</span>
              <div className="flex flex-wrap gap-2">
                {DEV_COUNTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDevCount(c)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${devCount === c ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={labelClass}>Seniority</span>
              <div className="flex flex-wrap gap-2">
                {SENIORITIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeniority(s)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${seniority === s ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="proposal-stack" className={labelClass}>Stack or skills</label>
              <input
                id="proposal-stack"
                type="text"
                className={inputClass}
                placeholder="React, Next.js, Node, Python, PostgreSQL, WordPress..."
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                maxLength={200}
              />
            </div>
          </div>
        </fieldset>
      )}

      {/* 03 · Budget and timing */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {wantsDevelopers ? "03" : "02"} · Budget and timing
        </legend>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="proposal-budget" className={labelClass}>Budget in USD <span className="text-[#f48200]">*</span></label>
            <input
              id="proposal-budget"
              type="text"
              inputMode="decimal"
              className={inputClass}
              placeholder="Total for the project, or per month for a team"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              maxLength={80}
              required
            />
            <p className="mt-2 text-xs text-slate-500">A range is fine. We size the scope to fit it.</p>
          </div>
          <div>
            <label htmlFor="proposal-timeline" className={labelClass}>When do you want to start?</label>
            <select
              id="proposal-timeline"
              className={inputClass}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            >
              <option value="">Select</option>
              {TIMELINES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="proposal-details" className={labelClass}>Project details</label>
            <textarea
              id="proposal-details"
              className={`${inputClass} min-h-[140px] resize-y`}
              placeholder="What are you building, who is it for, and what does it need to do?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={1400}
            />
          </div>
        </div>
      </fieldset>

      {/* 04 · Contact */}
      <fieldset>
        <legend className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {wantsDevelopers ? "04" : "03"} · Where we send the proposal
        </legend>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="proposal-name" className={labelClass}>Name <span className="text-[#f48200]">*</span></label>
            <input id="proposal-name" type="text" name="name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required autoComplete="name" />
          </div>
          <div>
            <label htmlFor="proposal-company" className={labelClass}>Company</label>
            <input id="proposal-company" type="text" className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} maxLength={80} autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="proposal-email" className={labelClass}>Email <span className="text-[#f48200]">*</span></label>
            <input id="proposal-email" type="email" name="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="proposal-phone" className={labelClass}>Phone <span className="text-[#f48200]">*</span></label>
            <input id="proposal-phone" type="tel" name="phone" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} required autoComplete="tel" placeholder="+1 555 123 4567" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="proposal-industry" className={labelClass}>Industry</label>
            <select id="proposal-industry" className={inputClass} value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">Select</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">You get a fixed-price proposal within 24 business hours. No obligation.</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f48200] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Request my proposal"}
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </button>
      </div>
    </form>
  );
}
