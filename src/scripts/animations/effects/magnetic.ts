import type { Effect } from "../types";

/**
 * Magnetic hover — element eases toward the cursor while hovered, springs back
 * on leave. Desktop/mouse only.
 *
 *   <a data-magnetic data-magnetic-strength="0.4">Get a Quote</a>
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

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    cleanups.push(() => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
      el.removeAttribute("data-anim-done");
    });
  });

  return () => cleanups.forEach((fn) => fn());
};
