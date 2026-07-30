import { useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "motion/react";

/**
 * OrbitingStack — desktop-only orbital diagram for the development stack on
 * /custom-software-development. Two concentric orbits of typographic labels
 * (no third-party logos) rotate slowly around the Codebrand wordmark.
 *
 * - SSR renders the full static circular layout (angle 0), so real content is
 *   painted before hydration. Mounted with client:media="(min-width: 768px)";
 *   mobile keeps the page's static badge list and never loads this JS.
 * - Hovering or focusing a label pauses that label's orbit and shows a
 *   one-line description in the core. Descriptions are composed strictly from
 *   the page's own copy (its FAQ answers and service descriptions) — no
 *   invented metrics.
 * - Rotation uses only CSS `rotate` (a transform), written imperatively from
 *   a single animation frame loop — React never touches it, so re-renders on
 *   hover can't reset the angle. Under prefers-reduced-motion the loop never
 *   runs and the layout stays static; hover descriptions still work.
 */

type Props = {
  stack: string[];
};

type OrbitKey = "inner" | "outer";

/** One-line descriptions derived from the copy already on the page
 *  (custom-software-development.astro — FAQ "What technologies do you use?",
 *  the What We Build cards, and the intro paragraphs). */
const DESCRIPTIONS: Record<string, string> = {
  React: "On the frontend — full-stack web apps, from customer portals to complex platforms.",
  "Next.js": "On the frontend with React — modern, maintainable code you own 100%.",
  "Node.js": "On the backend — documented, secure REST and GraphQL APIs.",
  Python: "On the backend — integrations and automation between existing systems.",
  TypeScript: "Used throughout the stack for reliability.",
  PostgreSQL: "For data — well-modeled, performant databases that keep your data clean.",
  MongoDB: "For data — consistent, ready-to-scale database design.",
  Supabase: "Chosen when it fits the project and stays maintainable long-term.",
  "REST / GraphQL": "APIs documented, secure, and ready for your apps and partners to consume.",
};

const INNER_COUNT = 4;
/** Orbit radii as a percentage of the (square) container. */
const RADIUS: Record<OrbitKey, number> = { inner: 27, outer: 42 };
/** Degrees per millisecond — one lap in 70s (inner, counter-clockwise) and 95s (outer). */
const SPEED: Record<OrbitKey, number> = { inner: -360 / 70000, outer: 360 / 95000 };

export default function OrbitingStack({ stack }: Props) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  const angles = useRef<Record<OrbitKey, number>>({ inner: 0, outer: 0 });
  const pausedOrbits = useRef<Record<OrbitKey, boolean>>({ inner: false, outer: false });
  const innerRing = useRef<HTMLDivElement | null>(null);
  const outerRing = useRef<HTMLDivElement | null>(null);
  const itemEls = useRef<Record<OrbitKey, (HTMLButtonElement | null)[]>>({
    inner: [],
    outer: [],
  });

  const orbits: { key: OrbitKey; items: string[]; startAngle: number; ring: React.RefObject<HTMLDivElement | null> }[] = [
    { key: "inner", items: stack.slice(0, INNER_COUNT), startAngle: -90, ring: innerRing },
    { key: "outer", items: stack.slice(INNER_COUNT), startAngle: -54, ring: outerRing },
  ];

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    for (const orbit of orbits) {
      if (pausedOrbits.current[orbit.key]) continue;
      const angle = (angles.current[orbit.key] + SPEED[orbit.key] * delta) % 360;
      angles.current[orbit.key] = angle;
      const ring = orbit.ring.current;
      // CSS `rotate` only (composited transform); labels counter-rotate to
      // stay upright. Never set via React props — see component docblock.
      if (ring) ring.style.rotate = `${angle}deg`;
      for (const el of itemEls.current[orbit.key]) {
        if (el) el.style.rotate = `${-angle}deg`;
      }
    }
  });

  const pause = (orbit: OrbitKey, tech: string) => {
    pausedOrbits.current[orbit] = true;
    setActive(tech);
  };

  const resume = (orbit: OrbitKey, tech: string) => {
    pausedOrbits.current[orbit] = false;
    setActive((current) => (current === tech ? null : current));
  };

  return (
    <div
      role="group"
      aria-label="Our development stack"
      className="relative mx-auto aspect-square w-full max-w-[560px] select-none"
    >
      {/* Orbit guides */}
      <div
        aria-hidden="true"
        className="absolute rounded-full border border-slate-200"
        style={{ inset: "8%" }}
      ></div>
      <div
        aria-hidden="true"
        className="absolute rounded-full border border-slate-200"
        style={{ inset: "23%" }}
      ></div>

      {/* Orbiting labels */}
      {orbits.map((orbit) => (
        <div key={orbit.key} ref={orbit.ring} className="absolute inset-0 will-change-transform">
          {orbit.items.map((tech, i) => {
            const angle = orbit.startAngle + (360 / orbit.items.length) * i;
            const rad = (angle * Math.PI) / 180;
            const left = 50 + RADIUS[orbit.key] * Math.cos(rad);
            const top = 50 + RADIUS[orbit.key] * Math.sin(rad);
            return (
              <span
                key={tech}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <button
                  type="button"
                  ref={(el) => {
                    itemEls.current[orbit.key][i] = el;
                  }}
                  onMouseEnter={() => pause(orbit.key, tech)}
                  onMouseLeave={() => resume(orbit.key, tech)}
                  onFocus={() => pause(orbit.key, tech)}
                  onBlur={() => resume(orbit.key, tech)}
                  className="block whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-700 shadow-sm transition-colors duration-300 hover:border-orange-300 hover:text-orange-600 focus-visible:border-orange-300 focus-visible:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                >
                  {tech}
                </button>
              </span>
            );
          })}
        </div>
      ))}

      {/* Core */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
          Codebrand
        </span>
        <p
          aria-live="polite"
          className="mt-3 flex min-h-14 max-w-[15rem] items-center justify-center text-[13px] leading-snug text-slate-500"
        >
          {active
            ? DESCRIPTIONS[active] ?? ""
            : "Hover a technology to see how we use it."}
        </p>
      </div>
    </div>
  );
}
