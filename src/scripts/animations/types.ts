import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

/**
 * Context handed to every effect. Effects scan the DOM for their own
 * selectors/data-attributes and wire up GSAP. They return an optional
 * cleanup function which the engine calls on `astro:before-swap` so
 * nothing leaks across View Transition navigations.
 */
export interface AnimCtx {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  /** Matches `(prefers-reduced-motion: reduce)` — effects should no-op when true. */
  reducedMotion: boolean;
  /** True for fine-pointer (mouse) devices. Gates hover/cursor effects. */
  hasPointer: boolean;
}

export type Effect = (ctx: AnimCtx) => void | (() => void);
