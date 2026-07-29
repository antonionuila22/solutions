# src/components/ui/ — primitivas UI (Astro)

Primitivas visuales autocontenidas (markup + `<style>` + `<script>` vanilla si hace falta).
Cero dependencias npm. Cada archivo documenta sus props y el patrón de origen en la cabecera.

Los `.tsx` de este directorio (`badge.tsx`, `button.tsx`, `card.tsx`, `icon-cloud.tsx`) son
componentes React/shadcn preexistentes de otras islas — no forman parte de esta librería y
no siguen sus reglas.

## Qué componente usar para qué

| Componente | Úsalo para | Coste JS | Origen del patrón |
|---|---|---|---|
| `Marquee.astro` | Banda infinita de logos/tags/texto. El home ya tiene `TechMarquee.astro`; esta es la primitiva para usos nuevos. | 0 | MagicUI Marquee (MIT) |
| `BorderBeam.astro` | Haz naranja recorriendo el borde de una tarjeta destacada (pricing, plan recomendado). La tarjeta necesita `relative` + `rounded-*`. | 0 | MagicUI BorderBeam (MIT) |
| `SpotlightCard.astro` | Tarjeta con halo radial que sigue el cursor (grids de servicios/casos). Estática en táctil. | ~0.3 KB compartidos | ReactBits SpotlightCard (MIT + Commons Clause) |
| `ShinyButton.astro` / clase `.ui-shine` | CTA con barrido de brillo en hover. `.ui-shine` es global: aplícala a CTAs existentes sin reescribirlos (ver cabecera del componente). | 0 | MagicUI/ReactBits/cult-ui (MIT) |
| `HeroColorPanels.astro` | Fondo de hero con paneles slate + 1 naranja que entran escalonados. El contenido va en el slot. | 0 | cult-ui hero color panels (MIT) |
| `TextReveal.astro` | Titular/párrafo que aparece palabra a palabra al entrar en viewport. **No soporta texto degradado** (`bg-clip-text`) — para eso, el motor GSAP (`data-anim`). | ~0.5 KB compartidos | ReactBits SplitText (MIT + Commons Clause), split server-side |

## Reglas no negociables (heredadas del sitio)

1. **Reduced motion (regla C).** Todo movimiento va dentro de
   `@media (prefers-reduced-motion: no-preference)` (o su chequeo `matchMedia` en JS).
   Bajo `reduce`, cada componente tiene un estado estático digno (fila fija, anillo
   tenue, paneles colocados, texto visible). Si añades un componente aquí, lo mismo.
2. **Performance (regla D).** Lighthouse móvil 100/100 es innegociable. Solo se anima
   `transform` y `opacity` — nunca `top/left/width/height`. Nada de scripts síncronos
   en `<head>`; los `<script>` de Astro son módulos diferidos. Imágenes siempre con
   `width`/`height`. Efectos de puntero gateados a
   `matchMedia("(hover: hover) and (pointer: fine)")`.
3. **Paleta (regla E).** Monocromo slate + acento `#f48200`. Nada de arcoíris/violetas
   de las librerías de origen. Contraste: `text-slate-500` sobre fondo claro,
   `text-slate-400` sobre fondo oscuro (slate-400 sobre blanco falla WCAG).

## Notas de integración

- **View Transitions (ClientRouter).** Los `<script>` de Astro corren UNA vez por sesión.
  Todo init debe re-escanear en `astro:page-load` y ser idempotente (atributo
  `data-*-init` en los elementos ya inicializados). `SpotlightCard` y `TextReveal` ya
  lo hacen; copia ese esquema.
- **compressHTML.** Astro pega texto con elementos inline: cierra la línea con `{" "}`
  antes de un `<a>`/`<span>` inline (así lo hace el map de palabras de `TextReveal`).
- **Licencias.** Los tres orígenes permiten adaptación (MIT; ReactBits añade Commons
  Clause, que restringe VENDER la librería, no usar el patrón en un sitio propio).
  Todo componente adaptado anota su origen en el comentario de cabecera.
- **Sin islas por gusto.** React island solo si hay estado interactivo real. Hover,
  scroll o entrada en viewport se resuelven con CSS + vanilla, como en estos archivos.
