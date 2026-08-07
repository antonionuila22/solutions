import type { BlockDefinition } from "../types";

/**
 * Bloques del brief: P (contacto) + A–I del documento + Z (cierre).
 * Los tiempos estimados alimentan la pantalla statement que abre cada bloque.
 *
 * Suman exactamente TOTAL_MINUTES = 45, la cifra que el documento promete
 * ("Tiempo estimado de llenado: 45 minutos"). Si se reparte distinto, que siga
 * sumando 45 — la invariante de abajo falla el build si no.
 */
export const BLOCKS: readonly BlockDefinition[] = [
  { id: "P", title: "Datos de quien completa el formulario", shortLabel: "Contacto", estimatedMinutes: 2 },
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

/** Cifra literal del documento. La portada la muestra tal cual. */
export const TOTAL_MINUTES = 45;

const sum = BLOCKS.reduce((n, b) => n + b.estimatedMinutes, 0);
if (sum !== TOTAL_MINUTES) {
  throw new Error(
    `blocks.ts: los minutos por bloque suman ${sum} y la portada promete ${TOTAL_MINUTES}.`
  );
}

export function getBlock(id: BlockDefinition["id"]): BlockDefinition {
  const block = BLOCKS.find((b) => b.id === id);
  if (!block) throw new Error(`Bloque desconocido: ${id}`);
  return block;
}
