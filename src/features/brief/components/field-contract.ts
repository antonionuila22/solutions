import type { AnswerValue, AnswerableQuestion } from "../types";

/**
 * Contrato único de todos los campos. Un componente de campo NO conoce la
 * pregunta que renderiza, ni la persistencia, ni la navegación: recibe la
 * definición, el valor y dos callbacks. Esa es la regla que permite que
 * agregar una pregunta sea editar solo config/questions.ts.
 */
export interface FieldProps<Q extends AnswerableQuestion = AnswerableQuestion> {
  question: Q;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  /** Enter / seleccionar-y-avanzar. La isla decide si el paso es válido. */
  onAdvance: () => void;
  error?: string | null;
  autoFocus?: boolean;
  /** id del <h2> de la pregunta: los grupos de radios lo usan de etiqueta. */
  labelledBy: string;
}

/** Clases compartidas para que los nueve campos se vean como uno solo. */
export const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-lg text-slate-900 " +
  "placeholder:text-slate-400 outline-none transition " +
  "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15";

export const choiceClass = (selected: boolean) =>
  "group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-base transition " +
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/25 " +
  (selected
    ? "border-orange-500 bg-orange-50 text-slate-900"
    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50");

/** Cuadro/píldora que antecede a cada opción, con la tecla rápida. */
export const keyCapClass = (selected: boolean) =>
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold " +
  (selected
    ? "border-orange-500 bg-orange-500 text-white"
    : "border-slate-300 bg-slate-50 text-slate-500 group-hover:border-slate-400");

export const cardClass = "rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm";

/** A, B, C… para la navegación por teclado de las opciones. */
export const optionKey = (index: number): string =>
  index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
