import { useEffect } from "react";
import { choiceClass, keyCapClass, optionKey, type FieldProps } from "../field-contract";
import type { MultiChoiceQuestion, RatingScaleQuestion, SingleChoiceQuestion } from "../../types";

/**
 * Teclas rápidas A, B, C… Solo se activan cuando el foco no está en un campo
 * de escritura, así que nunca interceptan lo que alguien está tecleando.
 */
function useOptionHotkeys(count: number, pick: (index: number) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      const i = e.key.toUpperCase().charCodeAt(0) - 65;
      if (e.key.length !== 1 || i < 0 || i >= count) return;
      e.preventDefault();
      pick(i);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count, pick]);
}

/**
 * Opción única. Seleccionar avanza solo, como en un Typeform, pero con un
 * respiro de 220 ms para que se vea el estado elegido antes de la transición.
 */
export function SingleChoiceField({
  question,
  value,
  onChange,
  onAdvance,
  labelledBy,
}: FieldProps<SingleChoiceQuestion>) {
  const current = typeof value === "string" ? value : "";

  const pick = (v: string) => {
    onChange(v);
    window.setTimeout(onAdvance, 220);
  };

  useOptionHotkeys(question.options.length, (i) => pick(question.options[i].value));

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-2.5">
      {question.options.map((opt, i) => {
        const selected = current === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            // El cuadro de la tecla rápida es aria-hidden: sin esta etiqueta el
            // nombre accesible dependería de cómo cada lector una los <span>.
            aria-label={opt.label}
            data-choice-key={optionKey(i)}
            className={choiceClass(selected)}
            onClick={() => pick(opt.value)}
          >
            <span className={keyCapClass(selected)} aria-hidden="true">
              {optionKey(i)}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Opción múltiple: no avanza sola, la persona decide cuándo terminó. */
export function MultiChoiceField({
  question,
  value,
  onChange,
  labelledBy,
}: FieldProps<MultiChoiceQuestion>) {
  const current = Array.isArray(value) ? (value as string[]) : [];
  const atMax = question.maxSelected !== undefined && current.length >= question.maxSelected;

  const toggle = (v: string) => {
    if (current.includes(v)) {
      onChange(current.filter((x) => x !== v));
      return;
    }
    if (atMax) return;
    const next = [...current, v];
    // Con `ordered`, el orden de los clics ES la respuesta (prioridad 1, 2, 3…).
    // Sin la bandera se normaliza al orden del catálogo, para que el resumen y
    // el correo se lean igual sin importar cómo se marcaron.
    onChange(
      question.ordered
        ? next
        : question.options.filter((o) => next.includes(o.value)).map((o) => o.value)
    );
  };

  useOptionHotkeys(question.options.length, (i) => toggle(question.options[i].value));

  return (
    <div role="group" aria-labelledby={labelledBy} className="grid gap-2.5">
      {question.options.map((opt, i) => {
        const selected = current.includes(opt.value);
        // En modo ordenado, la casilla muestra la PRIORIDAD (1, 2, 3…) en vez
        // de la letra de atajo: el número es la respuesta que se está dando.
        const rank = question.ordered && selected ? current.indexOf(opt.value) + 1 : null;
        return (
          <button
            key={opt.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            aria-label={rank !== null ? `${opt.label}, prioridad ${rank}` : opt.label}
            disabled={!selected && atMax}
            data-choice-key={optionKey(i)}
            className={`${choiceClass(selected)} disabled:cursor-not-allowed disabled:opacity-50`}
            onClick={() => toggle(opt.value)}
          >
            <span className={keyCapClass(selected)} aria-hidden="true">
              {rank ?? optionKey(i)}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
      {question.maxSelected !== undefined && (
        <p className="text-xs text-slate-500" aria-live="polite">
          {question.ordered
            ? `Marcadas en orden de importancia: ${current.length} de ${question.maxSelected}. Para corregir, desmarca y vuelve a marcar.`
            : `Máximo ${question.maxSelected} · seleccionadas ${current.length}`}
        </p>
      )}
    </div>
  );
}

export function RatingScaleField({
  question,
  value,
  onChange,
  onAdvance,
  labelledBy,
}: FieldProps<RatingScaleQuestion>) {
  const current = typeof value === "number" ? value : null;
  const steps: number[] = [];
  for (let n = question.min; n <= question.max; n++) steps.push(n);

  return (
    <div>
      <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
        {steps.map((n) => {
          const selected = current === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              className={
                "h-12 w-12 rounded-xl border text-base font-semibold transition " +
                "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 " +
                (selected
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50")
              }
              onClick={() => {
                onChange(n);
                window.setTimeout(onAdvance, 220);
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      {(question.minLabel || question.maxLabel) && (
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      )}
    </div>
  );
}
