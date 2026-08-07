import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { actions } from "astro:actions";
import { BLOCKS, getBlock } from "../config/blocks";
import {
  computeProgress,
  getVisibleQuestions,
  indexOfId,
  isAnswered,
  validateAnswer,
} from "../lib/visible-questions";
import { isAnswerable, type AnswerMap, type AnswerValue } from "../types";
import { QuestionRenderer } from "./QuestionRenderer";
import { SummaryScreen } from "./SummaryScreen";

/**
 * Orquestador del brief: estado, navegación, autoguardado y transiciones.
 * No conoce ninguna pregunta concreta — todo sale de config/questions.ts a
 * través del motor de lib/visible-questions.
 *
 * Contrato de guardado: el enlace se comparte y varias personas responden a la
 * vez, así que el cliente solo envía las claves que TOCÓ (un parche). El merge
 * ocurre en Postgres; aquí nunca se manda el mapa completo, que pisaría lo que
 * otra persona acaba de escribir.
 */

type Props = {
  token: string;
  organization: string;
  initialAnswers: AnswerMap;
};

type Phase = "questions" | "summary";
type SaveState = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_MS = 900;

export default function BriefForm({ token, organization, initialAnswers }: Props) {
  const reduced = useReducedMotion();
  const [answers, setAnswers] = useState<AnswerMap>(initialAnswers);
  // Un brief completed nunca llega aquí: la página redirige a /brief/gracias
  // antes de renderizar la isla. Quien ya respondió todo y vuelve al enlace
  // espera la pantalla de envío, no la pregunta 1 con 60 pantallas por delante.
  const [phase, setPhase] = useState<Phase>(() => {
    const pendiente = getVisibleQuestions(initialAnswers).some(
      (q) => isAnswerable(q) && !isAnswered(q, initialAnswers[q.id])
    );
    return pendiente ? "questions" : "summary";
  });
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [copied, setCopied] = useState(false);

  const visible = useMemo(() => getVisibleQuestions(answers), [answers]);

  // La posición se guarda por ID, no por índice: responder "no" a una
  // condicional borra preguntas del array y un índice apuntaría a otra.
  const [currentId, setCurrentId] = useState<string>(() => {
    const first = visible.find((q) => isAnswerable(q) && !isAnswered(q, initialAnswers[q.id]));
    return (first ?? visible[0]).id;
  });

  const index = indexOfId(answers, currentId);
  const question = visible[Math.min(index, visible.length - 1)];
  const progress = useMemo(() => computeProgress(answers), [answers]);
  const block = getBlock(question.block);
  const blockNumber = BLOCKS.findIndex((b) => b.id === question.block) + 1;

  const headingRef = useRef<HTMLDivElement>(null);
  const pending = useRef<AnswerMap>({});
  const timer = useRef<number | null>(null);

  // Espejo SÍNCRONO de answers. Los campos de opción única avanzan con
  // setTimeout(onAdvance, 220), y ese timeout captura el goNext del render en
  // que se hizo clic — cuyo `answers` NO incluye el clic. Validar contra ese
  // estado viejo mostraba "indispensable" en el primer clic de toda pregunta
  // obligatoria. La navegación lee siempre este ref, que onChange actualiza en
  // el acto, así que nunca ve un estado anterior al último cambio.
  const answersRef = useRef<AnswerMap>(initialAnswers);

  // ── Autoguardado ──────────────────────────────────────────────────────────
  const flush = useCallback(async () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    const patch = pending.current;
    if (Object.keys(patch).length === 0) return;
    pending.current = {};
    setSaveState("saving");
    const { data, error: actionError } = await actions.brief.save({ token, answers: patch });
    if (actionError) {
      // Se devuelve el parche a la cola: el siguiente intento lo reenvía.
      pending.current = { ...patch, ...pending.current };
      setSaveState("error");
      return;
    }
    if (data) setSaveState("saved");
  }, [token]);

  const queueSave = useCallback(
    (id: string, value: AnswerValue) => {
      pending.current[id] = value;
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => void flush(), AUTOSAVE_MS);
    },
    [flush]
  );

  // Cerrar la pestaña o cambiar de app no debe perder lo último escrito.
  useEffect(() => {
    const onHide = () => void flush();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, [flush]);

  const onChange = useCallback(
    (value: AnswerValue) => {
      answersRef.current = { ...answersRef.current, [question.id]: value };
      setAnswers(answersRef.current);
      setError(null);
      queueSave(question.id, value);
    },
    [question.id, queueSave]
  );

  // ── Navegación ────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (id: string, dir: 1 | -1) => {
      setDirection(dir);
      setCurrentId(id);
      setError(null);
      void flush();
    },
    [flush]
  );

  const goNext = useCallback(() => {
    const current = answersRef.current;
    if (isAnswerable(question)) {
      const result = validateAnswer(question, current[question.id]);
      if (!result.ok) {
        setError(result.message ?? "Revisa esta respuesta.");
        return;
      }
    }
    // El conjunto visible pudo cambiar con la última respuesta: se recalcula.
    const list = getVisibleQuestions(current);
    const at = list.findIndex((q) => q.id === question.id);
    const next = list[at + 1];
    if (!next) {
      setDirection(1);
      setPhase("summary");
      void flush();
      return;
    }
    goTo(next.id, 1);
  }, [question, goTo, flush]);

  const goBack = useCallback(() => {
    const list = getVisibleQuestions(answersRef.current);
    if (phase === "summary") {
      setDirection(-1);
      setPhase("questions");
      setCurrentId(list[list.length - 1].id);
      return;
    }
    const at = list.findIndex((q) => q.id === question.id);
    const prev = list[at - 1];
    if (prev) goTo(prev.id, -1);
  }, [phase, question.id, goTo]);

  const editFromSummary = useCallback(
    (id: string) => {
      setPhase("questions");
      setDirection(-1);
      setCurrentId(id);
      setError(null);
    },
    []
  );

  // Anunciar el cambio de pantalla a lectores de pantalla. Los campos de texto
  // roban el foco 120 ms después, así que esto no estorba a quien escribe.
  useEffect(() => {
    if (phase !== "questions") return;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [currentId, phase, reduced]);

  const onSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    await flush();
    const { data, error: actionError } = await actions.brief.submit({ token });
    if (actionError) {
      setSubmitting(false);
      setError(actionError.message);
      return;
    }
    // replace(): el enlace con token sale del historial — "atrás" desde la
    // página de gracias no vuelve a una vista con respuestas.
    if (data) window.location.replace("/brief/gracias");
  }, [flush, token]);

  const copyLink = useCallback(async () => {
    const url = window.location.href;
    let ok = false;
    // 1) API moderna. Puede no existir o rechazar por permisos según navegador.
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      // 2) Respaldo clásico: campo temporal + execCommand, no pide permiso.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (!ok) {
      // 3) Último recurso: mostrar el enlace para copiarlo a mano.
      window.prompt("Copia este enlace para compartir el formulario:", url);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const slide = reduced ? 0 : direction * 28;
  const transition = { duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] as const };
  const isStatement = question.type === "statement";
  const wide =
    question.type === "priorityMatrix" ||
    question.type === "accessChecklist" ||
    question.type === "repeater";

  return (
    <div className="flex min-h-dvh flex-col bg-[#fbfaf9]">
      <ProgressHeader
        progress={progress}
        blockLabel={phase === "summary" ? "Revisión final" : `${blockNumber}. ${block.shortLabel}`}
        saveState={saveState}
        canGoBack={phase === "summary" || index > 0}
        onBack={goBack}
        onCopyLink={copyLink}
        copied={copied}
      />

      <main className="flex flex-1 items-start justify-center px-5 pb-28 pt-10 sm:pt-16">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "summary" ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: slide }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -slide }}
              transition={transition}
              className="w-full max-w-3xl"
            >
              <SummaryScreen
                answers={answers}
                organization={organization}
                submitting={submitting}
                error={error}
                onEdit={editFromSummary}
                onSubmit={onSubmit}
              />
            </motion.div>
          ) : (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: slide }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -slide }}
              transition={transition}
              className={`w-full ${wide ? "max-w-4xl" : "max-w-2xl"}`}
            >
              <div ref={headingRef} tabIndex={-1} className="outline-none">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                  {block.title}
                </p>
                <h2
                  id={`q-${question.id}`}
                  className={
                    "text-balance text-center font-bold leading-[1.15] tracking-tight text-slate-900 " +
                    (isStatement ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[2rem]")
                  }
                >
                  {question.title}
                  {isAnswerable(question) && question.required && (
                    <span className="ml-1.5 align-super text-base text-orange-500" title="Indispensable">
                      *
                    </span>
                  )}
                </h2>
                {question.hint && (
                  <p className="mx-auto mt-3 max-w-xl text-pretty text-center text-[15px] leading-relaxed text-slate-500">
                    {question.hint}
                  </p>
                )}
              </div>

              <div className="mt-8">
                {isAnswerable(question) ? (
                  <>
                    <QuestionRenderer
                      question={question}
                      value={answers[question.id]}
                      onChange={onChange}
                      onAdvance={goNext}
                      error={error}
                      autoFocus
                      labelledBy={`q-${question.id}`}
                    />
                    {error && (
                      <p role="alert" className="mt-3 text-sm font-medium text-red-600">
                        {error}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-center text-sm text-slate-500">
                    Bloque {blockNumber} de {BLOCKS.length} · unos {block.estimatedMinutes} minutos
                  </p>
                )}
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
                >
                  {isStatement
                    ? (question.ctaLabel ?? "Continuar")
                    : index === visible.length - 1
                      ? "Revisar respuestas"
                      : "Continuar"}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10m0 0-4-4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isAnswerable(question) && !question.required && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:text-slate-800"
                  >
                    Omitir
                  </button>
                )}
              </div>

              <p className="mt-6 text-center text-xs text-slate-400">
                Pregunta {index + 1} de {visible.length} · el avance se guarda solo
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ── Cabecera ────────────────────────────────────────────────────────────────
function ProgressHeader({
  progress,
  blockLabel,
  saveState,
  canGoBack,
  onBack,
  onCopyLink,
  copied,
}: {
  progress: number;
  blockLabel: string;
  saveState: SaveState;
  canGoBack: boolean;
  onBack: () => void;
  onCopyLink: () => void;
  copied: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#fbfaf9]/90 backdrop-blur">
      <div
        className="h-1 bg-orange-500 transition-[width] duration-500 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Avance del formulario"
      />
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3">
        <span className="flex items-center gap-2">
          <img src="/iconcodebrand.svg" alt="" width={26} height={26} className="h-[26px] w-[26px]" />
          <span className="hidden text-sm font-semibold tracking-tight text-slate-900 sm:block">
            Codebrand
          </span>
        </span>
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M13 8H3m0 0 4-4M3 8l4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Atrás
        </button>

        <span className="ml-auto hidden text-sm text-slate-500 sm:block">{blockLabel}</span>

        <button
          type="button"
          onClick={onCopyLink}
          className="shrink-0 whitespace-nowrap rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-white"
        >
          {copied ? "Copiado" : "Compartir"}
          <span className="hidden sm:inline">{copied ? " el enlace" : " enlace"}</span>
        </button>

        <span
          aria-live="polite"
          className="shrink-0 whitespace-nowrap text-right text-xs font-medium tabular-nums text-slate-500"
        >
          {saveState === "saving" ? (
            "Guardando…"
          ) : saveState === "error" ? (
            "Sin guardar"
          ) : (
            <>
              {progress}%<span className="hidden sm:inline"> completado</span>
            </>
          )}
        </span>
      </div>
    </header>
  );
}

