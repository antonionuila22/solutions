import type { Effect } from "../types";

/**
 * Count-up numbers when they scroll into view.
 *
 *   <span data-counter="25" data-counter-suffix="+">0</span>
 *   <span data-counter="5" data-counter-decimals="0" data-counter-prefix="< ">0</span>
 *
 * Non-numeric values (e.g. "< 24h") should just be plain text, not a counter.
 *
 * Perf: one IntersectionObserver drives every counter (instead of one GSAP
 * ScrollTrigger each), so this adds no layout-measuring / refresh cost.
 */
export const counterEffect: Effect = ({ gsap, reducedMotion }) => {
  const els = gsap.utils.toArray<HTMLElement>("[data-counter]:not([data-anim-done])");
  if (!els.length) return;

  const tweens: gsap.core.Tween[] = [];

  const render = (el: HTMLElement, v: number) => {
    const decimals = parseInt(el.getAttribute("data-counter-decimals") ?? "0", 10);
    const prefix = el.getAttribute("data-counter-prefix") ?? "";
    const suffix = el.getAttribute("data-counter-suffix") ?? "";
    el.textContent = prefix + v.toFixed(decimals) + suffix;
  };

  els.forEach((el) => el.setAttribute("data-anim-done", "true"));

  if (reducedMotion) {
    els.forEach((el) => render(el, parseFloat(el.getAttribute("data-counter") ?? "0")));
    return;
  }

  const play = (el: HTMLElement) => {
    const end = parseFloat(el.getAttribute("data-counter") ?? "0");
    const obj = { val: 0 };
    tweens.push(
      gsap.to(obj, {
        val: end,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => render(el, obj.val),
      }),
    );
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        play(entry.target as HTMLElement);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
  );
  els.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    tweens.forEach((t) => t.kill());
    els.forEach((el) => el.removeAttribute("data-anim-done"));
  };
};
