import { useRef, useState } from "react";
import { useAnimationFrame, useReducedMotion } from "motion/react";

/**
 * OrbitingStack — desktop-only orbital diagram for the development stack.
 * Concentric orbits (2 or 3, depending on item count) rotating slowly around
 * the Codebrand wordmark. Used on /custom-software-development (typographic
 * pills, light theme) and on the home tech section (logo silhouettes, dark
 * theme, all technologies).
 *
 * - SSR renders the full static circular layout (angle 0), so real content is
 *   painted before hydration. Mounted with client:media="(min-width: 768px)";
 *   mobile keeps each page's static fallback and never loads this JS.
 * - Hovering or focusing an item pauses its orbit and shows its label (and
 *   blurb, when provided) in the core. Blurbs are composed strictly from copy
 *   that already exists on the consuming page — no invented metrics.
 * - Icon mode renders each logo full-colour on a white disc (user decision:
 *   brand colours stay). Icons are loading="lazy" on purpose: combined with
 *   the mobile `hidden md:block` wrapper they are never fetched on phones
 *   (lazy images inside display:none never intersect).
 * - Rotation uses only CSS `rotate` (a transform), written imperatively from
 *   a single animation frame loop — React never touches it, so re-renders on
 *   hover can't reset the angle. Under prefers-reduced-motion the loop never
 *   runs and the layout stays static; hover labels still work.
 */

export type OrbitItem = {
  label: string;
  /** Path to an SVG logo (e.g. /icons/react-svgrepo-com.svg). Text pill when absent. */
  icon?: string;
  blurb?: string;
};

type Props = {
  /** Legacy API (custom-software-development): plain labels, blurbs from DESCRIPTIONS. */
  stack?: string[];
  /** Full API: label + optional icon + optional blurb. Takes precedence over stack. */
  items?: OrbitItem[];
  theme?: "light" | "dark";
  coreLabel?: string;
  /** Path to a logo shown in the core instead of the coreLabel text. */
  coreLogo?: string;
  idlePrompt?: string;
};

/** One-line descriptions derived from the copy already on
 *  custom-software-development.astro — FAQ "What technologies do you use?",
 *  the What We Build cards, and the intro paragraphs. */
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

/** Ring geometry per ring-count. radius/inset in % of the square container;
 *  speed in deg/ms (alternating direction); startAngle staggers the seams. */
const RING_SETS: Record<
  2 | 3,
  { radius: number; speed: number; startAngle: number }[]
> = {
  2: [
    { radius: 27, speed: -360 / 70000, startAngle: -90 },
    { radius: 42, speed: 360 / 95000, startAngle: -54 },
  ],
  3: [
    { radius: 18, speed: -360 / 60000, startAngle: -90 },
    { radius: 30.5, speed: 360 / 85000, startAngle: -66 },
    { radius: 43, speed: -360 / 110000, startAngle: -42 },
  ],
};

/** Split n items across rings, smallest ring first. */
function splitRings(n: number): number[] {
  if (n <= 13) {
    const inner = Math.max(3, Math.round(n * 0.4));
    return [inner, n - inner];
  }
  const a = Math.round(n * 0.24);
  const b = Math.round(n * 0.33);
  return [a, b, n - a - b];
}

const THEME = {
  light: {
    guide: "border-slate-200",
    pill: "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600 focus-visible:border-orange-300 focus-visible:text-orange-600",
    iconWrap:
      "border-slate-200 bg-white hover:border-orange-300 focus-visible:border-orange-300",
    core: "text-slate-900",
    blurb: "text-slate-500",
  },
  dark: {
    guide: "border-slate-800",
    pill: "border-slate-700 bg-slate-900 text-slate-300 hover:border-orange-400/60 hover:text-orange-400 focus-visible:border-orange-400/60 focus-visible:text-orange-400",
    /** White disc so full-colour logos (incl. dark marks like Next.js) read on the dark section. */
    iconWrap:
      "border-white/15 bg-white hover:border-orange-400 focus-visible:border-orange-400 hover:scale-110",
    core: "text-white",
    blurb: "text-slate-400",
  },
} as const;

export default function OrbitingStack({
  stack,
  items,
  theme = "light",
  coreLabel = "Codebrand",
  coreLogo,
  idlePrompt = "Hover a technology to see how we use it.",
}: Props) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<OrbitItem | null>(null);
  const t = THEME[theme];

  const all: OrbitItem[] =
    items ?? (stack ?? []).map((label) => ({ label, blurb: DESCRIPTIONS[label] }));

  const counts = splitRings(all.length);
  const geometry = RING_SETS[counts.length as 2 | 3] ?? RING_SETS[2];

  const angles = useRef<number[]>(geometry.map(() => 0));
  const pausedRings = useRef<boolean[]>(geometry.map(() => false));
  const ringEls = useRef<(HTMLDivElement | null)[]>([]);
  const itemEls = useRef<(HTMLButtonElement | null)[][]>(geometry.map(() => []));

  let cursor = 0;
  const rings = counts.map((count, ringIdx) => {
    const ringItems = all.slice(cursor, cursor + count);
    cursor += count;
    return { ringIdx, items: ringItems, ...geometry[ringIdx] };
  });

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    for (const ring of rings) {
      if (pausedRings.current[ring.ringIdx]) continue;
      const angle = (angles.current[ring.ringIdx] + ring.speed * delta) % 360;
      angles.current[ring.ringIdx] = angle;
      const el = ringEls.current[ring.ringIdx];
      // CSS `rotate` only (composited transform); items counter-rotate to
      // stay upright. Never set via React props — see component docblock.
      if (el) el.style.rotate = `${angle}deg`;
      for (const item of itemEls.current[ring.ringIdx]) {
        if (item) item.style.rotate = `${-angle}deg`;
      }
    }
  });

  const pause = (ringIdx: number, item: OrbitItem) => {
    pausedRings.current[ringIdx] = true;
    setActive(item);
  };

  const resume = (ringIdx: number, item: OrbitItem) => {
    pausedRings.current[ringIdx] = false;
    setActive((current) => (current?.label === item.label ? null : current));
  };

  return (
    <div
      role="group"
      aria-label="Our development stack"
      className="relative mx-auto aspect-square w-full max-w-[560px] select-none"
    >
      {/* Orbit guides */}
      {rings.map((ring) => (
        <div
          key={`guide-${ring.ringIdx}`}
          aria-hidden="true"
          className={`absolute rounded-full border ${t.guide}`}
          style={{ inset: `${50 - ring.radius}%` }}
        ></div>
      ))}

      {/* Orbiting items */}
      {rings.map((ring) => (
        <div
          key={ring.ringIdx}
          ref={(el) => {
            ringEls.current[ring.ringIdx] = el;
          }}
          className="absolute inset-0 will-change-transform"
        >
          {ring.items.map((item, i) => {
            const angle = ring.startAngle + (360 / ring.items.length) * i;
            const rad = (angle * Math.PI) / 180;
            const left = 50 + ring.radius * Math.cos(rad);
            const top = 50 + ring.radius * Math.sin(rad);
            return (
              <span
                key={item.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <button
                  type="button"
                  ref={(el) => {
                    itemEls.current[ring.ringIdx][i] = el;
                  }}
                  aria-label={item.icon ? item.label : undefined}
                  onMouseEnter={() => pause(ring.ringIdx, item)}
                  onMouseLeave={() => resume(ring.ringIdx, item)}
                  onFocus={() => pause(ring.ringIdx, item)}
                  onBlur={() => resume(ring.ringIdx, item)}
                  className={
                    item.icon
                      ? `flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${t.iconWrap}`
                      : `block whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] shadow-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 ${t.pill}`
                  }
                >
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt=""
                      width={26}
                      height={26}
                      loading="lazy"
                      className="h-[26px] w-[26px]"
                    />
                  ) : (
                    item.label
                  )}
                </button>
              </span>
            );
          })}
        </div>
      ))}

      {/* Core */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {coreLogo ? (
          <>
            {/* Logo alone in flow = true optical center; the label is taken
                out of flow so appearing/disappearing never shifts the logo. */}
            <img
              src={coreLogo}
              alt={coreLabel}
              width={72}
              height={72}
              loading="lazy"
              className="h-[72px] w-[72px]"
            />
            <p
              aria-live="polite"
              className="absolute left-1/2 top-[calc(50%+56px)] -translate-x-1/2 whitespace-nowrap"
            >
              {active ? (
                <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-orange-400">
                  {active.label}
                </span>
              ) : idlePrompt ? (
                <span className={`text-[13px] ${t.blurb}`}>{idlePrompt}</span>
              ) : null}
            </p>
          </>
        ) : (
          <>
            <span className={`text-2xl font-bold tracking-tight lg:text-3xl ${t.core}`}>
              {active ? active.label : coreLabel}
            </span>
            <p
              aria-live="polite"
              className={`mt-3 flex min-h-14 max-w-[15rem] items-center justify-center text-[13px] leading-snug ${t.blurb}`}
            >
              {active ? active.blurb ?? "" : idlePrompt}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
