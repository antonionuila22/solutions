import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * ReviewsCarousel — accessible carousel for the real Google reviews on the home
 * page. The review data lives in src/pages/index.astro (single source of truth
 * shared with the JSON-LD reviewsSchema) and arrives here verbatim via props.
 *
 * - SSR renders every slide stacked in one grid cell: the first slide is
 *   painted before hydration and the container height equals the tallest
 *   review, so switching slides never causes CLS.
 * - Auto-advances every 6s; pauses on hover, focus, touch, and under
 *   prefers-reduced-motion. Manual navigation resets the timer.
 * - Touch swipe + prev/next arrows + dots. Animations are transform/opacity
 *   only, with a sober spring.
 */

export type Review = {
  name: string;
  body: string;
};

type Props = {
  reviews: Review[];
};

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

export default function ReviewsCarousel({ reviews }: Props) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const reduced = useReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const count = reviews.length;
  const go = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );

  const paused = hovered || focused || touching || !!reduced;

  // `index` is a dependency on purpose: any manual navigation recreates the
  // interval, so the next auto-advance is always a full 6s away.
  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, count, index]);

  if (count === 0) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setTouching(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    setTouching(false);
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Google reviews from Codebrand clients"
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      {/* Viewport: all slides share the same grid cell, so the height is the
          tallest slide's height and stays stable between transitions. */}
      <div
        aria-live="polite"
        className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center sm:px-12 sm:py-12"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          touchStart.current = null;
          setTouching(false);
        }}
      >
        {reviews.map((review, i) => {
          const active = i === index;
          const restingX = active ? 0 : i < index ? -28 : 28;
          return (
            <motion.figure
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`Review ${i + 1} of ${count}`}
              aria-hidden={!active}
              className="col-start-1 row-start-1 flex flex-col items-center justify-center"
              style={{ pointerEvents: active ? "auto" : "none" }}
              initial={false}
              animate={{ opacity: active ? 1 : 0, x: restingX }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 260, damping: 32, mass: 0.9 }
              }
            >
              <div
                aria-hidden="true"
                className="text-base tracking-[0.35em] text-amber-400"
              >
                ★★★★★
              </div>
              <span className="sr-only">Rated 5 out of 5 stars</span>
              <blockquote className="mt-5 text-lg leading-relaxed text-slate-300 sm:text-xl">
                {review.body}
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <span className="font-semibold text-white">{review.name}</span>
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-slate-600"
                ></span>
                <span className="text-sm text-slate-400">Google review</span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous review"
          onClick={() => go(index - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-400 transition-colors duration-300 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to review ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
              className={
                "h-2.5 w-2.5 rounded-full transition-transform duration-300 " +
                (i === index
                  ? "scale-125 bg-orange-400"
                  : "bg-slate-600 hover:bg-slate-500")
              }
            ></button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next review"
          onClick={() => go(index + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-400 transition-colors duration-300 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
