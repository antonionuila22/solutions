/**
 * Animation engine — Astro-native GSAP orchestration.
 *
 * How it works with View Transitions (ClientRouter):
 *  - This module runs ONCE. It registers plugins, boots Lenis, and binds the
 *    Astro lifecycle events.
 *  - `astro:page-load` fires on first load AND after every client navigation —
 *    that's where we scan the DOM and build effects.
 *  - `astro:before-swap` tears every effect/ScrollTrigger down so nothing leaks
 *    into the next page.
 *
 * Effects are data-attribute driven (see ./effects/*). To animate something,
 * add attributes to the HTML — no need to touch this file.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initLenis, resetScroll } from "./lenis";
import { effects } from "./effects";
import type { AnimCtx } from "./types";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const ctx: AnimCtx = { gsap, ScrollTrigger, reducedMotion, hasPointer };

let cleanups: Array<() => void> = [];
let started = false;

function build() {
  if (reducedMotion) {
    // Content was never hidden for reduced-motion users; nothing to do.
    document.documentElement.classList.add("gsap-ready");
    return;
  }

  // Run effects FIRST: fromTo/set applies each element's "from" state as an
  // inline style immediately. Only then do we lift the CSS blanket that hid
  // `[data-anim]` pre-paint — so elements never flash fully-shown.
  for (const effect of effects) {
    try {
      const cleanup = effect(ctx);
      if (cleanup) cleanups.push(cleanup);
    } catch (err) {
      console.warn("[animations] effect failed:", err);
    }
  }

  document.documentElement.classList.add("gsap-ready");

  // One refresh after everything is wired so pinned/scrubbed triggers measure
  // against the final layout (fonts, images).
  ScrollTrigger.refresh();
}

function teardown() {
  cleanups.forEach((fn) => {
    try {
      fn();
    } catch {
      /* noop */
    }
  });
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

function boot() {
  if (started) return;
  started = true;

  if (!reducedMotion) initLenis(gsap, ScrollTrigger);

  document.addEventListener("astro:page-load", build);
  document.addEventListener("astro:before-swap", teardown);
  document.addEventListener("astro:after-swap", () => {
    if (!reducedMotion) resetScroll();
  });

  // Initial load: if astro:page-load already fired before we bound (race), or
  // ClientRouter isn't active on this route, build immediately.
  if (document.readyState !== "loading") build();
}

// Re-running images/fonts shifts layout; recalc when fonts settle.
if (document.fonts?.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

boot();
