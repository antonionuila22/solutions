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

          // Show after scrolling past threshold
          setIsVisible(scrollY > showAfterScroll);

          // Hide when near footer (last 400px)
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
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
      <a
        href={href}
        className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-xl shadow-orange-500/30 active:scale-[0.97] transition-transform duration-100 will-change-transform"
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
  );
}
