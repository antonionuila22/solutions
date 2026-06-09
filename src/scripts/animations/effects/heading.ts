import type { Effect } from "../types";
import { splitText } from "../split";

/**
 * Word-by-word mask reveal for headings — the signature agency move.
 * Each word sits in an overflow-hidden mask and slides up from below.
 *
 *   <h2 data-anim="heading">Your Web Development Team</h2>
 *
 * `data-anim-trigger="load"` plays on arrival (hero); otherwise on scroll.
 *
 * Perf: every heading is split and given its hidden start state in a single
 * write pass FIRST, then a lone IntersectionObserver plays each one as it
 * enters — so DOM writes (splitText) are never interleaved with layout-measuring
 * ScrollTrigger reads. No forced-reflow churn, even with many headings.
 */
type Unit = { el: HTMLElement; words: HTMLElement[]; load: boolean; delay: number };

export const headingEffect: Effect = ({ gsap, reducedMotion }) => {
  if (reducedMotion) return;
  const els = gsap.utils.toArray<HTMLElement>('[data-anim="heading"]:not([data-anim-done])');
  if (!els.length) return;

  const tweens: gsap.core.Tween[] = [];

  // WRITE phase — split every heading and set its hidden start state up front.
  const units: Unit[] = [];
  els.forEach((el) => {
    el.setAttribute("data-anim-done", "true");
    const { words } = splitText(el, "words");
    if (!words.length) return;
    gsap.set(el, { autoAlpha: 1 });
    gsap.set(words, { yPercent: 120 });
    units.push({
      el,
      words,
      load: el.getAttribute("data-anim-trigger") === "load",
      delay: parseFloat(el.getAttribute("data-delay") ?? "0"),
    });
  });

  const play = (u: Unit) => {
    tweens.push(
      gsap.to(u.words, {
        yPercent: 0,
        duration: 0.9,
        delay: u.delay,
        ease: "power4.out",
        stagger: 0.08,
      }),
    );
  };

  // Load headings play immediately; the rest reveal via a single observer.
  const map = new Map<Element, Unit>();
  const observed: Element[] = [];
  units.forEach((u) => {
    if (u.load) play(u);
    else {
      map.set(u.el, u);
      observed.push(u.el);
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
      { rootMargin: "0px 0px -15% 0px", threshold: 0.01 },
    );
    observed.forEach((el) => io!.observe(el));
  }

  return () => {
    io?.disconnect();
    tweens.forEach((t) => t.kill());
    els.forEach((el) => el.removeAttribute("data-anim-done"));
  };
};
