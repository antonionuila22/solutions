import { z } from "zod";
import type { AnswerMap, ChoiceOption, Question } from "../types";
import { getBlock } from "./blocks";

/**
 * FUENTE ÚNICA de las preguntas del formulario de arranque.
 *
 * Redacción del cliente (decisión de producto): un formulario corto que obliga
 * a ELEGIR. La regla que lo gobierna está en la pantalla de bienvenida: si
 * todo importa, nada importa. Donde se piden 6 respuestas, son 6.
 *
 * Reglas del proyecto:
 *  - Agregar, quitar o reordenar preguntas = editar SOLO este archivo.
 *  - Cada pregunta declara su Zod aquí; cliente y Astro Action usan la misma.
 *  - Los ids son claves del jsonb: NUNCA se renombran con datos ya guardados.
 *  - En texto visible no se usan guiones (ni rayas ni medias): puntos y comas.
 *  - No se pregunta nada que ya sabemos del cliente (contacto, correos).
 */

// ── Schemas reutilizables ────────────────────────────────────────────────────
const requiredText = z
  .string()
  .trim()
  .min(1, "Esta respuesta es necesaria para avanzar.");
const optionalText = z.string().trim().optional().or(z.literal(""));

const OTRO = "otro";

// ── Constructores ────────────────────────────────────────────────────────────
type Opts = { hint?: string; required?: boolean; showIf?: (a: AnswerMap) => boolean };

/** Pares [valor, etiqueta] → opciones. Explícito: el valor es clave de jsonb. */
const opts = (...pairs: readonly (readonly [string, string])[]): ChoiceOption[] =>
  pairs.map(([value, label]) => ({ value, label }));

const enumOf = (options: readonly ChoiceOption[]) =>
  z.enum(options.map((o) => o.value) as [string, ...string[]]);

const statement = (id: string, title: string, hint?: string): Question => ({
  id,
  block: "A",
  type: "statement",
  title,
  hint,
  estimatedMinutes: getBlock("A").estimatedMinutes,
  ctaLabel: "Empezar",
});

const choice = (
  id: string,
  title: string,
  options: readonly ChoiceOption[],
  o: Opts = {}
): Question => ({
  id,
  block: "A",
  type: "singleChoice",
  title,
  hint: o.hint,
  required: o.required ?? false,
  schema: o.required ? enumOf(options) : enumOf(options).optional(),
  showIf: o.showIf,
  options,
});

const shortQ = (id: string, title: string, o: Opts & { placeholder?: string } = {}): Question => ({
  id,
  block: "A",
  type: "shortText",
  title,
  hint: o.hint,
  required: o.required ?? false,
  schema: o.required ? requiredText : optionalText,
  showIf: o.showIf,
  placeholder: o.placeholder,
});

const longQ = (
  id: string,
  title: string,
  o: Opts & { schema?: z.ZodType } = {}
): Question => ({
  id,
  block: "A",
  type: "longText",
  title,
  hint: o.hint,
  required: o.required ?? false,
  schema: o.schema ?? (o.required ? requiredText : optionalText),
  showIf: o.showIf,
});

/** Al menos N líneas con contenido. Para "nombren al menos 2 cosas". */
const minLines = (n: number, message: string) =>
  requiredText.refine(
    (v) => v.split("\n").filter((l) => l.trim().length > 0).length >= n,
    message
  );

// ── Preguntas ────────────────────────────────────────────────────────────────
export const QUESTIONS: readonly Question[] = [
  statement(
    "arranque-intro",
    "Formulario de arranque: rediseño del website",
    "Son 10 preguntas y toma menos de 10 minutos. No preguntamos nada que ya sabemos de ustedes. Una regla antes de empezar: si todo importa, nada importa. La web actual intenta decir todo al mismo tiempo, y por eso no dice nada. Este formulario existe para que elijan. Donde pedimos 6 respuestas, son 6. La respuesta «todo» nos deja exactamente donde estamos hoy."
  ),

  // 1. La acción número uno
  choice(
    "q1-accion",
    "La acción número uno",
    opts(
      ["info-membresia", "Pedir información de la membresía"],
      ["afiliarse", "Afiliarse en línea"],
      ["contactar", "Escribir o llamar a la cámara"],
      ["evento", "Registrarse a un evento"],
      [OTRO, "Otro"]
    ),
    {
      required: true,
      hint: "Cuando alguien entra por primera vez al website, ¿qué es lo único que quieren que haga antes de irse? Marquen una sola opción.",
    }
  ),
  shortQ("q1-accion-otro", "Especifica esa acción", {
    hint: "Elegiste «Otro» en la pregunta anterior.",
    showIf: (a) => a["q1-accion"] === OTRO,
    placeholder: "Escríbelo en pocas palabras",
  }),

  // 2. El beneficio que convence
  longQ("q2-beneficio", "El beneficio que convence", {
    required: true,
    hint: "En una frase: ¿por qué alguien pagaría la membresía? No la lista completa de beneficios, sino el argumento que más funciona cuando lo cuentan en persona.",
  }),

  // 3. Las 6 cosas que sí importan (el orden de los clics es la prioridad)
  {
    id: "q3-secciones",
    block: "A",
    type: "multiChoice",
    title: "Las 6 cosas que sí importan",
    hint: "De todo lo que hoy tiene el website, elijan las 6 secciones que de verdad acercan a un nuevo miembro. El orden en que las marquen es el orden de importancia: el primer clic es la número 1. Lo que quede fuera no desaparece, pero pasa a segundo plano.",
    required: true,
    schema: z
      .array(
        z.enum([
          "noticias",
          "blog",
          "ventas",
          "rentas",
          "eventos",
          "directorio",
          "afiliacion",
          OTRO,
        ])
      )
      .min(6, "Son 6. Si todo importa, nada importa.")
      .max(6, "Son 6. Si todo importa, nada importa."),
    options: opts(
      ["noticias", "Noticias"],
      ["blog", "Blog"],
      ["ventas", "Ventas"],
      ["rentas", "Rentas"],
      ["eventos", "Eventos"],
      ["directorio", "Directorio de afiliados"],
      ["afiliacion", "Afiliación en línea"],
      [OTRO, "Otra sección"]
    ),
    minSelected: 6,
    maxSelected: 6,
    ordered: true,
  },
  shortQ("q3-secciones-otro", "Especifica esa otra sección", {
    hint: "Marcaste «Otra sección» en la pregunta anterior.",
    showIf: (a) =>
      Array.isArray(a["q3-secciones"]) && (a["q3-secciones"] as string[]).includes(OTRO),
    placeholder: "Escríbelo en pocas palabras",
  }),

  // 4. Las 6 piezas fijas de la página de inicio
  longQ("q4-piezas-inicio", "Las 6 piezas fijas de la página de inicio", {
    required: true,
    hint: "¿Qué 6 elementos tienen que estar siempre presentes en la página de inicio? Pueden coincidir o no con la lista anterior. Una por línea. Si mandan 8, trabajamos con las primeras 6.",
  }),

  // 5. Lo que se va
  longQ("q5-eliminar", "Lo que se va", {
    required: true,
    hint: "Nombren al menos 2 cosas del website actual que se pueden eliminar o esconder sin que nadie las extrañe. Una por línea.",
    schema: minLines(2, "Nombren al menos 2 cosas, una por línea."),
  }),

  // 6. Una referencia
  longQ("q6-referencia", "Una referencia", {
    required: true,
    hint: "Un website de otra cámara de comercio, o de cualquier organización, que les guste. El enlace y una línea explicando qué les gusta de ese sitio.",
  }),

  // 7. La última palabra
  shortQ("q7-aprobacion", "La última palabra", {
    required: true,
    hint: "¿Quién aprueba en nombre de la cámara? Un solo nombre y un correo. Cuando aprueban cinco personas, los proyectos se vuelven eternos.",
    placeholder: "Nombre y correo",
  }),

  // 8. Accesos de administración
  choice(
    "q8-accesos",
    "¿Cuántas personas necesitan acceso para administrar el website?",
    opts(
      ["una", "Una"],
      ["dos-tres", "Dos o tres"],
      ["cuatro-cinco", "Cuatro o cinco"],
      ["mas-cinco", "Más de cinco"]
    ),
    { required: true, hint: "Personas que publican o editan contenido, no visitantes." }
  ),

  // 9. Funciones que hoy no tienen
  longQ("q9-funciones-nuevas", "Funciones que hoy no tienen y quieren tener", {
    hint: "Cosas que el website actual no permite hacer y el nuevo sí debería.",
  }),

  // 10. Autoservicio
  longQ("q10-autoservicio", "Lo que cualquiera debería poder hacer solo", {
    hint: "Algo que hoy se resuelve llamando o escribiendo a la cámara, y que en el nuevo website cualquier persona debería poder hacer por sí sola.",
  }),
] as const;

// ── Invariantes: fallan el build si la configuración pierde coherencia ───────
const ids = QUESTIONS.map((q) => q.id);
if (new Set(ids).size !== ids.length) {
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  throw new Error(`questions.ts: id duplicado "${dup}", los ids son claves de jsonb.`);
}

/**
 * Las obligatorias, enumeradas. Una lista explícita, en vez de un contador,
 * hace que marcar o desmarcar `required` por accidente rompa el build diciendo
 * exactamente cuál cambió.
 */
const REQUIRED_IDS: readonly string[] = [
  "q1-accion",
  "q2-beneficio",
  "q3-secciones",
  "q4-piezas-inicio",
  "q5-eliminar",
  "q6-referencia",
  "q7-aprobacion",
  "q8-accesos",
];

const actualRequired = QUESTIONS.filter((q) => q.type !== "statement" && q.required).map(
  (q) => q.id
);
const deMas = actualRequired.filter((id) => !REQUIRED_IDS.includes(id));
const deMenos = REQUIRED_IDS.filter((id) => !actualRequired.includes(id));
if (deMas.length > 0 || deMenos.length > 0) {
  throw new Error(
    "questions.ts: la lista de preguntas obligatorias no coincide." +
      (deMas.length ? ` Marcadas de más: ${deMas.join(", ")}.` : "") +
      (deMenos.length ? ` Marcadas de menos: ${deMenos.join(", ")}.` : "")
  );
}

/** Cada campo "-otro" debe colgar de una pregunta que exista. */
for (const q of QUESTIONS) {
  if (q.id.endsWith("-otro") && !ids.includes(q.id.slice(0, -"-otro".length))) {
    throw new Error(`questions.ts: "${q.id}" no tiene pregunta base.`);
  }
}

/** Regla del cliente: nada de rayas ni guiones medios en el texto visible. */
for (const q of QUESTIONS) {
  const visibleText = [q.title, q.hint ?? ""].join(" ");
  if (/[—–]/.test(visibleText)) {
    throw new Error(`questions.ts: "${q.id}" usa raya o guion medio en texto visible.`);
  }
}
