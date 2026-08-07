/**
 * Matriz de prioridades del Bloque D y checklist de accesos del Bloque E.
 *
 * GENÉRICOS a propósito: el brief lo llena cualquier cliente de Codebrand
 * (empresa, gremial, institución, profesional), no solo una cámara de
 * comercio. Donde el documento original decía "afiliado" aquí dice
 * "cliente, miembro o usuario".
 *
 * Los ids son claves dentro del jsonb: estables desde la primera respuesta
 * guardada en producción. Se pueden renombrar mientras no haya datos reales.
 */

export interface ModuleDefinition {
  id: string;
  label: string;
}

/** Módulos que se cotizan. Cada uno recibe un nivel de prioridad. */
export const MODULES: readonly ModuleDefinition[] = [
  { id: "catalogo-filtros", label: "Catálogo de productos o servicios con filtros" },
  { id: "ficha-detalle", label: "Ficha individual de producto, servicio o miembro" },
  { id: "directorio-buscador", label: "Directorio o listado con buscador" },
  { id: "calendario-eventos", label: "Calendario de eventos y capacitaciones" },
  { id: "inscripcion-cupos", label: "Inscripción en línea con control de cupos" },
  { id: "precios-diferenciados", label: "Precios diferenciados por tipo de usuario" },
  { id: "pago-en-linea", label: "Pago en línea" },
  { id: "formulario-solicitud", label: "Formulario de solicitud, registro o afiliación" },
  { id: "area-privada", label: "Área privada de usuario" },
  { id: "autogestion-perfil", label: "Autogestión del perfil por el propio usuario" },
  { id: "documentos-constancias", label: "Emisión o descarga de documentos y constancias" },
  { id: "bolsa-empleo", label: "Bolsa de empleo" },
  { id: "blog-noticias", label: "Blog, noticias o boletines" },
  { id: "buscador-sitio", label: "Buscador general del sitio" },
  { id: "multiidioma", label: "Sitio en varios idiomas" },
  { id: "suscripcion-boletin", label: "Suscripción a boletín por correo" },
  { id: "chat-whatsapp", label: "Chat en vivo o WhatsApp integrado" },
  { id: "video-transmisiones", label: "Video, transmisiones o grabaciones" },
] as const;

/** Los cuatro niveles de la matriz. */
export const PRIORITY_LEVELS = [
  { value: "indispensable", label: "Indispensable" },
  { value: "deseable", label: "Deseable" },
  { value: "no-aplica", label: "No aplica" },
  { value: "ya-existe", label: "Ya existe" },
] as const;

export const MODULE_IDS = MODULES.map((m) => m.id);

/** Checklist de accesos que el proyecto necesita para arrancar. */
export const ACCESS_ITEMS: readonly ModuleDefinition[] = [
  { id: "cms-admin", label: "Panel de administración del sitio, rol administrador" },
  { id: "hosting-cpanel", label: "Panel de hosting o cPanel" },
  { id: "registrador-dominio", label: "Registrador del dominio" },
  { id: "dns", label: "Administración de registros DNS" },
  { id: "google-analytics", label: "Google Analytics" },
  { id: "search-console", label: "Google Search Console" },
  { id: "google-business", label: "Perfil de Google Business" },
  { id: "redes-sociales", label: "Cuentas de redes sociales" },
  { id: "bd-contactos", label: "Base de datos de clientes o miembros, exportable" },
  { id: "manual-marca", label: "Manual de marca y logotipo vectorial" },
] as const;

export const ACCESS_ITEM_IDS = ACCESS_ITEMS.map((a) => a.id);

/** Constante única compartida entre la pregunta y su schema Zod. */
export const AVAILABILITY_OPTIONS = [
  { value: "disponible", label: "Disponible" },
  { value: "no-disponible", label: "No disponible" },
  { value: "por-confirmar", label: "Por confirmar" },
] as const;

export const AVAILABILITY_VALUES = AVAILABILITY_OPTIONS.map((o) => o.value);
