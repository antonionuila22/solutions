import { z } from "zod";
import type { AnswerMap, ChoiceOption, Question } from "../types";
import { getBlock } from "./blocks";
import {
  ACCESS_ITEMS,
  ACCESS_ITEM_IDS,
  AVAILABILITY_OPTIONS,
  AVAILABILITY_VALUES,
  MODULE_IDS,
  PRIORITY_LEVELS,
} from "./modules";

/**
 * FUENTE ÚNICA de las preguntas del brief de descubrimiento de Codebrand.
 *
 * Origen y dos decisiones de producto que lo alejan del documento original:
 *
 *  1. GENÉRICO. El documento se escribió para una cámara de comercio y hablaba
 *     de "afiliados" y "la Cámara". Aquí se habla de "clientes, miembros o
 *     usuarios" y de "la organización": el mismo brief sirve para una empresa,
 *     una gremial, una institución o un profesional independiente.
 *
 *  2. RESPUESTAS PREHECHAS. Donde el documento dejaba un recuadro en blanco,
 *     aquí hay opciones cerradas con lo que de verdad necesitamos saber para
 *     cotizar. Un brief de 45 recuadros vacíos se abandona; uno de opciones se
 *     completa. Queda texto libre solo donde la respuesta es realmente abierta
 *     (benchmark, comentarios) y detrás de cada "Otro" aparece un campo para
 *     precisar.
 *
 * Reglas del proyecto:
 *  - Agregar, quitar o reordenar preguntas = editar SOLO este archivo.
 *  - Cada pregunta declara su Zod aquí; cliente y Astro Action usan la misma.
 *  - Los ids son claves del jsonb: NUNCA se renombran con datos ya guardados.
 *
 * Adaptaciones estructurales conservadas del documento:
 *  - P17 se divide en gate sí/no + pasarela condicional (ambas indispensables).
 *  - P27 es sí/no para poder condicionar la pregunta de identidad de marca.
 *  - El Bloque I lleva un gate que materializa la instrucción literal
 *    "Completar solo si el proyecto incluye el frente de redes sociales".
 *  - "Fecha de llenado" la registra el sistema (created_at); la "Confirmación
 *    de entrega" la sustituye la pantalla de resumen y envío.
 */

// ── Schemas reutilizables ────────────────────────────────────────────────────
const requiredText = z
  .string()
  .trim()
  .min(1, "Esta respuesta es indispensable para poder cotizar.");
const optionalText = z.string().trim().optional().or(z.literal(""));
const requiredEmail = z.email("Escribe un correo válido.");

const LEVEL_VALUES = PRIORITY_LEVELS.map((l) => l.value) as [string, ...string[]];

// Zod 4: z.record con claves enum es EXHAUSTIVO (exige todas las claves).
// El autosave guarda estados parciales, así que la regla por-pregunta es
// partialRecord; la exhaustividad de la matriz la exige el motor en el envío.
const priorityMatrixSchema = z.partialRecord(
  z.enum(MODULE_IDS as [string, ...string[]]),
  z.enum(LEVEL_VALUES)
);

const accessChecklistSchema = z.partialRecord(
  z.enum(ACCESS_ITEM_IDS as [string, ...string[]]),
  z.object({
    disponible: z.enum(AVAILABILITY_VALUES as [string, ...string[]]),
    responsable: z.string().trim(),
  })
);

const YES = "si";
const NO = "no";
const OTRO = "otro";
const NO_SABEMOS = "no-sabemos";
const POR_DEFINIR = "por-definir";

const yesNoOptions: ChoiceOption[] = [
  { value: YES, label: "Sí" },
  { value: NO, label: "No" },
];

// ── Constructores ────────────────────────────────────────────────────────────
type Opts = { hint?: string; required?: boolean; showIf?: (a: AnswerMap) => boolean };

/** Pares [valor, etiqueta] → opciones. Explícito: el valor es clave de jsonb. */
const opts = (...pairs: readonly (readonly [string, string])[]): ChoiceOption[] =>
  pairs.map(([value, label]) => ({ value, label }));

const enumOf = (options: readonly ChoiceOption[]) =>
  z.enum(options.map((o) => o.value) as [string, ...string[]]);

const statement = (
  id: string,
  block: Question["block"],
  title: string,
  hint?: string
): Question => ({
  id,
  block,
  type: "statement",
  title,
  hint,
  // Los minutos salen de blocks.ts, donde se garantiza que sumen 45.
  estimatedMinutes: getBlock(block).estimatedMinutes,
  ctaLabel: "Continuar",
});

const choice = (
  id: string,
  block: Question["block"],
  title: string,
  options: readonly ChoiceOption[],
  o: Opts = {}
): Question => ({
  id,
  block,
  type: "singleChoice",
  title,
  hint: o.hint,
  required: o.required ?? false,
  schema: o.required ? enumOf(options) : enumOf(options).optional(),
  showIf: o.showIf,
  options,
});

const multi = (
  id: string,
  block: Question["block"],
  title: string,
  options: readonly ChoiceOption[],
  o: Opts & { max?: number } = {}
): Question => ({
  id,
  block,
  type: "multiChoice",
  title,
  hint: o.hint,
  required: o.required ?? false,
  schema: z
    .array(enumOf(options))
    .min(o.required ? 1 : 0, "Elige al menos una opción.")
    .max(o.max ?? options.length, `Elige como máximo ${o.max ?? options.length}.`),
  showIf: o.showIf,
  options,
  minSelected: o.required ? 1 : 0,
  maxSelected: o.max,
});

const shortQ = (
  id: string,
  block: Question["block"],
  title: string,
  o: Opts & { placeholder?: string } = {}
): Question => ({
  id,
  block,
  type: "shortText",
  title,
  hint: o.hint,
  required: o.required ?? false,
  schema: o.required ? requiredText : optionalText,
  showIf: o.showIf,
  placeholder: o.placeholder,
});

const longQ = (id: string, block: Question["block"], title: string, o: Opts = {}): Question => ({
  id,
  block,
  type: "longText",
  title,
  hint: o.hint,
  required: o.required ?? false,
  schema: o.required ? requiredText : optionalText,
  showIf: o.showIf,
});

/**
 * Pregunta de opciones + campo para precisar cuando se elige "Otro". Se emiten
 * DOS preguntas encadenadas en vez de inventar un tipo nuevo: el motor de
 * condicionales ya sabe mostrar y ocultar, y el valor guardado sigue siendo un
 * string limpio — nada de objetos mezclados dentro del jsonb.
 */
const withOther = (base: Question, title: string): Question[] => {
  const eligioOtro = (a: AnswerMap) => {
    const v = a[base.id];
    return Array.isArray(v) ? v.includes(OTRO) : v === OTRO;
  };
  return [
    base,
    shortQ(`${base.id}-otro`, base.block, title, {
      // El título nunca repite el de la pregunta base: al ocupar toda la
      // pantalla, un título idéntico parece la misma pregunta otra vez.
      hint: "Elegiste «Otro» en la pregunta anterior.",
      showIf: (a) => eligioOtro(a) && (base.showIf ? base.showIf(a) : true),
      placeholder: "Escríbelo en pocas palabras",
    }),
  ];
};

// ── Condicionales ────────────────────────────────────────────────────────────
const requiereCobroEnLinea = (a: AnswerMap) => a["d-17-cobro-en-linea"] === YES;
const sinManualDeMarca = (a: AnswerMap) => a["f-27-manual-de-marca"] === NO;
const incluyeRedes = (a: AnswerMap) => a["i-incluye-redes"] === YES;

// ── Preguntas ────────────────────────────────────────────────────────────────
export const QUESTIONS: readonly Question[] = [
  // ═══ Portada y datos de contacto ═══
  statement(
    "p-intro",
    "P",
    "Formulario de descubrimiento",
    "Con estas respuestas definimos el alcance, el plan de trabajo y la inversión del proyecto. Casi todo se responde eligiendo una opción. Si algo no aplica o todavía no se sabe, elige «no lo sabemos» o «por definir»: es preferible a dejarlo en blanco. Se puede completar entre varias personas — comparte el enlace y el avance se guarda solo."
  ),
  shortQ("p-nombre", "P", "Nombre completo", { required: true }),
  shortQ("p-cargo", "P", "Cargo", { required: true }),
  {
    id: "p-correo",
    block: "P",
    type: "email",
    title: "Correo electrónico",
    required: true,
    schema: requiredEmail,
  },
  shortQ("p-telefono", "P", "Teléfono o WhatsApp", { placeholder: "+504 0000 0000" }),
  shortQ("p-otras-personas", "P", "Otras personas que aportaron respuestas", {
    hint: "Opcional. Nombres separados por coma.",
  }),

  // ═══ Bloque A · Negocio y organización ═══
  statement("a-intro", "A", "Bloque A. Negocio y organización"),
  ...withOther(
    choice(
      "a-0-tipo-organizacion",
      "A",
      "¿Qué tipo de organización son?",
      opts(
        ["empresa", "Empresa privada"],
        ["gremial", "Gremial, cámara o asociación"],
        ["institucion", "Institución pública"],
        ["ong", "ONG o fundación"],
        ["profesional", "Profesional independiente o consultora"],
        [OTRO, "Otro"]
      )
    ),
    "Especifica el tipo de organización"
  ),
  ...withOther(
    choice(
      "a-1-objetivo",
      "A",
      "Si el rediseño solo pudiera cumplir un objetivo, ¿cuál sería?",
      opts(
        ["captar", "Captar clientes o miembros nuevos"],
        ["retener", "Retener y dar mejor servicio a los actuales"],
        ["imagen", "Proyectar imagen institucional"],
        ["operativa", "Reducir carga operativa con autoservicio"],
        ["vender", "Vender en línea"],
        ["posicionar", "Posicionarse en Google"],
        [OTRO, "Otro"]
      ),
      { required: true, hint: "Elige el que más pesa. El resto se atiende, pero este manda." }
    ),
    "Especifica el objetivo"
  ),
  choice(
    "a-2-base-actual",
    "A",
    "¿Cuántos clientes, miembros o usuarios activos tienen hoy?",
    opts(
      ["menos-50", "Menos de 50"],
      ["50-250", "Entre 50 y 250"],
      ["251-1000", "Entre 251 y 1.000"],
      ["1001-5000", "Entre 1.001 y 5.000"],
      ["mas-5000", "Más de 5.000"],
      [NO_SABEMOS, "No lo sabemos con precisión"]
    ),
    { required: true }
  ),
  choice(
    "a-3-meta",
    "A",
    "¿Qué meta de crecimiento tienen para los próximos 12 meses?",
    opts(
      ["mantener", "Mantener la base actual"],
      ["10", "Crecer alrededor de un 10%"],
      ["25", "Crecer alrededor de un 25%"],
      ["50", "Crecer alrededor de un 50%"],
      ["duplicar", "Duplicar o más"],
      [POR_DEFINIR, "Aún no está definida"]
    )
  ),
  ...withOther(
    multi(
      "a-4-ingresos",
      "A",
      "¿De dónde vienen los ingresos de la organización?",
      opts(
        ["productos", "Venta de productos"],
        ["servicios", "Servicios profesionales"],
        ["cuotas", "Cuotas o membresías"],
        ["eventos", "Eventos y capacitaciones"],
        ["certificaciones", "Certificaciones o trámites"],
        ["publicidad", "Publicidad o patrocinios"],
        ["alquiler", "Alquiler de espacios"],
        ["fondos", "Fondos públicos o donaciones"],
        [OTRO, "Otro"]
      ),
      { hint: "Marca todas las que apliquen." }
    ),
    "Especifica la otra fuente de ingreso"
  ),
  longQ(
    "a-5-benchmark",
    "A",
    "¿Qué hacen otras organizaciones de su sector que ustedes quieran igualar o superar?",
    { hint: "Opcional, pero muy útil: con nombres o enlaces basta." }
  ),
  ...withOther(
    multi(
      "a-6-condicionantes",
      "A",
      "¿Hay alguna decisión o evento institucional que condicione el proyecto?",
      opts(
        ["cambio-direccion", "Cambio de junta directiva o dirección"],
        ["aniversario", "Aniversario"],
        ["cambio-marca", "Cambio de marca"],
        ["evento", "Congreso, feria o evento próximo"],
        ["apertura", "Apertura de nueva sede o línea de negocio"],
        ["ninguno", "Ninguno"],
        [OTRO, "Otro"]
      )
    ),
    "Especifica el condicionante"
  ),
  ...withOther(
    multi(
      "a-7-quejas",
      "A",
      "¿Qué les dicen hoy sobre el sitio actual?",
      opts(
        ["dificil", "Cuesta encontrar la información"],
        ["desactualizado", "Se ve desactualizado"],
        ["lento", "Va lento"],
        ["movil", "No funciona bien en celular"],
        ["confianza", "No transmite confianza"],
        ["incompleto", "Falta información importante"],
        ["sin-comentarios", "No recibimos comentarios"],
        [OTRO, "Otro"]
      )
    ),
    "Especifica la otra queja"
  ),

  // ═══ Bloque B · Audiencia ═══
  statement("b-intro", "B", "Bloque B. Audiencia"),
  choice(
    "b-8-composicion",
    "B",
    "¿Quién entra hoy al sitio?",
    opts(
      ["mayoria-actuales", "Sobre todo clientes o miembros actuales"],
      ["mayoria-nuevos", "Sobre todo público nuevo"],
      ["mitad", "Mitad y mitad"],
      ["analitica", "No lo sabemos, pero podemos dar acceso a la analítica"],
      ["sin-analitica", "No lo sabemos y no tenemos analítica"]
    )
  ),
  multi(
    "b-9-tareas",
    "B",
    "¿Qué es lo que más intenta resolver alguien al entrar al sitio?",
    opts(
      ["conocer", "Conocer los productos o servicios"],
      ["contactar", "Contactar o pedir una cotización"],
      ["directorio", "Buscar en un directorio o listado"],
      ["eventos", "Ver eventos e inscribirse"],
      ["descargar", "Descargar documentos"],
      ["tramite", "Hacer un trámite o un pago"],
      ["noticias", "Consultar noticias"],
      ["empleo", "Buscar empleo"],
      ["area-privada", "Entrar a un área privada"]
    ),
    { required: true, max: 3, hint: "Elige hasta tres. Estas mandan sobre la página de inicio." }
  ),
  ...withOther(
    multi(
      "b-10-consultas",
      "B",
      "¿Qué consultas llegan más por teléfono o WhatsApp y podrían resolverse en el sitio?",
      opts(
        ["precios", "Precios"],
        ["disponibilidad", "Disponibilidad o existencias"],
        ["como-registrarse", "Cómo registrarse o afiliarse"],
        ["estado-tramite", "Estado de un trámite"],
        ["horarios", "Horarios y ubicación"],
        ["soporte", "Soporte técnico"],
        ["facturacion", "Facturación"],
        [OTRO, "Otro"]
      )
    ),
    "Especifica la otra consulta"
  ),
  choice(
    "b-11-dispositivo",
    "B",
    "¿Desde dónde entra la audiencia?",
    opts(
      ["celular", "Sobre todo desde celular"],
      ["computadora", "Sobre todo desde computadora"],
      ["equilibrado", "Está equilibrado"],
      [NO_SABEMOS, "No lo sabemos"]
    )
  ),
  ...withOther(
    choice(
      "b-12-idiomas",
      "B",
      "¿El sitio necesita más de un idioma?",
      opts(
        ["solo-espanol", "No, solo español"],
        ["ingles-todo", "Sí, español e inglés en todo el sitio"],
        ["ingles-parcial", "Sí, inglés solo en secciones institucionales"],
        [OTRO, "Sí, otro idioma"]
      )
    ),
    "Especifica el idioma"
  ),

  // ═══ Bloque C · Contenido ═══
  statement("c-intro", "C", "Bloque C. Contenido"),
  choice(
    "c-13-produccion",
    "C",
    "¿Quién produce el contenido?",
    opts(
      ["equipo-interno", "Un equipo interno de comunicación"],
      ["una-persona", "Una persona, a tiempo parcial"],
      ["agencia", "Una agencia externa"],
      ["nadie", "Nadie fijo, se hace cuando se puede"],
      ["codebrand", "Queremos que lo produzca Codebrand"]
    ),
    { required: true }
  ),
  choice(
    "c-14-frecuencia",
    "C",
    "¿Con qué frecuencia se publica contenido nuevo?",
    opts(
      ["diario", "Diario"],
      ["semanal", "Semanal"],
      ["mensual", "Mensual"],
      ["esporadico", "Esporádico"],
      ["nunca", "No publicamos"]
    )
  ),
  choice(
    "c-15-migracion",
    "C",
    "¿Qué se hace con el contenido que ya existe?",
    opts(
      ["todo", "Migrar todo"],
      ["reciente", "Migrar solo lo de los últimos años"],
      ["esencial", "Migrar solo lo esencial"],
      ["cero", "Empezar de cero"],
      [POR_DEFINIR, "Por definir"]
    )
  ),
  ...withOther(
    choice(
      "c-16-bd-contactos",
      "C",
      "¿En qué formato está hoy la base de datos de clientes o miembros?",
      opts(
        ["excel", "Excel o Google Sheets"],
        ["sistema-propio", "Un sistema administrativo propio"],
        ["cms", "Dentro del mismo sitio web"],
        ["crm", "Un CRM (HubSpot, Zoho, Salesforce…)"],
        ["papel", "En papel o sin base de datos"],
        [OTRO, "Otro"]
      ),
      { required: true, hint: "De esto depende cuánto trabajo de migración lleva el proyecto." }
    ),
    "Especifica el formato de la base de datos"
  ),
  multi(
    "c-17-descargables",
    "C",
    "¿Qué documentos descargables deben quedar accesibles?",
    opts(
      ["catalogos", "Catálogos o tarifarios"],
      ["legales", "Estatutos o documentos legales"],
      ["memorias", "Memorias o reportes anuales"],
      ["boletines", "Boletines"],
      ["formularios", "Formularios"],
      ["manuales", "Manuales o guías"],
      ["ninguno", "Ninguno"]
    )
  ),
  multi(
    "c-18-roles",
    "C",
    "¿Qué niveles de acceso se necesitan para publicar?",
    opts(
      ["admin", "Administrador"],
      ["editor", "Editor"],
      ["revisor", "Revisor o aprobador"],
      ["comunicacion", "Comunicación o marketing"],
      ["solo-uno", "Con una sola persona basta"]
    )
  ),

  // ═══ Bloque D · Funcionalidad ═══
  statement("d-intro", "D", "Bloque D. Funcionalidad"),
  {
    id: "d-matriz-modulos",
    block: "D",
    type: "priorityMatrix",
    title: "Marca la prioridad de cada módulo",
    hint: "Esta tabla define directamente el alcance y el costo del proyecto.",
    required: true,
    schema: priorityMatrixSchema,
    moduleIds: MODULE_IDS,
    levels: PRIORITY_LEVELS,
  },
  choice("d-17-cobro-en-linea", "D", "¿Se requiere cobro en línea?", yesNoOptions, {
    required: true,
  }),
  // El asterisco del documento cubre la P17 completa: si hay cobro en línea, la
  // pasarela es dato indispensable para cotizar. Solo se muestra con showIf, así
  // que no bloquea a quien responde "no".
  ...withOther(
    choice(
      "d-17b-pasarela",
      "D",
      "¿Con qué banco o pasarela quieren cobrar?",
      opts(
        ["atlantida", "Banco Atlántida"],
        ["bac", "BAC Credomatic"],
        ["ficohsa", "Banco Ficohsa"],
        ["paypal", "PayPal"],
        ["stripe", "Stripe"],
        [POR_DEFINIR, "Aún no está definido, necesitamos recomendación"],
        [OTRO, "Otro"]
      ),
      { required: true, showIf: requiereCobroEnLinea }
    ),
    "Especifica el banco o la pasarela"
  ),
  choice(
    "d-18-sistema-interno",
    "D",
    "¿Existe un sistema administrativo o contable con el que el sitio deba comunicarse?",
    opts(
      ["no", "No existe"],
      ["si-api", "Sí, y tiene API"],
      ["si-exportacion", "Sí, pero solo permite exportar datos"],
      ["si-cerrado", "Sí, y está cerrado: no se puede integrar"],
      [NO_SABEMOS, "No lo sabemos"]
    ),
    { required: true }
  ),
  shortQ("d-18b-sistema-nombre", "D", "¿Cómo se llama ese sistema?", {
    showIf: (a) =>
      ["si-api", "si-exportacion", "si-cerrado"].includes(String(a["d-18-sistema-interno"] ?? "")),
    placeholder: "Nombre del sistema",
  }),
  ...withOther(
    multi(
      "d-19-crm",
      "D",
      "¿Usan CRM o herramienta de correo masivo?",
      opts(
        ["ninguno", "Ninguno"],
        ["mailchimp", "Mailchimp"],
        ["hubspot", "HubSpot"],
        ["zoho", "Zoho"],
        ["salesforce", "Salesforce"],
        ["brevo", "Brevo (Sendinblue)"],
        [OTRO, "Otro"]
      )
    ),
    "Especifica la herramienta"
  ),
  longQ("d-20-otros-modulos", "D", "¿Algún otro módulo que no esté en la tabla anterior?", {
    hint: "Opcional. Descríbelo con tus palabras.",
  }),

  // ═══ Bloque E · Técnico y accesos ═══
  statement("e-intro", "E", "Bloque E. Técnico y accesos"),
  choice(
    "e-21-administracion",
    "E",
    "¿Quién administra hoy el hosting, el dominio y el correo?",
    opts(
      ["ti-interno", "Un equipo interno de TI"],
      ["proveedor", "Un proveedor externo actual"],
      ["agencia-anterior", "La agencia que hizo el sitio"],
      ["persona-que-salio", "Una persona que ya no está en la organización"],
      [NO_SABEMOS, "No lo sabemos"]
    ),
    { required: true }
  ),
  choice(
    "e-22-politica-hosting",
    "E",
    "¿Existe alguna política que obligue a alojar el sitio en un lugar específico?",
    opts(
      ["no", "No, podemos elegir"],
      ["proveedor-actual", "Sí, debe quedarse con el proveedor actual"],
      ["en-pais", "Sí, debe estar alojado en el país"],
      [POR_DEFINIR, "Por confirmar"]
    )
  ),
  multi(
    "e-23-licencias",
    "E",
    "¿Qué licencias o servicios de pago están vigentes hoy?",
    opts(
      ["tema", "Tema premium"],
      ["plugins", "Plugins de pago"],
      ["hosting", "Hosting anual"],
      ["ssl", "Certificado SSL"],
      ["correo", "Correo corporativo"],
      ["ninguna", "Ninguna"],
      [NO_SABEMOS, "No lo sabemos"]
    )
  ),
  multi(
    "e-24-salud-sitio",
    "E",
    "¿Con qué cuenta hoy el sitio?",
    opts(
      ["ssl", "Certificado SSL"],
      ["respaldos", "Respaldos automáticos"],
      ["monitoreo", "Monitoreo de caídas"],
      ["ninguno", "Ninguno de los anteriores"],
      [NO_SABEMOS, "No lo sabemos"]
    )
  ),
  choice(
    "e-25-incidentes",
    "E",
    "¿Ha habido incidentes de seguridad, caídas o intentos de intrusión?",
    opts(
      ["no", "No"],
      ["hackeo", "Sí, el sitio fue comprometido"],
      ["caidas", "Sí, caídas frecuentes"],
      ["intentos", "Sí, intentos de intrusión"],
      [NO_SABEMOS, "No lo sabemos"]
    ),
    { required: true }
  ),
  multi(
    "e-26-analitica",
    "E",
    "¿Qué herramientas de medición están instaladas?",
    opts(
      ["ga4", "Google Analytics"],
      ["search-console", "Google Search Console"],
      ["tag-manager", "Google Tag Manager"],
      ["meta-pixel", "Meta Pixel"],
      ["ninguna", "Ninguna"],
      [NO_SABEMOS, "No lo sabemos"]
    )
  ),
  {
    id: "e-checklist-accesos",
    block: "E",
    type: "accessChecklist",
    title: "Checklist de accesos requeridos",
    hint: "Para cada acceso, indica si está disponible y quién es el responsable.",
    required: false,
    schema: accessChecklistSchema,
    items: ACCESS_ITEMS,
    availabilityOptions: AVAILABILITY_OPTIONS,
  },

  // ═══ Bloque F · Marca y diseño ═══
  statement("f-intro", "F", "Bloque F. Marca y diseño"),
  choice(
    "f-27-manual-de-marca",
    "F",
    "¿Existe manual de marca vigente con logotipo vectorial, paleta y tipografías?",
    yesNoOptions,
    { required: true }
  ),
  // PREGUNTA AÑADIDA (no está en el documento): la exige la condicional del
  // proyecto — si no hay manual de marca, se ofrece construir la identidad.
  choice(
    "f-27b-construccion-identidad",
    "F",
    "¿Quieren incluir la construcción de identidad de marca dentro del proyecto?",
    opts(
      [YES, "Sí, constrúyanla con nosotros"],
      ["parcial", "Solo lo mínimo para que el sitio se vea coherente"],
      [NO, "No, usaremos lo que tenemos"]
    ),
    { showIf: sinManualDeMarca }
  ),
  choice(
    "f-28-identidad",
    "F",
    "¿Qué pasa con la identidad visual actual?",
    opts(
      ["conservar", "Se conserva tal cual"],
      ["modernizar", "Se moderniza manteniendo la esencia"],
      ["rediseno", "Se rediseña por completo"],
      [POR_DEFINIR, "Aún no está decidido"]
    )
  ),
  multi(
    "f-29-tono",
    "F",
    "¿Qué tono debe proyectar el sitio?",
    opts(
      ["institucional", "Institucional y formal"],
      ["cercano", "Cercano y accionable"],
      ["tecnico", "Moderno y técnico"],
      ["premium", "Premium y sobrio"],
      ["joven", "Joven y dinámico"]
    ),
    { max: 2, hint: "Elige hasta dos. Más de dos deja de ser un tono." }
  ),
  choice(
    "f-30-fotografia",
    "F",
    "¿Hay fotografía propia de instalaciones, equipo o producto?",
    opts(
      ["banco-propio", "Sí, tenemos banco propio y actualizado"],
      ["parcial", "Hay algo, pero falta completar"],
      ["producir", "No, hay que producirla"],
      ["stock", "Usaremos banco de imágenes"]
    )
  ),
  multi(
    "f-31-obligatorios",
    "F",
    "¿Hay elementos de uso obligatorio en el sitio?",
    opts(
      ["sellos", "Sellos o certificaciones"],
      ["afiliaciones", "Logos de afiliaciones o alianzas"],
      ["patrocinadores", "Patrocinadores"],
      ["institucionales", "Escudos o marcas institucionales"],
      ["ninguno", "Ninguno"]
    )
  ),
  {
    id: "f-32-referencias-web",
    block: "F",
    type: "repeater",
    title: "Referencias web",
    hint: "Tres sitios que les gusten y uno que no. No necesitan ser del mismo rubro.",
    required: true,
    // La regla del documento se hace cumplir en el schema, no solo en el hint.
    schema: z
      .array(
        z.object({
          valoracion: z.enum(["me-gusta", "a-evitar"]),
          sitio: z.string().trim().min(1, "Indica el sitio o URL."),
          comentario: z.string().trim(),
        })
      )
      .refine(
        (rows) =>
          rows.filter((r) => r.valoracion === "me-gusta").length >= 3 &&
          rows.filter((r) => r.valoracion === "a-evitar").length >= 1,
        "Indica al menos tres sitios que les gusten y uno a evitar."
      ),
    fields: [
      {
        key: "valoracion",
        label: "Valoración",
        options: [
          { value: "me-gusta", label: "Me gusta" },
          { value: "a-evitar", label: "A evitar" },
        ],
      },
      { key: "sitio", label: "Sitio o URL", placeholder: "https://…" },
      {
        key: "comentario",
        label: "Qué les gusta / qué no les gusta",
        placeholder: "Qué destacan o qué quieren evitar de este sitio.",
        multiline: true,
      },
    ],
    minRows: 4,
    maxRows: 6,
    addRowLabel: "Agregar otra referencia",
  },

  // ═══ Bloque G · Medición de resultados ═══
  statement("g-intro", "G", "Bloque G. Medición de resultados"),
  ...withOther(
    choice(
      "g-33-indicador",
      "G",
      "Dentro de seis meses, ¿qué indicador dirá si el proyecto fue un éxito?",
      opts(
        ["contactos", "Solicitudes de contacto o cotización"],
        ["ventas", "Ventas en línea"],
        ["registros", "Nuevos registros, clientes o afiliaciones"],
        ["inscripciones", "Inscripciones a eventos"],
        ["trafico", "Visitas y posicionamiento en Google"],
        ["menos-consultas", "Menos llamadas y consultas repetidas"],
        [OTRO, "Otro"]
      ),
      { required: true }
    ),
    "Especifica el indicador"
  ),
  choice(
    "g-34-reportes",
    "G",
    "¿Con qué periodicidad se reportan resultados digitales a la dirección?",
    opts(
      ["no-se-reporta", "No se reportan"],
      ["mensual", "Mensual"],
      ["trimestral", "Trimestral"],
      ["semestral", "Semestral"],
      ["a-solicitud", "Solo cuando se solicita"]
    )
  ),

  // ═══ Bloque H · Proceso, plazos y presupuesto ═══
  statement("h-intro", "H", "Bloque H. Proceso, plazos y presupuesto"),
  shortQ("h-35-responsable", "H", "¿Quién es el responsable directo del proyecto?", {
    hint: "Nombre y cargo. Es determinante que haya un solo interlocutor con capacidad de decisión.",
    required: true,
  }),
  choice(
    "h-36-aprobacion",
    "H",
    "¿Quién da la aprobación final?",
    opts(
      ["responsable", "El mismo responsable del proyecto"],
      ["gerencia", "Gerencia o dirección"],
      ["junta", "Junta directiva"],
      ["comite", "Un comité"],
      ["casa-matriz", "Casa matriz"]
    )
  ),
  choice(
    "h-37-fecha-limite",
    "H",
    "¿Para cuándo necesitan el sitio en línea?",
    opts(
      ["sin-fecha", "No hay fecha límite"],
      ["1-mes", "En menos de 1 mes"],
      ["1-3-meses", "Entre 1 y 3 meses"],
      ["3-6-meses", "Entre 3 y 6 meses"],
      ["mas-6-meses", "Más de 6 meses"]
    ),
    { required: true }
  ),
  shortQ("h-37b-motivo-fecha", "H", "¿A qué evento o compromiso responde esa fecha?", {
    showIf: (a) =>
      ["1-mes", "1-3-meses", "3-6-meses"].includes(String(a["h-37-fecha-limite"] ?? "")),
    placeholder: "Congreso, aniversario, cierre fiscal…",
  }),
  choice(
    "h-38-presupuesto",
    "H",
    "¿Cuál es el rango de inversión aprobado para el proyecto?",
    opts(
      ["menos-2k", "Menos de US$ 2,000"],
      ["2k-5k", "US$ 2,000 – 5,000"],
      ["5k-10k", "US$ 5,000 – 10,000"],
      ["10k-25k", "US$ 10,000 – 25,000"],
      ["mas-25k", "Más de US$ 25,000"],
      [POR_DEFINIR, "Aún no está definido"]
    ),
    {
      required: true,
      hint: "El rango no compromete nada: sirve para proponer el alcance que cabe dentro.",
    }
  ),
  choice(
    "h-39-recurrente",
    "H",
    "¿Hay presupuesto recurrente para hosting, mantenimiento y soporte después del lanzamiento?",
    opts(
      [YES, "Sí, ya está contemplado"],
      ["falta-aprobar", "Sí, pero falta aprobarlo"],
      [NO, "No"],
      [POR_DEFINIR, "Por definir"]
    ),
    { required: true }
  ),
  choice(
    "h-40-carga-contenido",
    "H",
    "¿Quién carga y actualiza el contenido durante el proyecto?",
    opts(
      ["interno", "El equipo interno"],
      ["codebrand", "Codebrand"],
      ["ambos", "Entre ambos"],
      [POR_DEFINIR, "Por definir"]
    )
  ),

  // ═══ Bloque I · Redes sociales (condicionado) ═══
  statement(
    "i-intro",
    "I",
    "Bloque I. Redes sociales",
    "Completar solo si el proyecto incluye el frente de redes sociales."
  ),
  choice("i-incluye-redes", "I", "¿El proyecto incluye el frente de redes sociales?", yesNoOptions, {
    required: true,
  }),
  multi(
    "i-41-perfiles",
    "I",
    "¿Qué perfiles administra la organización?",
    opts(
      ["facebook", "Facebook"],
      ["instagram", "Instagram"],
      ["linkedin", "LinkedIn"],
      ["tiktok", "TikTok"],
      ["x", "X (Twitter)"],
      ["youtube", "YouTube"],
      ["whatsapp", "WhatsApp Business"],
      ["ninguno", "Ninguno todavía"]
    ),
    { showIf: incluyeRedes }
  ),
  choice(
    "i-42-frecuencia",
    "I",
    "¿Con qué frecuencia publican en redes?",
    opts(
      ["diaria", "Diaria"],
      ["varias-semana", "Varias veces por semana"],
      ["semanal", "Semanal"],
      ["esporadica", "Esporádica"],
      ["nunca", "No publicamos"]
    ),
    { showIf: incluyeRedes }
  ),
  choice(
    "i-43-linea-grafica",
    "I",
    "¿Existe línea gráfica definida para redes?",
    opts(
      ["documentada", "Sí, definida y documentada"],
      ["sin-documentar", "Existe, pero no está documentada"],
      ["por-pieza", "Cada pieza se diseña por separado"]
    ),
    { showIf: incluyeRedes }
  ),
  choice(
    "i-44-objetivo",
    "I",
    "¿Cuál es el objetivo principal en redes?",
    opts(
      ["posicionamiento", "Posicionamiento institucional"],
      ["captacion", "Captación de clientes o miembros"],
      ["eventos", "Difusión de eventos"],
      ["atencion", "Atención al cliente"],
      ["ventas", "Ventas directas"]
    ),
    { showIf: incluyeRedes }
  ),
  choice(
    "i-45-pauta",
    "I",
    "¿Cuánto invierten en pauta publicitaria al mes?",
    opts(
      ["nada", "No invertimos"],
      ["menos-200", "Menos de US$ 200"],
      ["200-500", "US$ 200 – 500"],
      ["500-1500", "US$ 500 – 1,500"],
      ["mas-1500", "Más de US$ 1,500"],
      [POR_DEFINIR, "Por definir"]
    ),
    { showIf: incluyeRedes }
  ),

  // ═══ Cierre ═══
  longQ("z-comentarios", "Z", "Comentarios adicionales", {
    hint: "Cualquier cosa relevante que no haya salido en las preguntas anteriores.",
  }),
] as const;

// ── Invariantes: fallan el build si la configuración pierde coherencia ───────
const ids = QUESTIONS.map((q) => q.id);
if (new Set(ids).size !== ids.length) {
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  throw new Error(`questions.ts: id duplicado "${dup}" — los ids son claves de jsonb.`);
}

/**
 * Las indispensables, enumeradas. Una lista explícita —en vez de un contador—
 * hace que marcar o desmarcar `required` por accidente rompa el build diciendo
 * exactamente cuál cambió.
 *
 * Son los 16 asteriscos del documento (P17 aporta dos: gate y pasarela), más
 * la matriz de módulos (define alcance y costo), los tres datos de contacto y
 * el gate del Bloque I.
 */
const REQUIRED_IDS: readonly string[] = [
  "p-nombre",
  "p-cargo",
  "p-correo",
  "a-1-objetivo",
  "a-2-base-actual",
  "b-9-tareas",
  "c-13-produccion",
  "c-16-bd-contactos",
  "d-matriz-modulos",
  "d-17-cobro-en-linea",
  "d-17b-pasarela",
  "d-18-sistema-interno",
  "e-21-administracion",
  "e-25-incidentes",
  "f-27-manual-de-marca",
  "f-32-referencias-web",
  "g-33-indicador",
  "h-35-responsable",
  "h-37-fecha-limite",
  "h-38-presupuesto",
  "h-39-recurrente",
  "i-incluye-redes",
];

const actualRequired = QUESTIONS.filter((q) => q.type !== "statement" && q.required).map(
  (q) => q.id
);
const deMas = actualRequired.filter((id) => !REQUIRED_IDS.includes(id));
const deMenos = REQUIRED_IDS.filter((id) => !actualRequired.includes(id));
if (deMas.length > 0 || deMenos.length > 0) {
  throw new Error(
    "questions.ts: la lista de preguntas indispensables no coincide." +
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
