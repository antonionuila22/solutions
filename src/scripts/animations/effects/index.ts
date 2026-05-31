import type { Effect } from "../types";
import { fadeEffect } from "./fade";
import { headingEffect } from "./heading";
import { charsEffect } from "./chars";
import { parallaxEffect } from "./parallax";
import { counterEffect } from "./counter";
import { magneticEffect } from "./magnetic";
import { marqueeEffect } from "./marquee";
import { stickyCardsEffect } from "./stickyCards";

/** Run order doesn't matter much, but reveals first feels tidiest. */
export const effects: Effect[] = [
  headingEffect,
  fadeEffect,
  charsEffect,
  counterEffect,
  parallaxEffect,
  stickyCardsEffect,
  marqueeEffect,
  magneticEffect,
];
