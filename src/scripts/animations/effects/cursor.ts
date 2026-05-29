import type { Effect } from "../types";

/**
 * Custom cursor: a small dot that tracks the pointer 1:1 plus a lagging ring
 * that eases behind it. The ring grows over links, buttons and any
 * `[data-cursor]` element. Desktop/mouse only — never created on touch.
 *
 * The cursor DOM lives outside the page content so it survives View Transition
 * swaps; we only re-bind hover targets on each scan.
 */
let built = false;
let dot: HTMLElement | null = null;
let ring: HTMLElement | null = null;

export const cursorEffect: Effect = ({ gsap, reducedMotion, hasPointer }) => {
  if (reducedMotion || !hasPointer) return;

  if (!built) {
    dot = document.createElement("div");
    dot.className = "cb-cursor-dot";
    ring = document.createElement("div");
    ring.className = "cb-cursor-ring";
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add("cb-has-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    let visible = false;
    window.addEventListener("mousemove", (e) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    });
    built = true;
  }

  const grow = () => ring?.classList.add("is-active");
  const shrink = () => ring?.classList.remove("is-active");

  const targets = Array.from(
    document.querySelectorAll<HTMLElement>("a, button, [data-cursor], [data-magnetic]"),
  ).filter((el) => !el.hasAttribute("data-cursor-bound"));

  targets.forEach((el) => {
    el.setAttribute("data-cursor-bound", "true");
    el.addEventListener("mouseenter", grow);
    el.addEventListener("mouseleave", shrink);
  });

  return () => {
    targets.forEach((el) => {
      el.removeEventListener("mouseenter", grow);
      el.removeEventListener("mouseleave", shrink);
      el.removeAttribute("data-cursor-bound");
    });
    shrink();
  };
};
