import { z } from "zod";
import type { AnswerableQuestion } from "../types";

/**
 * Reglas de BORRADOR. El autosave guarda estados a medio escribir (una URL sin
 * terminar, 2 de 17 módulos, una fila de repetidor vacía): exigir ahí el Zod
 * definitivo rechazaría cada pulsación y se perdería el avance.
 *
 * Estas reglas no son la validación del formulario — esa es `validateAnswer`,
 * y la definitiva se aplica en el ENVÍO. Lo único que hacen es impedir que
 * llegue basura al jsonb: tipo correcto y tamaño acotado. Sin esto, la Action
 * escribiría cualquier cosa que mande un cliente manipulado.
 */

const draftText = z.string().max(5_000);

const CELL = z.string().max(2_000);

export function draftSchemaFor(q: AnswerableQuestion): z.ZodType {
  switch (q.type) {
    case "shortText":
    case "longText":
    case "email":
      return draftText;
    case "singleChoice":
      // Un valor fuera del catálogo es manipulación, no un borrador.
      return z.enum(q.options.map((o) => o.value) as [string, ...string[]]).or(z.literal(""));
    case "multiChoice":
      // El tope sí se respeta en borrador: no existe un estado intermedio
      // legítimo con más selecciones de las permitidas (la UI las deshabilita),
      // así que pasarse solo puede venir de un cliente manipulado.
      return z
        .array(z.enum(q.options.map((o) => o.value) as [string, ...string[]]))
        .max(q.maxSelected ?? q.options.length);
    case "ratingScale":
      return z.number().int().min(q.min).max(q.max);
    case "priorityMatrix":
      return z.partialRecord(
        z.enum(q.moduleIds as unknown as [string, ...string[]]),
        z.enum(q.levels.map((l) => l.value) as [string, ...string[]])
      );
    case "accessChecklist":
      return z.partialRecord(
        z.enum(q.items.map((i) => i.id) as [string, ...string[]]),
        z.object({
          disponible: z
            .enum(q.availabilityOptions.map((o) => o.value) as [string, ...string[]])
            .or(z.literal("")),
          responsable: CELL,
        })
      );
    case "repeater": {
      const keys = q.fields.map((f) => f.key) as [string, ...string[]];
      return z.array(z.partialRecord(z.enum(keys), CELL)).max(q.maxRows);
    }
  }
}
