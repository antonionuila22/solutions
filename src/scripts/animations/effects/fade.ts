import type { Effect } from "../types";

/**
 * Fade/slide reveal — the workhorse.
 *
 *   <div data-anim="fade" data-fade-from="bottom" data-fade-offset="40"
 *        data-delay="0.1" data-duration="0.8">
 *
 * Direction comes from `data-fade-from` (bottom|top|left|right). Siblings sharing
 * a `data-anim-group` value stagger together. By default it reveals on scroll;
 * set `data-anim-trigger="load"` for above-the-fold elements that play on arrival.
 */
export const fadeEffect: Effect = ({ gsap, reducedMotion }) => {
  if (reducedMotion) return;
  const els = gsap.utils.toArray<HTMLElement>('[data-anim="fade"]:not([data-anim-done])');
  if (!els.length) return;

  const tweens: gsap.core.Tween[] = [];

  // Group elements that should stagger as one batch.
  const groups = new Map<string, HTMLElement[]>();
  const singles: HTMLElement[] = [];
  els.forEach((el) => {
    el.setAttribute("data-anim-done", "true");
    const group = el.getAttribute("data-anim-group");
    if (group) {
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group)!.push(el);
    } else {
      singles.push(el);
    }
  });

  const animate = (targets: HTMLElement[], stagger: number) => {
    const first = targets[0];
    const dir = first.getAttribute("data-fade-from") ?? "bottom";
    const offset = parseFloat(first.getAttribute("data-fade-offset") ?? "40");
    const duration = parseFloat(first.getAttribute("data-duration") ?? "0.85");
    const delay = parseFloat(first.getAttribute("data-delay") ?? "0");
    const onLoad = first.getAttribute("data-anim-trigger") === "load";

    const x = dir === "left" ? -offset : dir === "right" ? offset : 0;
    const y = dir === "top" ? -offset : dir === "bottom" ? offset : 0;

    const t = gsap.fromTo(
      targets,
      { autoAlpha: 0, x, y },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        stagger,
        ...(onLoad
          ? {}
          : { scrollTrigger: { trigger: first, start: "top 88%", once: true } }),
      },
    );
    tweens.push(t);
  };

  singles.forEach((el) => animate([el], 0));
  groups.forEach((targets) => {
    const s = parseFloat(targets[0].getAttribute("data-stagger") ?? "0.12");
    animate(targets, s);
  });

  return () => {
    tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
    els.forEach((el) => el.removeAttribute("data-anim-done"));
  };
};
