import type { Effect } from "../types";
import { splitText } from "../split";

/**
 * Word-by-word mask reveal for headings — the signature agency move.
 * Each word sits in an overflow-hidden mask and slides up from below.
 *
 *   <h2 data-anim="heading">Your Web Development Team</h2>
 *
 * `data-anim-trigger="load"` plays on arrival (hero); otherwise on scroll.
 */
export const headingEffect: Effect = ({ gsap, reducedMotion }) => {
  if (reducedMotion) return;
  const els = gsap.utils.toArray<HTMLElement>('[data-anim="heading"]:not([data-anim-done])');
  if (!els.length) return;

  const tweens: gsap.core.Tween[] = [];

  els.forEach((el) => {
    el.setAttribute("data-anim-done", "true");
    const { words } = splitText(el, "words");
    if (!words.length) return;

    const onLoad = el.getAttribute("data-anim-trigger") === "load";
    const delay = parseFloat(el.getAttribute("data-delay") ?? "0");

    gsap.set(el, { autoAlpha: 1 });
    const t = gsap.fromTo(
      words,
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 0.9,
        delay,
        ease: "power4.out",
        stagger: 0.08,
        ...(onLoad
          ? {}
          : { scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
      },
    );
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
