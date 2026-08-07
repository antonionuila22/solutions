import { inputClass, type FieldProps } from "../field-contract";
import type { AccessChecklistQuestion } from "../../types";

type Entry = { disponible: string; responsable: string };

/**
 * Checklist de accesos: por cada acceso, disponibilidad + responsable.
 * Mismo criterio que la matriz — una tarjeta por acceso, un solo marcado que
 * se aplana en fila desde `lg`. El campo "responsable" solo aparece cuando la
 * disponibilidad ya está marcada: preguntar de quién es algo que todavía no se
 * sabe si existe es ruido.
 */
export function AccessChecklistField({
  question,
  value,
  onChange,
  labelledBy,
}: FieldProps<AccessChecklistQuestion>) {
  const current = (value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {}) as Record<string, Entry>;

  const patch = (itemId: string, next: Partial<Entry>) => {
    const prev: Entry = current[itemId] ?? { disponible: "", responsable: "" };
    onChange({ ...current, [itemId]: { ...prev, ...next } });
  };

  return (
    <ul aria-labelledby={labelledBy} className="grid gap-2.5">
      {question.items.map((item) => {
        const entry = current[item.id];
        return (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="lg:flex lg:items-center lg:gap-4">
              <span
                id={`ac-${item.id}`}
                className="block min-w-0 flex-1 text-[15px] font-medium leading-snug text-slate-800"
              >
                {item.label}
              </span>
              <div
                role="radiogroup"
                aria-labelledby={`ac-${item.id}`}
                className="mt-2.5 grid grid-cols-3 gap-1.5 lg:mt-0 lg:w-[21rem] lg:shrink-0"
              >
                {question.availabilityOptions.map((opt) => {
                  const on = entry?.disponible === opt.value;
                  return (
                    <button
                      key={opt.value}
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
                      onClick={() => patch(item.id, { disponible: opt.value })}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {entry?.disponible && (
              <label className="mt-3 block">
                <span className="mb-1 block text-xs font-medium text-slate-500">
                  Responsable de este acceso
                </span>
                <input
                  type="text"
                  className={`${inputClass} py-2.5 text-base`}
                  value={entry.responsable ?? ""}
                  placeholder="Nombre y cargo, o «por confirmar»"
                  onChange={(e) => patch(item.id, { responsable: e.target.value })}
                />
              </label>
            )}
          </li>
        );
      })}
    </ul>
  );
}
