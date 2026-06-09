import type { Effect } from "../types";

/**
 * Magnetic hover — element eases toward the cursor while hovered, springs back
 * on leave. Desktop/mouse only.
 *
 *   <a data-magnetic data-magnetic-strength="0.4">Get a Quote</a>
 *
 * Perf: the element's center is measured ONCE on mouseenter and cached, instead
 * of calling getBoundingClientRect() on every mousemove — so hovering no longer
 * forces a synchronous reflow per pointer move (a real INP win on CTAs).
 */
export const magneticEffect: Effect = ({ gsap, reducedMotion, hasPointer }) => {
  if (reducedMotion || !hasPointer) return;
  const els = gsap.utils.toArray<HTMLElement>("[data-magnetic]:not([data-anim-done])");
  if (!els.length) return;

  const cleanups: Array<() => void> = [];

  els.forEach((el) => {
    el.setAttribute("data-anim-done", "true");
    const strength = parseFloat(el.getAttribute("data-magnetic-strength") ?? "0.35");
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    // Cached center — measured on enter (before the magnet transforms the
    // element), reused for every move so no read happens mid-interaction.
    let cx = 0;
    let cy = 0;

    const onEnter = () => {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    };
    const onMove = (e: MouseEvent) => {
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
      el.removeAttribute("data-anim-done");
    });
  });

  return () => cleanups.forEach((fn) => fn());
};
