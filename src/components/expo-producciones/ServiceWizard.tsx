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
  /**
   * "inline" = tarjeta glass autónoma (uso original).
   * "modal"  = sin chrome (el QuoteModal aporta la superficie), con
   *            encabezado de progreso pegado arriba y barra de acción abajo.
   */
  variant?: "inline" | "modal";
}

type Status = "idle" | "loading" | "error";

// Reflejan EXACTAMENTE los validadores del servidor (src/lib/validation.ts):
// que el formulario sea válido en cliente garantiza que el servidor lo acepte.
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,10})+$/;
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/;
const TOTAL_STEPS = 3;

/**
 * Limpia texto para el campo `message`. El conjunto permitido es un SUBCONJUNTO
 * del patrón del servidor (PATTERNS.message), así nunca produce un carácter que
 * el backend rechace (p. ej. ç, ã, ×, ÷). Reemplaza lo no permitido por espacio.
 */
function sanitizeMessage(raw: string): string {
  return raw
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-,.!?;:'"()\n]/g, " ")
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

/** Check pequeño en línea (resúmenes y validación de campos). */
function MiniCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className={className}
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5m6 6l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServiceWizard({
  preselectedServiceId,
  variant = "inline",
}: Props) {
  const uid = useId();
  const isModal = variant === "modal";

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
  const [touched, setTouched] = useState<Set<string>>(() => new Set());

  const panelRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stepMountedRef = useRef(false);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Enfoca el encabezado del paso al avanzar/retroceder (no en el montaje
  // inicial, para no robar el foco que el modal pone en el botón "Cerrar").
  useEffect(() => {
    if (!isModal) return;
    if (!stepMountedRef.current) {
      stepMountedRef.current = true;
      return;
    }
    panelRef.current
      ?.querySelector<HTMLElement>("[data-step-heading]")
      ?.focus();
  }, [step, isModal]);

  const selectedLabels = useMemo(
    () =>
      selected
        .map((id) => WIZARD_SERVICE_OPTIONS.find((o) => o.id === id)?.label)
        .filter((v): v is string => Boolean(v)),
    [selected],
  );

  function markTouched(field: string) {
    setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field)));
  }

  function toggleService(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function goTo(next: number) {
    setDirection(next > step ? "next" : "prev");
    setStep(next);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
    if (isModal) {
      panelRef.current
        ?.closest<HTMLElement>("[data-scroll]")
        ?.scrollTo({ top: 0, behavior });
    } else if (panelRef.current) {
      const top =
        panelRef.current.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior });
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

  const detailsValid = details.trim().length >= 10;

  /** ¿Mostrar el error de un campo? Tras blur (touched) o tras intentar enviar. */
  const showFieldError = (field: string, valid: boolean) =>
    (touched.has(field) || showErrors) && !valid;

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
      requestAnimationFrame(() =>
        errorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
      );
    } catch {
      clearTimeout(timeout);
      setStatus("error");
      setErrorMsg(
        "Hubo un problema de conexión. Por favor inténtalo nuevamente en un momento.",
      );
      requestAnimationFrame(() =>
        errorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
      );
    }
  }

  const progressPct = (step / TOTAL_STEPS) * 100;

  const inputBase =
    "w-full rounded-xl bg-white/[0.05] border border-white/12 px-4 py-3.5 text-base text-white placeholder:text-white/35 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-orange-400/70 focus:border-orange-400/50 min-h-[48px]";
  const labelBase = "block text-sm font-medium text-white/80 mb-2.5";
  const fieldError = "mt-2 text-sm text-rose-300";

  // ── Clases dependientes de la variante ───────────────────────────────
  const rootClass = isModal
    ? "w-full flex flex-col text-white font-poppins"
    : "w-full max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#14141c] p-5 sm:p-8 text-white font-poppins shadow-2xl shadow-black/40";
  const padX = isModal ? "px-6 sm:px-8" : "";
  const progressClass = isModal
    ? `ep-wz-bar sticky top-0 z-20 ${padX} pt-5 pb-4 bg-[#14141c]`
    : "mb-7";
  const fieldsClass = isModal ? `${padX} py-7` : "";
  const footerClass = (justify: "between" | "end") =>
    isModal
      ? `ep-wz-bar sticky bottom-0 z-20 ${padX} py-4 bg-[#14141c] border-t border-white/10 flex items-center gap-3 ${
          justify === "end" ? "justify-end" : "justify-between"
        }`
      : `mt-7 flex items-center gap-3 ${
          justify === "end" ? "justify-end" : "justify-between"
        }`;

  const stepAnimClass =
    direction === "next" ? "ep-step-next" : "ep-step-prev";

  const btnPrimary =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all duration-300 ease-out-quart hover:from-orange-400 hover:to-orange-500 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:opacity-40";
  const btnGhost =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 font-semibold text-white/80 transition-all duration-300 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-40";

  const chipClass = (active: boolean) =>
    `rounded-full border px-4 py-2.5 text-sm transition-colors duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 ${
      active
        ? "border-orange-500 bg-orange-500/15 text-white font-medium"
        : "border-white/15 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:border-white/30"
    }`;

  return (
    <div ref={panelRef} className={rootClass}>
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
        /* Fondo sólido GARANTIZADO para las barras sticky de progreso/acción:
           viaja con el JS, así que aunque falte el CSS de Tailwind en caché,
           las barras nunca dejan ver el contenido que se desplaza debajo. */
        .ep-wz-bar { background-color: #14141c; }
        @media (prefers-reduced-motion: reduce) {
          .ep-step-next, .ep-step-prev, .ep-spinner { animation: none !important; }
        }
      `}</style>

      {/* Progreso */}
      <div className={progressClass}>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/55">
          Paso {step} de {TOTAL_STEPS}
        </p>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
          aria-label={`Paso ${step} de ${TOTAL_STEPS}`}
        >
          <div
            className="h-full rounded-full bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">
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

        {/* ───────────────────────── PASO 1 ───────────────────────── */}
        {step === 1 && (
          <div key="step1" className={`${stepAnimClass} ${fieldsClass}`}>
            <div className="mb-6">
              <h2
                data-step-heading
                tabIndex={-1}
                className="text-2xl font-bold text-white outline-none"
              >
                ¿Qué servicios necesitas?
              </h2>
              <p className="mt-2 text-base text-white/60">
                Elige uno o varios. Lo afinamos juntos en tu cotización.
              </p>
            </div>

            <div
              role="group"
              aria-label="Servicios disponibles"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {WIZARD_SERVICE_OPTIONS.map((opt) => {
                const isSel = selected.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleService(opt.id)}
                    aria-pressed={isSel}
                    className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 ${
                      isSel
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-white/12 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                        isSel
                          ? "bg-orange-500/15 text-orange-300"
                          : "bg-white/[0.06] text-white/55"
                      }`}
                    >
                      <Icon name={opt.icon} className="h-5 w-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-white leading-snug">
                        {opt.label}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        isSel
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-white/25 text-transparent"
                      }`}
                    >
                      <MiniCheck className="h-3.5 w-3.5" />
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
          </div>
        )}

        {/* ───────────────────────── PASO 2 ───────────────────────── */}
        {step === 2 && (
          <div key="step2" className={`${stepAnimClass} ${fieldsClass}`}>
            <div className="mb-6">
              <h2
                data-step-heading
                tabIndex={-1}
                className="text-2xl font-bold text-white outline-none"
              >
                Cuéntanos del proyecto
              </h2>
              <p className="mt-2 text-base text-white/60">
                Con esto preparamos una cotización más precisa.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Presupuesto */}
              <div>
                <span className={labelBase} id={`${uid}-budget-label`}>
                  Presupuesto estimado
                </span>
                <div
                  role="group"
                  aria-labelledby={`${uid}-budget-label`}
                  className="flex flex-wrap gap-2"
                >
                  {BUDGET_RANGES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      aria-pressed={budget === b}
                      onClick={() => setBudget(b)}
                      className={chipClass(budget === b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plazo */}
              <div>
                <span className={labelBase} id={`${uid}-timeline-label`}>
                  Plazo deseado
                </span>
                <div
                  role="group"
                  aria-labelledby={`${uid}-timeline-label`}
                  className="flex flex-wrap gap-2"
                >
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={timeline === t}
                      onClick={() => setTimeline(t)}
                      className={chipClass(timeline === t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industria (campo real de la API → se mantiene <select>) */}
              <div>
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

              {/* Detalles */}
              <div>
                <label htmlFor={`${uid}-details`} className={labelBase}>
                  Cuéntanos sobre tu proyecto
                </label>
                <textarea
                  id={`${uid}-details`}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                  placeholder="Objetivos, lo que tienes hoy, referencias o cualquier detalle relevante…"
                  className={`${inputBase} resize-y ${
                    detailsValid ? "border-teal-400/40" : ""
                  }`}
                  aria-describedby={`${uid}-details-hint`}
                />
                <p
                  id={`${uid}-details-hint`}
                  className={`mt-2 inline-flex items-center gap-1.5 text-sm ${
                    detailsValid ? "text-teal-300" : "text-white/55"
                  }`}
                >
                  {detailsValid && <MiniCheck className="h-3.5 w-3.5" />}
                  {detailsValid
                    ? `Perfecto (${details.trim().length} caracteres).`
                    : `Mínimo 10 caracteres (${details.trim().length}/10).`}
                </p>
                {showErrors && !detailsValid && (
                  <p role="alert" className={fieldError}>
                    Por favor cuéntanos un poco más (mínimo 10 caracteres).
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────── PASO 3 ───────────────────────── */}
        {step === 3 && (
          <div key="step3" className={`${stepAnimClass} ${fieldsClass}`}>
            <div className="mb-6">
              <h2
                data-step-heading
                tabIndex={-1}
                className="text-2xl font-bold text-white outline-none"
              >
                ¿A dónde enviamos tu cotización?
              </h2>
              <p className="mt-2 text-base text-white/60">
                Te respondemos en menos de 24 horas, sin compromiso.
              </p>
            </div>

            {/* Resumen de la solicitud */}
            <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              {selectedLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
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
              {(budget || timeline || industry) && (
                <dl className="mt-3 space-y-1.5 text-sm">
                  {budget && (
                    <div className="flex items-start gap-2.5">
                      <MiniCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                      <dt className="text-white/50">Presupuesto:</dt>
                      <dd className="text-white/80">{budget}</dd>
                    </div>
                  )}
                  {timeline && (
                    <div className="flex items-start gap-2.5">
                      <MiniCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                      <dt className="text-white/50">Plazo:</dt>
                      <dd className="text-white/80">{timeline}</dd>
                    </div>
                  )}
                  {industry && (
                    <div className="flex items-start gap-2.5">
                      <MiniCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                      <dt className="text-white/50">Industria:</dt>
                      <dd className="text-white/80">{industry}</dd>
                    </div>
                  )}
                </dl>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor={`${uid}-name`} className={labelBase}>
                  Nombre completo
                </label>
                <div className="relative">
                  <input
                    id={`${uid}-name`}
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => markTouched("name")}
                    autoComplete="name"
                    required
                    className={`${inputBase} ${
                      nameValid ? "border-teal-400/40 pr-10" : ""
                    }`}
                    placeholder="Tu nombre"
                    aria-invalid={showFieldError("name", nameValid)}
                  />
                  {nameValid && (
                    <MiniCheck className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-400" />
                  )}
                </div>
                {showFieldError("name", nameValid) && (
                  <p role="alert" className={fieldError}>
                    Ingresa tu nombre (solo letras, mínimo 2 caracteres).
                  </p>
                )}
              </div>

              {/* Correo + Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor={`${uid}-email`} className={labelBase}>
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      id={`${uid}-email`}
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => markTouched("email")}
                      autoComplete="email"
                      required
                      className={`${inputBase} ${
                        emailValid ? "border-teal-400/40 pr-10" : ""
                      }`}
                      placeholder="tucorreo@ejemplo.com"
                      aria-invalid={showFieldError("email", emailValid)}
                    />
                    {emailValid && (
                      <MiniCheck className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-400" />
                    )}
                  </div>
                  {showFieldError("email", emailValid) && (
                    <p role="alert" className={fieldError}>
                      Ingresa un correo válido.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`${uid}-phone`} className={labelBase}>
                    Teléfono / WhatsApp
                  </label>
                  <div className="relative">
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => markTouched("phone")}
                      autoComplete="tel"
                      required
                      className={`${inputBase} ${
                        phoneValid ? "border-teal-400/40 pr-10" : ""
                      }`}
                      placeholder="+504 0000-0000"
                      aria-invalid={showFieldError("phone", phoneValid)}
                    />
                    {phoneValid && (
                      <MiniCheck className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-400" />
                    )}
                  </div>
                  {showFieldError("phone", phoneValid) && (
                    <p role="alert" className={fieldError}>
                      Ingresa un teléfono válido (7 a 15 dígitos).
                    </p>
                  )}
                </div>
              </div>

              {/* Términos */}
              <div>
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
                ref={errorRef}
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

            {/* Garantías + contacto alterno (dentro del área desplazable) */}
            <div className="mt-6 space-y-2.5">
              <p className="flex items-center justify-center gap-2 text-center text-sm text-white/60">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-4 w-4 shrink-0 text-teal-400"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Tus datos están seguros y no hay ningún compromiso.
              </p>
              <p className="text-center text-sm text-white/55">
                ¿Prefieres hablar? Llámanos o escríbenos al {BRAND.phone} por{" "}
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal-300 underline underline-offset-2 hover:text-teal-200"
                >
                  WhatsApp
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {/* ───────────────────── BARRA DE ACCIÓN ───────────────────── */}
        {step === 1 && (
          <div className={footerClass("end")}>
            <button
              type="button"
              disabled={!step1Valid}
              onClick={() => goTo(2)}
              className={btnPrimary}
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={footerClass("between")}>
            <button type="button" onClick={() => goTo(1)} className={btnGhost}>
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </button>
            <button
              type="button"
              disabled={!step2Valid}
              onClick={() => goTo(3)}
              className={btnPrimary}
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className={footerClass("between")}>
            <button
              type="button"
              onClick={() => goTo(2)}
              disabled={status === "loading"}
              className={btnGhost}
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className={`${btnPrimary} flex-1 sm:flex-none px-7 disabled:opacity-60`}
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
        )}
      </form>
    </div>
  );
}
