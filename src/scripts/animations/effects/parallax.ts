import type { Effect } from "../types";

/**
 * Scroll parallax — element drifts at a different rate than the page.
 *
 *   <img data-parallax data-parallax-speed="0.4" data-parallax-range="120" />
 *
 * Positive speed lags the scroll (moves down slower); the element is centered
 * at the viewport midpoint so movement is symmetric. Disabled on touch/reduced.
 */
export const parallaxEffect: Effect = ({ gsap, ScrollTrigger, reducedMotion }) => {
  if (reducedMotion) return;
  const els = gsap.utils.toArray<HTMLElement>("[data-parallax]:not([data-anim-done])");
  if (!els.length) return;

  const triggers: ScrollTrigger[] = [];

  els.forEach((el) => {
    el.setAttribute("data-anim-done", "true");
    const speed = parseFloat(el.getAttribute("data-parallax-speed") ?? "0.4");
    const range = parseFloat(el.getAttribute("data-parallax-range") ?? "120");

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const y = (self.progress - 0.5) * 2 * range * speed;
        gsap.set(el, { y, force3D: true });
      },
    });
    triggers.push(st);
  });

  return () => {
    triggers.forEach((t) => t.kill());
    els.forEach((el) => {
      gsap.set(el, { clearProps: "transform" });
      el.removeAttribute("data-anim-done");
    });
  };
};
