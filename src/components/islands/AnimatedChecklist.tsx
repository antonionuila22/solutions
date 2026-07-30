import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * AnimatedChecklist — the "What a Dedicated Team Includes" list on
 * /dedicated-development-team. Items (real page copy, passed via props) cascade
 * in with a check mark that draws itself.
 *
 * Progressive enhancement contract:
 * - SSR renders the COMPLETE list fully visible (initial={false} + the resting
 *   `animate` values), so SEO and no-JS visitors always see everything.
 * - The island mounts with client:visible, i.e. hydration happens exactly when
 *   the list enters the viewport. At that moment we conceal for one frame and
 *   release, which produces the staggered cascade — nothing ever disappears if
 *   JS doesn't load, because concealment only exists after hydration.
 * - Under prefers-reduced-motion the concealment step is skipped entirely and
 *   the list simply renders static.
 * - Animations are transform/opacity (plus SVG pathLength for the tick) only.
 */

export type ChecklistItem = {
  title: string;
  desc: string;
};

type Props = {
  items: ChecklistItem[];
};

const STAGGER_S = 0.09;

export default function AnimatedChecklist({ items }: Props) {
  const reduced = useReducedMotion();
  // false on the server and on the first client render (list visible);
  // briefly true right after hydration to arm the cascade.
  const [concealed, setConcealed] = useState(false);

  useEffect(() => {
    if (reduced) return;
    setConcealed(true);
    let release = 0;
    const arm = requestAnimationFrame(() => {
      release = requestAnimationFrame(() => setConcealed(false));
    });
    return () => {
      cancelAnimationFrame(arm);
      cancelAnimationFrame(release);
    };
  }, [reduced]);

  const instant = concealed || !!reduced;

  return (
    <ul className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
      {items.map((item, i) => (
        <motion.li
          key={item.title}
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          initial={false}
          animate={concealed ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
          transition={
            instant
              ? { duration: 0 }
              : {
                  delay: i * STAGGER_S,
                  type: "spring",
                  stiffness: 240,
                  damping: 28,
                }
          }
        >
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-teal-500/10">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-teal-600"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M5 12.5l4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={false}
                animate={
                  concealed
                    ? { pathLength: 0, opacity: 0 }
                    : { pathLength: 1, opacity: 1 }
                }
                transition={
                  instant
                    ? { duration: 0 }
                    : {
                        delay: i * STAGGER_S + 0.18,
                        duration: 0.45,
                        ease: "easeOut",
                      }
                }
              />
            </svg>
          </span>
          <span className="flex-1">
            <span className="block text-lg font-semibold text-slate-900">
              {item.title}
            </span>
            <span className="mt-1 block leading-relaxed text-slate-600">
              {item.desc}
            </span>
          </span>
        </motion.li>
      ))}
    </ul>
  );
}
