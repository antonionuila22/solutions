import type { Effect } from "../types";
import { fadeEffect } from "./fade";
import { headingEffect } from "./heading";
import { charsEffect } from "./chars";
import { parallaxEffect } from "./parallax";
import { counterEffect } from "./counter";
import { magneticEffect } from "./magnetic";
import { marqueeEffect } from "./marquee";
import { stickyCardsEffect } from "./stickyCards";

/**
 * Order matters for reflow: the IntersectionObserver-driven, writes-only
 * effects (heading/fade/counter) run FIRST so all DOM mutation + start-state
 * writes happen before the ScrollTrigger-based effects (chars/parallax/sticky/
 * marquee) measure layout. Keeps writes and reads from interleaving.
 */
export const effects: Effect[] = [
  headingEffect,
  fadeEffect,
  counterEffect,
  charsEffect,
  parallaxEffect,
  stickyCardsEffect,
  marqueeEffect,
  magneticEffect,
];
