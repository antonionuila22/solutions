import { MODULES } from "../../config/modules";
import type { FieldProps } from "../field-contract";
import type { PriorityMatrixQuestion } from "../../types";

/**
 * Matriz de prioridades — la pantalla de mayor riesgo del formulario:
 * 17 módulos × 4 niveles. Decisiones tomadas a propósito:
 *
 *  - NUNCA una tabla con scroll horizontal. Un solo marcado responsive: en
 *    móvil cada módulo es una tarjeta con los niveles en rejilla 2×2; desde
 *    `lg` la misma tarjeta se aplana en fila y se lee como tabla. Un único
 *    marcado significa que no hay dos versiones que puedan divergir.
 *  - Encabezado de niveles pegajoso solo en escritorio, donde existe la fila.
 *  - Contador de avance + atajo para cerrar la cola: 17 decisiones seguidas es
 *    donde la gente abandona, y las últimas casi siempre son "No aplica".
 */
export function PriorityMatrixField({
  question,
  value,
  onChange,
  labelledBy,
}: FieldProps<PriorityMatrixQuestion>) {
  const current = (value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {}) as Record<string, string>;

  const modules = question.moduleIds
    .map((id) => MODULES.find((m) => m.id === id))
    .filter((m): m is (typeof MODULES)[number] => Boolean(m));

  const done = modules.filter((m) => current[m.id]).length;
  const pending = modules.filter((m) => !current[m.id]);

  const set = (moduleId: string, level: string) => {
    onChange({ ...current, [moduleId]: level });
  };

  const fillRestWith = (level: string) => {
    const next = { ...current };
    for (const m of pending) next[m.id] = level;
    onChange(next);
  };

  return (
    <div aria-labelledby={labelledBy}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-600" aria-live="polite">
          {done} de {modules.length} módulos definidos
        </p>
        {pending.length > 0 && done > 0 && (
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50"
            onClick={() => fillRestWith("no-aplica")}
          >
            Marcar los {pending.length} restantes como «No aplica»
          </button>
        )}
      </div>

      {/* Encabezado de niveles: solo donde la tarjeta se aplana en fila. */}
      <div className="sticky top-0 z-10 hidden bg-white/95 pb-2 backdrop-blur lg:block">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
          <span className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Módulo
          </span>
          <div className="grid w-[26rem] shrink-0 grid-cols-4 gap-1.5">
            {question.levels.map((l) => (
              <span
                key={l.value}
                className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ul className="grid gap-2.5">
        {modules.map((m) => {
          const selected = current[m.id];
          return (
            <li
              key={m.id}
              className={
                "rounded-xl border p-3.5 transition lg:flex lg:items-center lg:gap-4 lg:py-2.5 " +
                (selected ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50/60")
              }
            >
              <span
                id={`mx-${m.id}`}
                className="block min-w-0 flex-1 text-[15px] font-medium leading-snug text-slate-800"
              >
                {m.label}
              </span>
              <div
                role="radiogroup"
                aria-labelledby={`mx-${m.id}`}
                className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:mt-0 lg:w-[26rem] lg:shrink-0"
              >
                {question.levels.map((l) => {
                  const on = selected === l.value;
                  return (
                    <button
                      key={l.value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      className={
                        "rounded-lg border px-2 py-2 text-xs font-medium transition " +
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 " +
                        (on
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50")
                      }
                      onClick={() => set(m.id, l.value)}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
