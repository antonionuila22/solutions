import type { Effect } from "../types";

/**
 * Count-up numbers when they scroll into view.
 *
 *   <span data-counter="25" data-counter-suffix="+">0</span>
 *   <span data-counter="5" data-counter-decimals="0" data-counter-prefix="< ">0</span>
 *
 * Non-numeric values (e.g. "< 24h") should just be plain text, not a counter.
 */
export const counterEffect: Effect = ({ gsap, reducedMotion }) => {
  const els = gsap.utils.toArray<HTMLElement>("[data-counter]:not([data-anim-done])");
  if (!els.length) return;

  const tweens: gsap.core.Tween[] = [];

  els.forEach((el) => {
    el.setAttribute("data-anim-done", "true");
    const end = parseFloat(el.getAttribute("data-counter") ?? "0");
    const decimals = parseInt(el.getAttribute("data-counter-decimals") ?? "0", 10);
    const prefix = el.getAttribute("data-counter-prefix") ?? "";
    const suffix = el.getAttribute("data-counter-suffix") ?? "";
    const render = (v: number) => {
      el.textContent = prefix + v.toFixed(decimals) + suffix;
    };

    if (reducedMotion) {
      render(end);
      return;
    }

    const obj = { val: 0 };
    const t = gsap.to(obj, {
      val: end,
      duration: 1.6,
      ease: "power2.out",
      onUpdate: () => render(obj.val),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
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
