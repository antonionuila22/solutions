import type { BlockDefinition } from "../types";

/**
 * Bloques del brief: A–I del documento + Z (cierre). El bloque de contacto se
 * eliminó: el brief se envía a un cliente cuyo contacto ya tenemos, y volver a
 * pedirlo era fricción sin información nueva.
 * Los tiempos estimados alimentan la pantalla statement que abre cada bloque.
 *
 * Suman exactamente TOTAL_MINUTES (los 45 del documento menos los 2 del
 * contacto eliminado). La invariante de abajo falla el build si se descuadran.
 */
export const BLOCKS: readonly BlockDefinition[] = [
  { id: "A", title: "Negocio y organización", shortLabel: "Organización", estimatedMinutes: 6 },
  { id: "B", title: "Audiencia", shortLabel: "Audiencia", estimatedMinutes: 4 },
  { id: "C", title: "Contenido", shortLabel: "Contenido", estimatedMinutes: 4 },
  { id: "D", title: "Funcionalidad", shortLabel: "Funcionalidad", estimatedMinutes: 8 },
  { id: "E", title: "Técnico y accesos", shortLabel: "Técnico", estimatedMinutes: 6 },
  { id: "F", title: "Marca y diseño", shortLabel: "Marca", estimatedMinutes: 4 },
  { id: "G", title: "Medición de resultados", shortLabel: "Medición", estimatedMinutes: 2 },
  { id: "H", title: "Proceso, plazos y presupuesto", shortLabel: "Proceso", estimatedMinutes: 5 },
  { id: "I", title: "Redes sociales", shortLabel: "Redes", estimatedMinutes: 3 },
  { id: "Z", title: "Comentarios y envío", shortLabel: "Cierre", estimatedMinutes: 1 },
] as const;

/** Estimación total del formulario (nadie la muestra hoy; ancla los bloques). */
export const TOTAL_MINUTES = 43;

const sum = BLOCKS.reduce((n, b) => n + b.estimatedMinutes, 0);
if (sum !== TOTAL_MINUTES) {
  throw new Error(
    `blocks.ts: los minutos por bloque suman ${sum} y TOTAL_MINUTES dice ${TOTAL_MINUTES}.`
  );
}

export function getBlock(id: BlockDefinition["id"]): BlockDefinition {
  const block = BLOCKS.find((b) => b.id === id);
  if (!block) throw new Error(`Bloque desconocido: ${id}`);
  return block;
}
