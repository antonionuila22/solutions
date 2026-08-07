import { useMemo } from "react";
import { getBlockingQuestions } from "../lib/visible-questions";
import { toBlocks } from "../services/render-answers";
import type { AnswerMap } from "../types";

/**
 * Revisión previa al envío. Muestra únicamente las preguntas visibles y marca
 * las indispensables que faltan, con un atajo para saltar a cada una. El botón
 * de envío no se bloquea por diseño: el servidor vuelve a validar y devuelve
 * el motivo — un botón inerte sin explicación es peor que un error claro.
 */
export function SummaryScreen({
  answers,
  organization,
  submitting,
  error,
  onEdit,
  onSubmit,
}: {
  answers: AnswerMap;
  organization: string;
  submitting: boolean;
  error: string | null;
  onEdit: (questionId: string) => void;
  onSubmit: () => void;
}) {
  const blocks = useMemo(() => toBlocks(answers), [answers]);
  const missing = useMemo(() => getBlockingQuestions(answers), [answers]);
  const missingIds = useMemo(() => new Set(missing.map((q) => q.id)), [missing]);

  return (
    <div>
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
        Último paso
      </p>
      <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
        Revisa el brief antes de enviarlo
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-center text-[15px] leading-relaxed text-slate-500">
        Al enviarlo, las respuestas quedan fijadas y llegan al equipo de Codebrand. Después de eso
        este enlace ya no admite cambios.
      </p>

      {missing.length > 0 && (
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-orange-900">
            Faltan {missing.length} {missing.length === 1 ? "respuesta" : "respuestas"} indispensables
          </p>
          <ul className="mt-2 grid gap-1.5">
            {missing.map((q) => (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => onEdit(q.id)}
                  className="text-left text-sm text-orange-900 underline decoration-orange-300 underline-offset-4 transition hover:decoration-orange-600"
                >
                  {q.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-6">
        {blocks.map((block) => (
          <section key={block.id}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              {block.title}
            </h3>
            <ul className="grid gap-2">
              {block.items.map((item) => {
                const falta = missingIds.has(item.id);
                return (
                  <li
                    key={item.id}
                    className={
                      "rounded-xl border bg-white p-3.5 " +
                      (falta ? "border-orange-300" : "border-slate-200")
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-snug text-slate-800">
                        {item.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => onEdit(item.id)}
                        className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-orange-600 transition hover:bg-orange-50"
                      >
                        Editar
                      </button>
                    </div>
                    {item.answered ? (
                      <ul className="mt-1.5 grid gap-1">
                        {item.lines.map((line, i) => (
                          <li key={i} className="text-sm leading-relaxed text-slate-600">
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className={
                          "mt-1.5 text-sm " + (falta ? "text-orange-700" : "text-slate-400")
                        }
                      >
                        {falta ? "Indispensable — sin responder." : "Sin responder."}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30 disabled:opacity-60"
        >
          {submitting ? "Enviando…" : `Enviar el brief de ${organization}`}
        </button>
        <p className="text-xs text-slate-400">Recibirás confirmación en pantalla al enviarlo.</p>
      </div>
    </div>
  );
}
