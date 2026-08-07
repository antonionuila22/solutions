import { QUESTIONS } from "../config/questions";
import {
  isAnswerable,
  type AnswerMap,
  type AnswerValue,
  type AnswerableQuestion,
  type Question,
} from "../types";

/**
 * Motor de navegación y progreso. Puro y sin dependencias de React ni de la
 * base de datos: la Action del servidor y la isla del cliente ejecutan
 * EXACTAMENTE estas mismas funciones, así que nunca pueden discrepar sobre
 * qué preguntas están visibles ni sobre cuáles faltan.
 *
 * Invariante central: todo — progreso, validación de envío, "siguiente" — se
 * calcula sobre las preguntas VISIBLES según showIf, nunca sobre QUESTIONS.
 */

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function getVisibleQuestions(answers: AnswerMap): Question[] {
  return QUESTIONS.filter((q) => (q.showIf ? q.showIf(answers) : true));
}

export function getVisibleAnswerable(answers: AnswerMap): AnswerableQuestion[] {
  return getVisibleQuestions(answers).filter(isAnswerable);
}

export function findQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

/**
 * ¿Hay contenido real en la respuesta? No es lo mismo que "válida": una URL mal
 * escrita está respondida pero no es válida. El progreso usa esta función; los
 * mensajes de error usan validateAnswer.
 */
export function isAnswered(q: AnswerableQuestion, value: AnswerValue | undefined): boolean {
  if (value === undefined || value === null) return false;
  switch (q.type) {
    case "shortText":
    case "longText":
    case "email":
    case "singleChoice":
      return typeof value === "string" && value.trim().length > 0;
    case "multiChoice":
      // Nunca 0: una lista vacía es "no respondida", aunque la pregunta sea
      // opcional y su minSelected valga 0.
      return Array.isArray(value) && value.length >= Math.max(1, q.minSelected ?? 1);
    case "ratingScale":
      return typeof value === "number" && Number.isFinite(value);
    case "priorityMatrix":
      // Exhaustiva por diseño: la matriz define el alcance, media matriz no
      // sirve para cotizar. El schema por-pregunta es parcial (autosave), la
      // exigencia de las 17 filas vive aquí y en el submit del servidor.
      return (
        isRecord(value) &&
        q.moduleIds.every((id) => typeof value[id] === "string" && (value[id] as string).length > 0)
      );
    case "accessChecklist":
      return isRecord(value) && Object.keys(value).length > 0;
    case "repeater":
      return Array.isArray(value) && q.schema.safeParse(value).success;
  }
}

export interface ValidationResult {
  ok: boolean;
  message?: string;
}

const OK: ValidationResult = { ok: true };

/** Regla única: obligatoriedad + el Zod declarado en la propia pregunta. */
export function validateAnswer(
  q: AnswerableQuestion,
  value: AnswerValue | undefined
): ValidationResult {
  const answered = isAnswered(q, value);
  if (q.required && !answered) {
    return {
      ok: false,
      message:
        q.type === "priorityMatrix"
          ? "Asigna un nivel a los 17 módulos: esta tabla define el alcance y el costo."
          : "Esta respuesta es indispensable para poder cotizar.",
    };
  }
  if (!answered) return OK; // opcional y vacía
  const parsed = q.schema.safeParse(value);
  if (parsed.success) return OK;
  return { ok: false, message: parsed.error.issues[0]?.message ?? "Revisa esta respuesta." };
}

/** Preguntas visibles, obligatorias y aún sin responder o inválidas. */
export function getBlockingQuestions(answers: AnswerMap): AnswerableQuestion[] {
  return getVisibleAnswerable(answers).filter((q) => !validateAnswer(q, answers[q.id]).ok);
}

/** 0–100 sobre preguntas visibles con respuesta. Los statement no cuentan. */
export function computeProgress(answers: AnswerMap): number {
  const answerable = getVisibleAnswerable(answers);
  if (answerable.length === 0) return 0;
  const done = answerable.filter((q) => isAnswered(q, answers[q.id])).length;
  return Math.round((done / answerable.length) * 100);
}

/**
 * Índice al que debe abrir el formulario: la primera pregunta visible sin
 * responder. Si están todas, la última pantalla (el resumen lo decide la isla).
 */
export function firstUnansweredIndex(answers: AnswerMap): number {
  const visible = getVisibleQuestions(answers);
  const idx = visible.findIndex((q) => isAnswerable(q) && !isAnswered(q, answers[q.id]));
  return idx === -1 ? visible.length : idx;
}

/**
 * Reubica la posición cuando cambia el conjunto visible. Se navega por ID, no
 * por índice: responder "no" a una condicional borra preguntas del array y un
 * índice guardado apuntaría a otra pregunta distinta.
 */
export function indexOfId(answers: AnswerMap, id: string | null): number {
  if (!id) return 0;
  const visible = getVisibleQuestions(answers);
  const exact = visible.findIndex((q) => q.id === id);
  if (exact !== -1) return exact;
  // La pregunta actual dejó de estar visible: retroceder a la anterior que sí
  // lo esté, según el orden canónico de QUESTIONS.
  const canonical = QUESTIONS.findIndex((q) => q.id === id);
  if (canonical === -1) return 0;
  for (let i = canonical - 1; i >= 0; i--) {
    const back = visible.findIndex((q) => q.id === QUESTIONS[i].id);
    if (back !== -1) return back;
  }
  return 0;
}

/** Solo los bloques que tienen alguna pregunta visible, en orden. */
export function getVisibleBlockIds(answers: AnswerMap): string[] {
  const seen: string[] = [];
  for (const q of getVisibleQuestions(answers)) {
    if (!seen.includes(q.block)) seen.push(q.block);
  }
  return seen;
}
