/**
 * Construye la etiqueta <title> de una página.
 *
 * Resuelve dos avisos de auditoría que van siempre juntos:
 *
 *  1. "etiquetas de título y H1 duplicados". El <h1> muestra el título del
 *     contenido tal cual. Si el <title> es esa misma cadena, se desperdicia
 *     el espacio donde caben otras palabras clave.
 *  2. "demasiado texto en la etiqueta de título". Google corta alrededor de
 *     los 70 caracteres.
 *
 * La regla anterior era `titulo + sufijo`, y si no cabía se quedaba con el
 * título pelado. Eso producía justo los dos problemas a la vez: sin sufijo
 * quedaba idéntico al H1, y si el título ya era largo seguía pasado de largo.
 *
 * Aquí el sufijo nunca se abandona: primero se prueba el sufijo largo, luego
 * el corto, y si aún no cabe se recorta el título por palabras. El resultado
 * siempre difiere del H1 y siempre cabe en `MAX`.
 *
 * Lo ideal es no depender del recorte: si una página necesita un título propio
 * bien escrito, se declara `seoTitle` en su frontmatter y esta función lo
 * respeta sin tocarlo.
 */

export const MAX_TITLE_LENGTH = 70;

const BRAND = "Codebrand";

export interface PageTitleOptions {
  /** Título escrito a mano en el frontmatter. Si viene, manda. */
  seoTitle?: string;
  /** Sufijo preferido, por ejemplo "Codebrand Blog". */
  suffix?: string;
  /** Límite de caracteres. */
  max?: number;
}

/** Recorta por palabras completas, sin dejar la cadena cortada a la mitad. */
function trimToWords(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  // Si la primera palabra ya no cabe, no hay boundary que respetar.
  const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return base.replace(/[\s,.;:|·]+$/, "");
}

export function buildPageTitle(title: string, options: PageTitleOptions = {}): string {
  const { seoTitle, suffix = BRAND, max = MAX_TITLE_LENGTH } = options;

  const handwritten = seoTitle?.trim();
  if (handwritten) return handwritten;

  const clean = title.trim();

  // Sufijos a probar, del más informativo al más corto.
  const candidates = suffix === BRAND ? [BRAND] : [suffix, BRAND];

  for (const candidate of candidates) {
    const joined = `${clean} | ${candidate}`;
    if (joined.length <= max) return joined;
  }

  // Ninguno cabe entero: se recorta el título para que quepa con la marca.
  const room = max - ` | ${BRAND}`.length;
  const trimmed = trimToWords(clean, room);
  // Con un título sin espacios y más largo que `room`, trimToWords ya devolvió
  // un corte duro; añadir la marca lo pasaría de `max`, así que se devuelve solo.
  if (trimmed.length > room) return trimmed.slice(0, max);
  return `${trimmed} | ${BRAND}`;
}
