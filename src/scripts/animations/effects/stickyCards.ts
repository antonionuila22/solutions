import type { Effect } from "../types";

/**
 * Pinned stacking cards. The container pins while you scroll; each card scales
 * down and fades as the next one slides up over it.
 *
 *   <div data-sticky-cards>
 *     <div data-sticky-card>...</div>
 *     <div data-sticky-card>...</div>
 *   </div>
 *
 * Cards are expected to be normal block children; this effect handles the
 * pin + transforms. Disabled on reduced motion (falls back to plain stack).
 */
export const stickyCardsEffect: Effect = ({ gsap, ScrollTrigger, reducedMotion }) => {
  if (reducedMotion) return;
  const containers = gsap.utils.toArray<HTMLElement>(
    "[data-sticky-cards]:not([data-anim-done])",
  );
  if (!containers.length) return;

  const triggers: ScrollTrigger[] = [];

  containers.forEach((container) => {
    const cards = gsap.utils.toArray<HTMLElement>(
      container.querySelectorAll("[data-sticky-card]"),
    );
    if (cards.length < 2) return;
    container.setAttribute("data-anim-done", "true");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${window.innerHeight * (cards.length - 1)}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      tl.to(
        card,
        { scale: 0.9, autoAlpha: 0.4, ease: "none" },
        i,
      );
    });

    if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
  });

  return () => {
    triggers.forEach((t) => t.kill());
    containers.forEach((c) => c.removeAttribute("data-anim-done"));
  };
};
