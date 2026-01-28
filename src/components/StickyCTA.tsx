import React, { useEffect, useState } from "react";

interface StickyCTAProps {
  text?: string;
  href?: string;
  showAfterScroll?: number;
}

export default function StickyCTA({
  text = "Get Free Quote",
  href = "/contact",
  showAfterScroll = 500,
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show after scrolling past threshold
      setIsVisible(scrollY > showAfterScroll);

      // Hide when near footer (last 300px)
      setIsAtBottom(scrollY + windowHeight > documentHeight - 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  if (!isVisible || isAtBottom) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden animate-slide-up">
      <a
        href={href}
        className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 active:scale-[0.98] transition-transform duration-150"
      >
        {text}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </a>
    </div>
  );
}
