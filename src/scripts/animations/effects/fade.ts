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
 *
 * Perf: ONE IntersectionObserver drives every scroll reveal (instead of one GSAP
 * ScrollTrigger per element), and the hidden "from" state is applied in a single
 * write pass — so the engine never interleaves DOM writes with layout-measuring
 * reads. Forced-reflow / refresh cost stays ~O(1) as this markup spreads
 * site-wide. IntersectionObserver runs off the main thread, so it adds no reflow.
 */
type Unit = {
  targets: HTMLElement[];
  trigger: HTMLElement;
  stagger: number;
  load: boolean;
};

export const fadeEffect: Effect = ({ gsap, reducedMotion }) => {
  if (reducedMotion) return;
  const els = gsap.utils.toArray<HTMLElement>('[data-anim="fade"]:not([data-anim-done])');
  if (!els.length) return;

  const tweens: gsap.core.Tween[] = [];

  // Partition into groups (stagger together) and singles.
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

  const units: Unit[] = [];
  singles.forEach((el) =>
    units.push({
      targets: [el],
      trigger: el,
      stagger: 0,
      load: el.getAttribute("data-anim-trigger") === "load",
    }),
  );
  groups.forEach((targets) =>
    units.push({
      targets,
      trigger: targets[0],
      stagger: parseFloat(targets[0].getAttribute("data-stagger") ?? "0.12"),
      load: targets[0].getAttribute("data-anim-trigger") === "load",
    }),
  );

  const fromVars = (el: HTMLElement) => {
    const dir = el.getAttribute("data-fade-from") ?? "bottom";
    const offset = parseFloat(el.getAttribute("data-fade-offset") ?? "40");
    return {
      autoAlpha: 0,
      x: dir === "left" ? -offset : dir === "right" ? offset : 0,
      y: dir === "top" ? -offset : dir === "bottom" ? offset : 0,
    };
  };

  // WRITE phase — apply the hidden "from" state for every element now (writes
  // only, no layout reads) so the pre-paint blanket can lift without a flash.
  units.forEach((u) => gsap.set(u.targets, fromVars(u.targets[0])));

  const play = (u: Unit) => {
    const first = u.targets[0];
    tweens.push(
      gsap.to(u.targets, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: parseFloat(first.getAttribute("data-duration") ?? "0.85"),
        delay: parseFloat(first.getAttribute("data-delay") ?? "0"),
        ease: "power3.out",
        stagger: u.stagger,
        overwrite: "auto",
      }),
    );
  };

  // Load units play immediately; the rest reveal via a single observer.
  const map = new Map<Element, Unit>();
  const observed: Element[] = [];
  units.forEach((u) => {
    if (u.load) play(u);
    else {
      map.set(u.trigger, u);
      observed.push(u.trigger);
    }
  });

  let io: IntersectionObserver | null = null;
  if (observed.length) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const u = map.get(entry.target);
          io!.unobserve(entry.target);
          map.delete(entry.target);
          if (u) play(u);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    observed.forEach((el) => io!.observe(el));
  }

  return () => {
    io?.disconnect();
    tweens.forEach((t) => t.kill());
    els.forEach((el) => el.removeAttribute("data-anim-done"));
  };
};
