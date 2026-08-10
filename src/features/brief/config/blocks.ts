import type { BlockDefinition } from "../types";

/**
 * Un solo bloque: el formulario de arranque es corto y directo, sin la
 * estructura A a I del documento original y sin bloque de contacto (el enlace
 * se envia a un cliente cuyo contacto ya tenemos).
 */
export const BLOCKS: readonly BlockDefinition[] = [
  { id: "A", title: "Formulario de arranque", shortLabel: "Arranque", estimatedMinutes: 8 },
] as const;

/** Estimacion total del formulario. La pantalla de bienvenida la menciona. */
export const TOTAL_MINUTES = 8;

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
