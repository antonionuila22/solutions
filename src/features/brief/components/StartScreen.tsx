import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { actions } from "astro:actions";
import { inputClass } from "./field-contract";

/**
 * Portada de /brief. Abre una respuesta nueva y lleva a /brief/{token}: a
 * partir de ahí, esa URL ES el formulario — se puede compartir, cerrar y
 * retomar. Solo se pide la organización; el resto de datos de contacto los
 * pregunta el propio Bloque P, sin duplicar.
 */
export default function StartScreen({ defaultOrganization = "" }: { defaultOrganization?: string }) {
  const reduced = useReducedMotion();
  const [organization, setOrganization] = useState(defaultOrganization);
  const [website, setWebsite] = useState(""); // trampa anti-bots
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    if (organization.trim().length < 2) {
      setError("Escribe el nombre de la organización.");
      return;
    }
    setBusy(true);
    setError(null);
    const { data, error: actionError } = await actions.brief.start({
      organization: organization.trim(),
      website,
    });
    if (actionError || !data) {
      setBusy(false);
      setError(actionError?.message ?? "No se pudo abrir el formulario. Intenta de nuevo.");
      return;
    }
    window.location.href = `/brief/${data.token}`;
  };

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-xl text-center">
        <motion.img
          {...fade(0)}
          src="/iconcodebrand.svg"
          alt="Codebrand"
          width={48}
          height={48}
          className="mx-auto h-12 w-12"
        />

        <motion.h1
          {...fade(0.08)}
          className="mt-8 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl"
        >
          Formulario de descubrimiento
        </motion.h1>

        <motion.p
          {...fade(0.16)}
          className="mx-auto mt-4 max-w-lg text-pretty text-[17px] leading-relaxed text-slate-600"
        >
          Son 10 preguntas y toma menos de 10 minutos. No preguntamos nada que ya sabemos de
          ustedes. El avance se guarda solo y se puede completar entre varias personas
          compartiendo el mismo enlace.
        </motion.p>

        <motion.div {...fade(0.24)} className="mx-auto mt-9 max-w-sm text-left">
          <label htmlFor="organizacion" className="mb-1.5 block text-sm font-medium text-slate-700">
            Nombre de la organización
          </label>
          <input
            id="organizacion"
            type="text"
            className={inputClass}
            value={organization}
            placeholder="Nombre de tu empresa u organización"
            onChange={(e) => setOrganization(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void start();
              }
            }}
          />

          {/* Campo trampa: invisible para personas, irresistible para bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void start()}
            disabled={busy}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:opacity-60"
          >
            {busy ? "Abriendo…" : "Comenzar el brief"}
            {!busy && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10m0 0-4-4m4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </motion.div>

      </div>
    </main>
  );
}
