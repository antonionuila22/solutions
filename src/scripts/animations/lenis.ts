import Lenis from "lenis";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

/**
 * Smooth scrolling, wired into GSAP's ticker so ScrollTrigger stays in sync.
 * Created once for the document lifetime — View Transitions swap the page
 * body but keep the window/scroller, so we keep a single Lenis instance and
 * just reset its position after each swap.
 */
export function initLenis(
  gsap: typeof GsapType,
  ScrollTrigger: typeof ScrollTriggerType,
): Lenis | null {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.1,
    // Gentle ease-out so momentum feels premium but never floaty.
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Native scroll on touch — smooth-touch tends to feel laggy on mobile.
    syncTouch: false,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/** Jump to top instantly — used after a page swap so the new page starts fresh. */
export function resetScroll() {
  lenis?.scrollTo(0, { immediate: true, force: true });
}

export function getLenis() {
  return lenis;
}
