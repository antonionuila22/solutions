import type { z } from "zod";

/**
 * Brief de descubrimiento — contratos del dominio.
 *
 * Regla 1 del proyecto: el formulario es data-driven. Las preguntas viven en
 * config/questions.ts y NINGÚN componente conoce una pregunta específica.
 * Este archivo define el contrato discriminado por tipo que hace eso posible.
 *
 * Adaptación a este repo (Astro, no Next): las Server Actions del prompt son
 * Astro Actions; el "server-only" de Next se garantiza con el guard de
 * lib/env.ts (lanza si se importa en el cliente). La arquitectura del prompt
 * — Zod único, jsonb, token, showIf — se conserva íntegra.
 */

// Un solo bloque: el formulario de arranque son 10 pantallas directas, sin
// bloque de contacto (el enlace se envía a un cliente cuyo contacto ya
// tenemos) y sin la estructura A a I del documento original.
export const BLOCK_IDS = ["A"] as const;
export type BlockId = (typeof BLOCK_IDS)[number];

/** Valor de una respuesta según el tipo de pregunta que la produjo. */
export type AnswerValue =
  | string // shortText, longText, email, singleChoice
  | string[] // multiChoice
  | number // ratingScale
  | Record<string, string> // priorityMatrix: moduleId → nivel
  | Array<Record<string, string>> // repeater: filas dinámicas
  | Record<string, { disponible: string; responsable: string }>; // accessChecklist

/** Mapa completo de respuestas, clave = Question.id. Se persiste tal cual en jsonb. */
export type AnswerMap = Record<string, AnswerValue>;

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface RepeaterField {
  key: string;
  label: string;
  placeholder?: string;
  /** Si se declara, la columna se renderiza como selector en vez de texto.
   *  Mantiene el repetidor genérico: el componente no conoce ninguna columna. */
  options?: readonly ChoiceOption[];
  /** Columna de texto largo (textarea en vez de input). */
  multiline?: boolean;
}

interface QuestionBase {
  /** Estable: es la clave en el jsonb de la base de datos. NUNCA renombrar
   *  un id con respuestas ya guardadas. */
  id: string;
  block: BlockId;
  title: string;
  /** Texto de apoyo bajo la pregunta. */
  hint?: string;
  /** Las 16 marcadas como indispensables en el documento. */
  required: boolean;
  /** Regla única de validación: la consumen el cliente (UX) y la Action (seguridad). */
  schema: z.ZodType;
  /** Lógica condicional. La barra de progreso se calcula SOLO sobre las
   *  preguntas visibles según este predicado. */
  showIf?: (answers: AnswerMap) => boolean;
}

export interface ShortTextQuestion extends QuestionBase {
  type: "shortText";
  placeholder?: string;
}

export interface LongTextQuestion extends QuestionBase {
  type: "longText";
  placeholder?: string;
}

export interface EmailQuestion extends QuestionBase {
  type: "email";
  placeholder?: string;
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: "singleChoice";
  options: readonly ChoiceOption[];
}

export interface MultiChoiceQuestion extends QuestionBase {
  type: "multiChoice";
  options: readonly ChoiceOption[];
  minSelected?: number;
  maxSelected?: number;
  /** Conserva el ORDEN de los clics y lo muestra como prioridad (1, 2, 3…).
   *  Sin esta bandera, la selección se normaliza al orden del catálogo. */
  ordered?: boolean;
}

export interface PriorityMatrixQuestion extends QuestionBase {
  type: "priorityMatrix";
  /** Ids de config/modules.ts. En móvil se renderiza un módulo por tarjeta,
   *  nunca como tabla con scroll horizontal (decisión del brief). */
  moduleIds: readonly string[];
  levels: readonly ChoiceOption[];
}

export interface RepeaterQuestion extends QuestionBase {
  type: "repeater";
  fields: readonly RepeaterField[];
  minRows: number;
  maxRows: number;
  addRowLabel: string;
}

/** Checklist tabular del Bloque E: por cada acceso, disponibilidad y responsable.
 *  En móvil se renderiza un acceso por tarjeta, igual que la matriz. */
export interface AccessChecklistQuestion extends QuestionBase {
  type: "accessChecklist";
  items: readonly { id: string; label: string }[];
  availabilityOptions: readonly ChoiceOption[];
}

export interface RatingScaleQuestion extends QuestionBase {
  type: "ratingScale";
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

/** Pantalla informativa sin input: abre cada bloque con título y tiempo estimado. */
export interface StatementQuestion
  extends Omit<QuestionBase, "required" | "schema"> {
  type: "statement";
  /** Minutos estimados del bloque que abre. */
  estimatedMinutes?: number;
  ctaLabel?: string;
}

export type Question =
  | ShortTextQuestion
  | LongTextQuestion
  | EmailQuestion
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | PriorityMatrixQuestion
  | RepeaterQuestion
  | AccessChecklistQuestion
  | RatingScaleQuestion
  | StatementQuestion;

export type QuestionType = Question["type"];

/** Pregunta que persiste respuesta (todas menos statement). */
export type AnswerableQuestion = Exclude<Question, StatementQuestion>;

export function isAnswerable(q: Question): q is AnswerableQuestion {
  return q.type !== "statement";
}

export interface BlockDefinition {
  id: BlockId;
  title: string;
  /** Se muestra en la barra de progreso junto al porcentaje. */
  shortLabel: string;
  estimatedMinutes: number;
}

export type BriefStatus = "in_progress" | "completed";

/** Fila de brief_responses tal como la devuelve el repositorio. */
export interface BriefResponse {
  id: string;
  token: string;
  status: BriefStatus;
  contact_name: string | null;
  contact_email: string | null;
  organization: string;
  answers: AnswerMap;
  progress: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
