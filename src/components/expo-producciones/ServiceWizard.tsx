import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  WIZARD_SERVICE_OPTIONS,
  BUDGET_RANGES,
  TIMELINES,
  INDUSTRIES,
  ICON_PATHS,
  BRAND,
  type IconName,
} from "../../data/expoProducciones";

interface Props {
  /** Preselecciona un servicio en el paso 1 (por id). Default: ninguno. */
  preselectedServiceId?: string;
}

type Status = "idle" | "loading" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[a-zA-ZÀ-ÿñÑ\s'-]+$/;
const TOTAL_STEPS = 3;

/** Limpia texto para el campo `message` (solo caracteres permitidos por la API). */
function sanitizeMessage(raw: string): string {
  return raw
    .replace(/[^a-zA-Z0-9À-ÿñÑ\s,.!?;:'"()\n]/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-400/20 text-teal-300 ring-1 ring-teal-400/40">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function ServiceWizard({ preselectedServiceId }: Props) {
  const uid = useId();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const [selected, setSelected] = useState<string[]>(() =>
    preselectedServiceId &&
    WIZARD_SERVICE_OPTIONS.some((o) => o.id === preselectedServiceId)
      ? [preselectedServiceId]
      : [],
  );

  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [industry, setIndustry] = useState("");
  const [details, setDetails] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);
  const [honey, setHoney] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const selectedLabels = useMemo(
    () =>
      selected
        .map((id) => WIZARD_SERVICE_OPTIONS.find((o) => o.id === id)?.label)
        .filter((v): v is string => Boolean(v)),
    [selected],
  );

  function toggleService(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function goTo(next: number) {
    setDirection(next > step ? "next" : "prev");
    setStep(next);
    if (panelRef.current) {
      const top =
        panelRef.current.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const step1Valid = selected.length >= 1;
  const step2Valid =
    budget !== "" &&
    timeline !== "" &&
    industry !== "" &&
    details.trim().length >= 10;
  const nameValid = name.trim().length >= 2 && NAME_RE.test(name.trim());
  const emailValid = EMAIL_RE.test(email.trim());
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 7 && phoneDigits.length <= 15;
  const step3Valid = nameValid && emailValid && phoneValid && terms;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowErrors(true);
    setErrorMsg("");

    if (honey.trim() !== "") return;
    if (!step1Valid) {
      goTo(1);
      return;
    }
    if (!step2Valid) {
      goTo(2);
      return;
    }
    if (!step3Valid) return;

    const messageParts = [
      `Servicios de interes: ${selectedLabels.join(", ")}.`,
      budget ? `Presupuesto: ${budget}.` : "",
      timeline ? `Plazo: ${timeline}.` : "",
      industry ? `Industria: ${industry}.` : "",
      details.trim() ? `Detalles: ${details.trim()}` : "",
    ].filter(Boolean);
    const message = sanitizeMessage(messageParts.join("\n")).slice(0, 2000);

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("email", email.trim());
    fd.append("phone", phone.trim());
    fd.append("industry", industry);
    fd.append("subject", "Solicitud de servicios desde landing expo-producciones");
    fd.append("message", message);
    fd.append("terms", "on");
    fd.append("honey", "");
    selectedLabels.forEach((label) => fd.append("services", label));

    setStatus("loading");
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        window.location.href = "/thank-you";
        return;
      }
      setStatus("error");
      setErrorMsg(
        "No pudimos enviar tu solicitud. Revisa tus datos e inténtalo de nuevo.",
      );
    } catch {
      clearTimeout(timeout);
      setStatus("error");
      setErrorMsg(
        "Hubo un problema de conexión. Por favor inténtalo nuevamente en un momento.",
      );
    }
  }

  const progressPct = (step / TOTAL_STEPS) * 100;
  const stepTitles = ["¿Qué necesitas?", "Detalles del proyecto", "Tus datos"];

  const inputBase =
    "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-orange-400/70 focus:border-orange-400/50 min-h-[44px]";
  const labelBase = "block text-sm font-medium text-white/70 mb-2";
  const fieldError = "mt-1.5 text-xs text-rose-300";

  return (
    <div
      ref={panelRef}
      className="w-full max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-8 text-white font-poppins shadow-2xl shadow-black/40"
    >
      <style>{`
        @keyframes ep-fade-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ep-fade-in-left {
          from { opacity: 0; transform: translateX(-14px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .ep-step-next { animation: ep-fade-in 0.4s ease both; }
        .ep-step-prev { animation: ep-fade-in-left 0.4s ease both; }
        @keyframes ep-spin { to { transform: rotate(360deg); } }
        .ep-spinner { animation: ep-spin 0.7s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ep-step-next, .ep-step-prev, .ep-spinner { animation: none !important; }
        }
      `}</style>

      {/* Progreso */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold tracking-wide text-white/80">
            Paso {step} de {TOTAL_STEPS}
            <span className="ml-2 text-white/45 font-normal">
              · {stepTitles[step - 1]}
            </span>
          </span>
          <div className="flex items-center gap-2" aria-hidden="true">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i + 1 === step
                    ? "w-5 bg-orange-500"
                    : i + 1 < step
                      ? "bg-teal-400"
                      : "bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
          aria-label={`Paso ${step} de ${TOTAL_STEPS}`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot */}
        <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor={`${uid}-honey`}>No llenar este campo</label>
          <input
            id={`${uid}-honey`}
            type="text"
            name="honey"
            tabIndex={-1}
            autoComplete="off"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
          />
        </div>

        {/* PASO 1 */}
        {step === 1 && (
          <div
            key="step1"
            className={direction === "next" ? "ep-step-next" : "ep-step-prev"}
          >
            <h2 className="text-xl sm:text-2xl font-bold">¿Qué necesitas?</h2>
            <p className="mt-1 text-sm text-white/60">
              Selecciona uno o varios servicios. Armaremos una propuesta integral.
            </p>

            <div
              role="group"
              aria-label="Servicios disponibles"
              className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {WIZARD_SERVICE_OPTIONS.map((opt) => {
                const isSel = selected.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleService(opt.id)}
                    aria-pressed={isSel}
                    className={`group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 ${
                      isSel
                        ? "border-orange-500 bg-orange-500/10 scale-[1.02] shadow-lg shadow-orange-900/20"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isSel
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-white/[0.06] text-white/70 group-hover:text-white"
                      }`}
                    >
                      <Icon name={opt.icon} className="h-6 w-6" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold leading-snug">
                        {opt.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-white/55">
                        {opt.priceFrom}
                      </span>
                    </span>
                    <span
                      className={`mt-0.5 transition-all duration-300 ${
                        isSel
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-75"
                      }`}
                    >
                      <CheckBadge />
                    </span>
                  </button>
                );
              })}
            </div>

            {showErrors && !step1Valid && (
              <p role="alert" className={fieldError}>
                Selecciona al menos un servicio para continuar.
              </p>
            )}

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                disabled={!step1Valid}
                onClick={() => goTo(2)}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-orange-400 hover:to-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6l6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div
            key="step2"
            className={direction === "next" ? "ep-step-next" : "ep-step-prev"}
          >
            <h2 className="text-xl sm:text-2xl font-bold">
              Detalles del proyecto
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Esto nos ayuda a preparar una cotización más precisa.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${uid}-budget`} className={labelBase}>
                  Presupuesto estimado
                </label>
                <select
                  id={`${uid}-budget`}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={inputBase}
                >
                  <option value="" disabled className="bg-slate-900">
                    Selecciona un rango
                  </option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b} className="bg-slate-900">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${uid}-timeline`} className={labelBase}>
                  Plazo deseado
                </label>
                <select
                  id={`${uid}-timeline`}
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className={inputBase}
                >
                  <option value="" disabled className="bg-slate-900">
                    Selecciona un plazo
                  </option>
                  {TIMELINES.map((t) => (
                    <option key={t} value={t} className="bg-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-industry`} className={labelBase}>
                  Industria
                </label>
                <select
                  id={`${uid}-industry`}
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={inputBase}
                >
                  <option value="" disabled className="bg-slate-900">
                    Selecciona tu industria
                  </option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i} className="bg-slate-900">
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-details`} className={labelBase}>
                  Cuéntanos sobre tu proyecto
                </label>
                <textarea
                  id={`${uid}-details`}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  placeholder="Objetivos, lo que tienes hoy, referencias o cualquier detalle relevante…"
                  className={`${inputBase} resize-y`}
                  aria-describedby={`${uid}-details-hint`}
                />
                <p
                  id={`${uid}-details-hint`}
                  className="mt-1.5 text-xs text-white/40"
                >
                  Mínimo 10 caracteres ({details.trim().length}/10).
                </p>
                {showErrors && details.trim().length < 10 && (
                  <p role="alert" className={fieldError}>
                    Por favor cuéntanos un poco más (mínimo 10 caracteres).
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goTo(1)}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 font-semibold text-white/80 transition-all duration-300 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M19 12H5m6 6l-6-6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Atrás
              </button>
              <button
                type="button"
                disabled={!step2Valid}
                onClick={() => goTo(3)}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-orange-400 hover:to-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuar
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-6-6l6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <div
            key="step3"
            className={direction === "next" ? "ep-step-next" : "ep-step-prev"}
          >
            <h2 className="text-xl sm:text-2xl font-bold">Tus datos</h2>
            <p className="mt-1 text-sm text-white/60">
              Te enviaremos tu cotización personalizada a la brevedad.
            </p>

            {/* Resumen */}
            {selectedLabels.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedLabels.map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-200"
                  >
                    <Icon name="layers" className="h-3.5 w-3.5" />
                    {l}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div>
                <label htmlFor={`${uid}-name`} className={labelBase}>
                  Nombre completo
                </label>
                <input
                  id={`${uid}-name`}
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className={inputBase}
                  placeholder="Tu nombre"
                  aria-invalid={showErrors && !nameValid}
                />
                {showErrors && !nameValid && (
                  <p role="alert" className={fieldError}>
                    Ingresa tu nombre (solo letras, mínimo 2 caracteres).
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${uid}-email`} className={labelBase}>
                    Correo electrónico
                  </label>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className={inputBase}
                    placeholder="tucorreo@ejemplo.com"
                    aria-invalid={showErrors && !emailValid}
                  />
                  {showErrors && !emailValid && (
                    <p role="alert" className={fieldError}>
                      Ingresa un correo válido.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${uid}-phone`} className={labelBase}>
                    Teléfono / WhatsApp
                  </label>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                    className={inputBase}
                    placeholder="+504 0000-0000"
                    aria-invalid={showErrors && !phoneValid}
                  />
                  {showErrors && !phoneValid && (
                    <p role="alert" className={fieldError}>
                      Ingresa un teléfono válido (7 a 15 dígitos).
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-1">
                <label
                  htmlFor={`${uid}-terms`}
                  className="flex items-start gap-3 cursor-pointer select-none"
                >
                  <input
                    id={`${uid}-terms`}
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 rounded border-white/20 bg-white/[0.04] text-orange-500 accent-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
                    aria-invalid={showErrors && !terms}
                  />
                  <span className="text-sm text-white/70">
                    Acepto los{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-orange-300 underline underline-offset-2 hover:text-orange-200"
                    >
                      términos
                    </a>{" "}
                    y la{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-orange-300 underline underline-offset-2 hover:text-orange-200"
                    >
                      política de privacidad
                    </a>
                    .
                  </span>
                </label>
                {showErrors && !terms && (
                  <p role="alert" className={fieldError}>
                    Debes aceptar los términos para continuar.
                  </p>
                )}
              </div>
            </div>

            {status === "error" && errorMsg && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M12 9v4m0 4h.01M10.3 3.86l-8.5 14.7A1.5 1.5 0 003.1 21h17.8a1.5 1.5 0 001.3-2.44l-8.5-14.7a1.5 1.5 0 00-2.6 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => goTo(2)}
                disabled={status === "loading"}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 font-semibold text-white/80 transition-all duration-300 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M19 12H5m6 6l-6-6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Atrás
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-[44px] flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-3 font-semibold text-white transition-all duration-300 hover:from-orange-400 hover:to-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="ep-spinner h-5 w-5"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="opacity-25"
                      />
                      <path
                        d="M21 12a9 9 0 00-9-9"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Enviando…
                  </>
                ) : (
                  "Recibir mi cotización"
                )}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-white/40">
              ¿Prefieres escribirnos? {BRAND.phone} ·{" "}
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-300 underline underline-offset-2 hover:text-teal-200"
              >
                WhatsApp
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
