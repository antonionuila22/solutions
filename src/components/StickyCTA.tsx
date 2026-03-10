import { useEffect, useState } from "react";

interface StickyCTAProps {
  text?: string;
  href?: string;
  showAfterScroll?: number;
}

export default function StickyCTA({
  text = "Get Free Quote",
  href = "/contact",
  showAfterScroll = 600,
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;

          setIsVisible(scrollY > showAfterScroll);
          setIsAtBottom(scrollY + windowHeight > documentHeight - 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  if (!isVisible || isAtBottom) return null;

  return (
    <>
      {/* Mobile: full-width bar */}
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
        <a
          href={href}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 active:scale-[0.97] transition-transform duration-100 will-change-transform"
        >
          <span>{text}</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>

      {/* Desktop: floating pill button bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
        <a
          href={href}
          className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{text}</span>
          <svg
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
      </div>
    </>
  );
}
