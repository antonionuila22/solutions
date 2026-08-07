import { inputClass, type FieldProps } from "../field-contract";
import type { RepeaterQuestion } from "../../types";

type Row = Record<string, string>;

/**
 * Filas dinámicas (referencias web). Genérico de verdad: las columnas salen de
 * `question.fields`, y una columna con `options` se dibuja como selector. El
 * componente no sabe qué es una "referencia web".
 *
 * Las filas mínimas se muestran vacías pero NO se persisten hasta que la
 * persona escribe: así una fila en blanco no cuenta como respuesta.
 */
export function RepeaterField({
  question,
  value,
  onChange,
  labelledBy,
}: FieldProps<RepeaterQuestion>) {
  const stored: Row[] = Array.isArray(value) ? (value as Row[]) : [];

  const blank = (): Row => Object.fromEntries(question.fields.map((f) => [f.key, ""]));
  const rows: Row[] = [...stored];
  while (rows.length < question.minRows) rows.push(blank());

  const commit = (next: Row[]) => onChange(next);

  const patch = (index: number, key: string, v: string) => {
    const next = rows.map((r, i) => (i === index ? { ...r, [key]: v } : { ...r }));
    commit(next);
  };

  const removeRow = (index: number) => commit(rows.filter((_, i) => i !== index));

  return (
    <div aria-labelledby={labelledBy} className="grid gap-3">
      {rows.map((row, i) => (
        <fieldset
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4"
        >
          <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {i + 1}
          </legend>
          <div className="grid gap-3">
            {question.fields.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-1 block text-xs font-medium text-slate-500">
                  {field.label}
                </span>
                {field.options ? (
                  <div className="flex flex-wrap gap-1.5">
                    {field.options.map((opt) => {
                      const on = row[field.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={on}
                          className={
                            "rounded-lg border px-3 py-2 text-xs font-medium transition " +
                            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 " +
                            (on
                              ? "border-orange-500 bg-orange-500 text-white"
                              : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:bg-slate-50")
                          }
                          onClick={() => patch(i, field.key, opt.value)}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : field.multiline ? (
                  <textarea
                    rows={2}
                    className={`${inputClass} resize-none py-2.5 text-base`}
                    value={row[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => patch(i, field.key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className={`${inputClass} py-2.5 text-base`}
                    value={row[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => patch(i, field.key, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          {rows.length > question.minRows && (
            <button
              type="button"
              className="mt-3 text-xs font-medium text-slate-500 underline underline-offset-4 transition hover:text-slate-700"
              onClick={() => removeRow(i)}
            >
              Quitar
            </button>
          )}
        </fieldset>
      ))}

      {rows.length < question.maxRows && (
        <button
          type="button"
          className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-orange-400 hover:bg-orange-50/50 hover:text-slate-800"
          onClick={() => commit([...rows, blank()])}
        >
          + {question.addRowLabel}
        </button>
      )}
    </div>
  );
}
