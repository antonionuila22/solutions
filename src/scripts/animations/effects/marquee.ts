import type { Effect } from "../types";

/**
 * Seamless infinite marquee with scroll-velocity boost. Wrap a single track of
 * items; the effect clones it to fill the loop.
 *
 *   <div data-marquee data-marquee-speed="60" data-marquee-direction="-1">
 *     <div data-marquee-track> ...items... </div>
 *   </div>
 *
 * speed = px/sec. direction: -1 (left) or 1 (right).
 */
export const marqueeEffect: Effect = ({ gsap, ScrollTrigger, reducedMotion }) => {
  if (reducedMotion) return;
  const els = gsap.utils.toArray<HTMLElement>("[data-marquee]:not([data-anim-done])");
  if (!els.length) return;

  const cleanups: Array<() => void> = [];

  els.forEach((wrap) => {
    const track = wrap.querySelector<HTMLElement>("[data-marquee-track]");
    if (!track) return;
    wrap.setAttribute("data-anim-done", "true");

    const speed = parseFloat(wrap.getAttribute("data-marquee-speed") ?? "60");
    const direction = parseFloat(wrap.getAttribute("data-marquee-direction") ?? "-1");

    // Clone the track until we have enough width to loop seamlessly.
    const original = track.innerHTML;
    let width = track.scrollWidth;
    while (track.scrollWidth < wrap.offsetWidth * 2) {
      track.innerHTML += original;
    }
    width = track.scrollWidth / 2;

    const xWrap = gsap.utils.wrap(-width, 0);
    let pos = 0;
    let velocity = 1;

    const ticker = (_t: number, delta: number) => {
      pos += (direction * speed * velocity * delta) / 1000;
      gsap.set(track, { x: xWrap(pos) });
      velocity = gsap.utils.interpolate(velocity, 1, 0.05);
    };
    gsap.ticker.add(ticker);

    // Scroll velocity nudges the marquee faster — subtle "alive" feel.
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        velocity = 1 + Math.min(Math.abs(self.getVelocity() / 250), 6);
      },
    });

    cleanups.push(() => {
      gsap.ticker.remove(ticker);
      st.kill();
      wrap.removeAttribute("data-anim-done");
    });
  });

  return () => cleanups.forEach((fn) => fn());
};
