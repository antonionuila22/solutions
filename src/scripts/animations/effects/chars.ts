import type { Effect } from "../types";
import { splitText } from "../split";

/**
 * Scrubbed character reveal — text "fills in" letter by letter as you scroll
 * through it. Great for a single emphasis paragraph or statement.
 *
 *   <p data-anim="chars">We build fast, scalable products.</p>
 */
export const charsEffect: Effect = ({ gsap, reducedMotion }) => {
  if (reducedMotion) return;
  const els = gsap.utils.toArray<HTMLElement>('[data-anim="chars"]:not([data-anim-done])');
  if (!els.length) return;

  const tweens: gsap.core.Tween[] = [];

  els.forEach((el) => {
    el.setAttribute("data-anim-done", "true");
    const { chars } = splitText(el, "chars");
    if (!chars.length) return;

    gsap.set(el, { autoAlpha: 1 });
    gsap.set(chars, { opacity: 0.18 });
    const t = gsap.to(chars, {
      opacity: 1,
      ease: "none",
      stagger: 0.5,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "bottom 55%",
        scrub: 1,
      },
    });
    tweens.push(t);
  });

  return () => {
    tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
    els.forEach((el) => el.removeAttribute("data-anim-done"));
  };
};
