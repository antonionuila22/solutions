/**
 * Single source of truth — Landing /landing/expo-producciones
 *
 * Catálogo completo de Servicios y Productos de Codebrand con PRECIO ("Desde $X"),
 * QUÉ INCLUYE y CÓMO TRABAJAMOS por cada servicio, + configuración del wizard
 * interactivo de cotización.
 *
 * Todos los componentes React de la landing (ServiceWizard, ServicesCatalog,
 * CodebrandSalesShowcase, ServiciosFaq, PricingProcess) importan sus datos desde
 * aquí. No dupliques contenido en los componentes.
 *
 * ⚠️ PRECIOS: los valores `priceFrom` son PLACEHOLDERS coherentes pendientes de
 * confirmación del cliente. Cambiarlos aquí actualiza toda la página.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DESIGN TOKENS (tema "dark premium" de marca) — usa clases Tailwind:
 *   - Fondo:      bg-[#0a0a0f] / slate-950, secciones #0d0d14
 *   - Superficie: bg-white/[0.03] + backdrop-blur + border-white/10 (glass)
 *   - Acento 1:   orange-500 (#f97316) / orange-600 (#ea580c)  ← CTA primario
 *   - Acento 2:   teal-400 (#2dd4bf) / cyan-500                ← checks, detalles
 *   - Texto:      white, white/70 (body), white/45 (muted)
 *   - Gradiente:  from-orange-400 via-orange-500 to-amber-400
 *   - Radio:      rounded-2xl tarjetas, rounded-xl inputs, rounded-full chips
 *   - Tipografía: font-poppins (cargada globalmente)
 *
 * ──────────────────────────────────────────────────────────────────────────
 * CONTRATO API /api/contact (POST FormData, mismo origen → pasa CSRF; 200 → /thank-you):
 *   name      req  2-60   letras (acentos OK), espacios, - '
 *   email     req  RFC
 *   phone     req  7-15 dígitos; chars \d \s - + ( )
 *   industry  req  ≤50   patrón SOLO [a-zA-Z\s\-&] → ¡SIN ACENTOS NI DÍGITOS!
 *   subject   req  3-100 (acentos OK)
 *   message   req  10-2000  SOLO letras/números/espacios y , . ! ? ; : ' " ( ) y saltos de línea.
 *             → NO uses viñetas •, ni & / @ # * [] = + en el message compuesto.
 *   services  opc  múltiples campos "services" (FormData.append repetido), c/u ≤50
 *   terms     checkbox requerido (úsalo en UI)
 *   honey     honeypot oculto (vacío)
 */

export type IconName =
  | "code"
  | "layers"
  | "workflow"
  | "crm"
  | "seo"
  | "brand"
  | "saas";

/**
 * Paths SVG (viewBox 0 0 24 24, stroke="currentColor", fill="none",
 * stroke-width 1.5). Úsalos en React vía dangerouslySetInnerHTML del <svg>
 * o copia el <path d="..."/>.
 */
export const ICON_PATHS: Record<IconName, string> = {
  code: "M10 8l-4 4 4 4m4-8l4 4-4 4M14.5 4l-5 16",
  layers: "M12 3l9 5-9 5-9-5 9-5zm9 9l-9 5-9-5m18 4l-9 5-9-5",
  workflow:
    "M5 7a2 2 0 100-4 2 2 0 000 4zm14 14a2 2 0 100-4 2 2 0 000 4zM5 5h8a4 4 0 014 4v6m-2-2l2 2 2-2",
  crm: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-7 4 4 0 004 7zm5-4a3 3 0 10-2-5",
  seo: "M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0zm-7-3v6m-3-3h6",
  brand:
    "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.34M11 7.34l1.66-1.66a2 2 0 012.82 0l2.83 2.83a2 2 0 010 2.82L11.66 19M7 17h.01",
  saas: "M9 17v-2a4 4 0 014-4h4m0 0l-3-3m3 3l-3 3M3 5h12a2 2 0 012 2v3M3 5v10a2 2 0 002 2h4M3 5l4 4",
};

export interface ServiceProcessStep {
  title: string;
  desc: string;
}

export interface ServiceItem {
  /** id estable, ASCII */
  id: string;
  /** etiqueta corta para chips del wizard (≤50, se envía a la API) */
  shortLabel: string;
  /** título mostrado en el catálogo */
  title: string;
  /** frase gancho de una línea */
  tagline: string;
  /** descripción del catálogo */
  description: string;
  /** precio "Desde $X" (PLACEHOLDER a confirmar) */
  priceFrom: string;
  /** unidad/nota del precio, ej. "proyecto", "/mes" */
  priceNote: string;
  /** stack / herramientas */
  tech: string[];
  /** QUÉ INCLUYE — entregables concretos */
  includes: string[];
  /** CÓMO TRABAJAMOS — 3 pasos específicos del servicio */
  process: ServiceProcessStep[];
  /** icono */
  icon: IconName;
  /** gradiente Tailwind del acento de la tarjeta */
  accent: string;
}

/** Catálogo completo de servicios de Codebrand. */
export const SERVICES: ServiceItem[] = [
  {
    id: "desarrollo-web-apps",
    shortLabel: "Desarrollo Web y Apps",
    title: "Desarrollo Web y Apps",
    tagline: "Sitios y apps rápidos, responsivos y listos para escalar.",
    description:
      "Sitios web ultrarrápidos optimizados para SEO y aplicaciones móviles nativas. Diseño UX/UI en Figma incluido en cada proyecto de frontend para garantizar la mejor experiencia de usuario.",
    priceFrom: "Desde $450",
    priceNote: "por proyecto",
    tech: ["React", "Next.js", "Astro", "Expo (iOS y Android)"],
    includes: [
      "Diseño UX/UI en Figma a la medida",
      "Desarrollo 100% responsivo y mobile-first",
      "Optimización de velocidad y Core Web Vitals",
      "SEO técnico base y metadatos",
      "Formularios de contacto y captación de leads",
      "Despliegue y dominio configurados",
    ],
    process: [
      { title: "Diseño en Figma", desc: "Prototipamos la interfaz y la validamos contigo antes de programar." },
      { title: "Desarrollo", desc: "Construimos con React, Next.js o Astro con entregas y revisiones por etapa." },
      { title: "Lanzamiento", desc: "Publicamos, medimos rendimiento y te entregamos todo listo." },
    ],
    icon: "code",
    accent: "from-orange-500 to-amber-500",
  },
  {
    id: "sistemas-a-medida",
    shortLabel: "Sistemas a Medida",
    title: "Creación de Sistemas a Medida",
    tagline: "Software, SaaS y dashboards hechos para tu operación.",
    description:
      "Desarrollo de software personalizado, plataformas SaaS, dashboards administrativos y sistemas internos robustos, estructurados específicamente para escalar la operación de tu negocio.",
    priceFrom: "Desde $2,500",
    priceNote: "por proyecto",
    tech: ["Next.js", "Node.js", "Supabase", "Turso"],
    includes: [
      "Análisis y arquitectura del sistema",
      "Plataforma SaaS o sistema interno a medida",
      "Dashboard administrativo y reportes",
      "Base de datos moderna y segura",
      "Roles, permisos y autenticación",
      "Documentación y soporte de lanzamiento",
    ],
    process: [
      { title: "Descubrimiento", desc: "Mapeamos tus procesos y definimos el alcance del sistema." },
      { title: "Construcción por módulos", desc: "Entregamos funcionalidades en ciclos cortos para que veas avances reales." },
      { title: "Escalamiento", desc: "Optimizamos, documentamos y dejamos el sistema listo para crecer." },
    ],
    icon: "layers",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: "automatizaciones-n8n",
    shortLabel: "Automatizaciones con n8n",
    title: "Automatizaciones con n8n",
    tagline: "Tus herramientas conectadas trabajando por ti 24/7.",
    description:
      "Optimización de tiempos y eliminación de tareas manuales conectando tus herramientas diarias. Creamos flujos de trabajo autónomos que integran tus sistemas y trabajan por ti 24/7.",
    priceFrom: "Desde $300",
    priceNote: "por flujo",
    tech: ["n8n", "APIs", "Webhooks", "Integraciones"],
    includes: [
      "Diagnóstico de tareas automatizables",
      "Diseño de flujos de trabajo a medida",
      "Integración entre tus herramientas actuales",
      "Notificaciones y alertas automáticas",
      "Pruebas y monitoreo del flujo",
      "Capacitación para tu equipo",
    ],
    process: [
      { title: "Auditoría", desc: "Identificamos las tareas manuales que más tiempo te quitan." },
      { title: "Automatización", desc: "Diseñamos y conectamos los flujos en n8n entre tus sistemas." },
      { title: "Optimización", desc: "Monitoreamos los flujos y los ajustamos para máxima eficiencia." },
    ],
    icon: "workflow",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "crm-setup",
    shortLabel: "Integracion de CRM",
    title: "Configuración e Integración de CRM",
    tagline: "Ordena tus prospectos y automatiza tu marketing.",
    description:
      "Estructuración de tus embudos de venta, automatización de marketing y orden de prospectos en las plataformas líderes del mercado.",
    priceFrom: "Desde $500",
    priceNote: "configuración",
    tech: ["GoHighLevel", "HubSpot", "Ecosistema Codebrand"],
    includes: [
      "Configuración completa de tu CRM",
      "Embudos de venta estructurados",
      "Automatización de marketing y seguimiento",
      "Importación y orden de prospectos",
      "Plantillas de correo y mensajes",
      "Capacitación de uso para tu equipo",
    ],
    process: [
      { title: "Estrategia", desc: "Definimos tus etapas de venta y el flujo ideal de prospectos." },
      { title: "Implementación", desc: "Configuramos la plataforma, automatizaciones e integraciones." },
      { title: "Adopción", desc: "Capacitamos a tu equipo para que el CRM se use desde el día uno." },
    ],
    icon: "crm",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    id: "seo-rendimiento",
    shortLabel: "SEO y Rendimiento",
    title: "Optimización SEO y Rendimiento",
    tagline: "Posiciónate más alto y carga más rápido en Google.",
    description:
      "Mejora tu visibilidad orgánica. Posiciónate más alto en Google mediante SEO técnico, optimización extrema de velocidad de carga (Core Web Vitals) y estrategia de contenido.",
    priceFrom: "Desde $350",
    priceNote: "/mes",
    tech: ["SEO técnico", "Core Web Vitals", "Estrategia de contenido"],
    includes: [
      "Auditoría SEO técnica completa",
      "Optimización de Core Web Vitals",
      "Investigación de palabras clave",
      "Optimización on-page y contenido",
      "Schema markup y datos estructurados",
      "Reporte mensual de resultados",
    ],
    process: [
      { title: "Auditoría", desc: "Analizamos tu sitio, tu competencia y tus oportunidades." },
      { title: "Optimización", desc: "Mejoramos velocidad, estructura y contenido para Google." },
      { title: "Crecimiento", desc: "Medimos posiciones y ajustamos la estrategia cada mes." },
    ],
    icon: "seo",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    id: "branding-diseno",
    shortLabel: "Branding y Diseno",
    title: "Branding, Diseño y Social Media",
    tagline: "Identidad, contenido y diseño que vende.",
    description:
      "Construimos tu marca de principio a fin: branding, diseño gráfico, packaging y gestión de redes sociales con contenido que conecta y convierte.",
    priceFrom: "Desde $400",
    priceNote: "por proyecto",
    tech: ["Branding", "Diseño Gráfico", "Packaging", "Social Media"],
    includes: [
      "Identidad de marca (logo, colores, tipografía)",
      "Manual de marca",
      "Diseño gráfico para impresos y digital",
      "Diseño de packaging",
      "Gestión y contenido para redes sociales",
      "Plantillas editables para tu equipo",
    ],
    process: [
      { title: "Inmersión", desc: "Conocemos tu negocio, tu público y tu competencia." },
      { title: "Creación", desc: "Diseñamos identidad, piezas y contenido alineados a tu marca." },
      { title: "Entrega", desc: "Te damos los archivos y plantillas listos para usar." },
    ],
    icon: "brand",
    accent: "from-pink-500 to-rose-500",
  },
];

/**
 * Producto propio (SaaS) — se muestra en CodebrandSalesShowcase y como opción
 * seleccionable en el wizard.
 */
export const CODEBRAND_SALES = {
  id: "codebrand-sales",
  name: "Codebrand Sales",
  badge: "Producto Propio · SaaS",
  tagline: "Nuestro CRM intuitivo para cerrar más tratos, sin complejidad.",
  description:
    "Nuestro propio CRM básico e intuitivo, diseñado para empresas que buscan ordenar sus ventas, gestionar prospectos y cerrar tratos sin la complejidad ni los altos costos de las plataformas tradicionales.",
  priceFrom: "Desde $29",
  priceNote: "/mes",
  includes: [
    "Pipeline de ventas visual",
    "Gestión de prospectos y contactos",
    "Recordatorios y seguimiento",
    "Reportes de ventas",
    "Acceso para tu equipo",
    "Soporte en español",
  ],
  features: [
    { title: "Pipeline visual", description: "Arrastra y suelta tus tratos por cada etapa de venta.", icon: "layers" as IconName },
    { title: "Gestión de prospectos", description: "Todos tus leads ordenados en un solo lugar, sin hojas de cálculo.", icon: "crm" as IconName },
    { title: "Sin la complejidad", description: "Intuitivo desde el primer día. Sin curvas de aprendizaje eternas.", icon: "saas" as IconName },
    { title: "Precio justo", description: "Toda la potencia que necesitas, sin los altos costos tradicionales.", icon: "seo" as IconName },
  ],
  /** Etapas para el mock interactivo del pipeline (Kanban) */
  pipeline: [
    { stage: "Nuevos", deals: ["Acme Corp", "Diseño Studio", "Café del Valle"] },
    { stage: "Contactados", deals: ["Logística HN", "Clínica Sur"] },
    { stage: "Propuesta", deals: ["TechMarket", "Gimnasio Pro"] },
    { stage: "Ganados", deals: ["Viajes Topete", "Constructora Esabep"] },
  ],
} as const;

/**
 * Opciones del wizard. La selección de servicios usa `label` como valor enviado
 * a la API (services[]). Incluye Codebrand Sales.
 */
export const WIZARD_SERVICE_OPTIONS = [
  ...SERVICES.map((s) => ({ id: s.id, label: s.shortLabel, icon: s.icon, priceFrom: s.priceFrom })),
  { id: "codebrand-sales", label: "Codebrand Sales (CRM)", icon: "saas" as IconName, priceFrom: CODEBRAND_SALES.priceFrom },
];

/** Rangos de presupuesto (paso 2 del wizard). */
export const BUDGET_RANGES = [
  "Menos de $1,000",
  "$1,000 - $3,000",
  "$3,000 - $7,000",
  "$7,000 - $15,000",
  "Más de $15,000",
  "Aún no lo sé",
];

/** Plazos deseados (paso 2 del wizard). */
export const TIMELINES = [
  "Lo antes posible",
  "En 1 mes",
  "En 1 a 3 meses",
  "Solo estoy explorando",
];

/**
 * Industrias. ⚠️ El patrón del servidor para `industry` es SOLO [a-zA-Z\s\-&]
 * (sin acentos ni dígitos). Los valores van SIN acentos.
 */
export const INDUSTRIES = [
  "Tecnologia",
  "E-commerce y Retail",
  "Salud",
  "Bienes Raices",
  "Restaurantes",
  "Educacion",
  "Servicios Profesionales",
  "Manufactura",
  "Turismo y Viajes",
  "Startup",
  "Otro",
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "¿Puedo combinar varios servicios en un mismo proyecto?",
    a: "Sí. La mayoría de nuestros clientes combina servicios — por ejemplo, desarrollo web con branding y SEO. En el formulario puedes seleccionar todos los que necesites y armamos una propuesta integral.",
  },
  {
    q: "¿Los precios 'Desde' son finales?",
    a: "Son precios base de referencia. El costo final depende del alcance de tu proyecto; por eso, tras tu solicitud, te enviamos una cotización personalizada y transparente.",
  },
  {
    q: "¿Cuánto tarda en estar listo mi proyecto?",
    a: "Depende del alcance. Una landing puede estar lista en días y un sistema a medida en algunas semanas. Tras recibir tu solicitud te damos un plazo concreto en la cotización.",
  },
  {
    q: "¿Trabajan con clientes fuera de Honduras?",
    a: "Sí. Atendemos clientes en Estados Unidos, Latinoamérica y España. Nuestro equipo es bilingüe y trabaja en tu zona horaria.",
  },
  {
    q: "¿Cómo funciona el pago?",
    a: "Normalmente 50% para iniciar y 50% a la entrega. Aceptamos tarjetas, transferencia bancaria y PayPal. Los detalles se acuerdan en la propuesta.",
  },
  {
    q: "¿El código y los diseños son míos?",
    a: "Sí, al finalizar el proyecto todos los archivos, el código y el contenido son 100% tuyos.",
  },
];

/** Testimonios reales (Google Reviews). */
export const TESTIMONIALS = [
  {
    name: "Serling Topete",
    role: "CEO, Travel Up Agency",
    text: "Lo que más disfrutamos fue el profesionalismo y el orden con el que manejaron el proyecto. Empezamos a recibir clientes reales a través de Google apenas se lanzó el sitio.",
    rating: 5,
  },
  {
    name: "Oscar Gomez",
    role: "CEO, Esabep · Construcción",
    text: "Superaron nuestras expectativas. Nos entregaron un sitio web genial, con una calidad increíble y en los tiempos acordados. Su profesionalismo es de lo mejor en Honduras.",
    rating: 5,
  },
  {
    name: "Ana Ruth Medina",
    role: "Cliente Verificada",
    text: "Excelente compañía de software. Muy profesionales y comprometidos con la calidad de su trabajo.",
    rating: 5,
  },
];

/** Pasos del proceso global de trabajo (sección "Cómo trabajamos"). */
export const PROCESS_STEPS = [
  { num: "01", title: "Cuéntanos qué necesitas", desc: "Selecciona tus servicios en el formulario y compártenos los detalles de tu proyecto." },
  { num: "02", title: "Recibe tu propuesta", desc: "Analizamos tu caso y te enviamos una cotización clara con alcance y tiempos." },
  { num: "03", title: "Construimos juntos", desc: "Ejecutamos con acompañamiento constante y revisiones hasta que quede perfecto." },
  { num: "04", title: "Lanzamiento y soporte", desc: "Lanzamos tu proyecto y te acompañamos después con soporte continuo." },
];

/** Métricas de confianza para la barra de prueba social. */
export const TRUST_STATS = [
  { value: "5.0", label: "en Google Reviews" },
  { value: "50+", label: "Proyectos entregados" },
  { value: "100%", label: "Satisfacción" },
  { value: "24/7", label: "Acompañamiento" },
];

/** Marca / contacto para la landing. */
export const BRAND = {
  name: "Codebrand",
  whatsappUrl: "https://wa.me/50487380714",
  phone: "+504 8738-0714",
  email: "info@codebrand.es",
};
