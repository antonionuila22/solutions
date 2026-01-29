import { useState } from "react";

/**
 * FAQ Component - Unified (DRY principle)
 * Single component with theme prop instead of two separate components
 */

export type FAQItem = {
  question: string;
  answer: string;
};

type Theme = "light" | "dark";

type Props = {
  faqs: FAQItem[];
  theme?: Theme;
};

// Theme configurations (SOLID - Open/Closed principle)
const themes = {
  light: {
    container: "w-full flex flex-col gap-3",
    item: "rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-200",
    itemOpen: "border-orange-300 bg-orange-50 shadow-md",
    button: "w-full text-left px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center gap-3 sm:gap-4",
    question: "text-sm sm:text-base font-semibold text-slate-800 leading-snug",
    questionOpen: "text-orange-600",
    icon: "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 transition-all duration-200",
    iconOpen: "bg-orange-500 text-white rotate-180",
    answer: "px-4 sm:px-5 pb-4 sm:pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed",
  },
  dark: {
    container: "w-full divide-y divide-white/[0.06]",
    item: "group",
    itemOpen: "",
    button: "w-full text-left py-5 sm:py-6 flex justify-between items-start gap-6 sm:gap-8 focus:outline-none",
    question: "text-base sm:text-lg font-medium leading-relaxed text-neutral-300 group-hover:text-white transition-colors duration-300",
    questionOpen: "text-white",
    icon: "flex-shrink-0 mt-1 w-6 h-6 flex items-center justify-center text-neutral-500 group-hover:text-neutral-400 transition-all duration-300",
    iconOpen: "text-white rotate-180",
    answer: "overflow-hidden text-neutral-400 leading-relaxed pr-8 sm:pr-14",
  },
};

export default function FAQ({ faqs, theme = "light" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = themes[theme];

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={t.container}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`${t.item} ${isOpen ? t.itemOpen : ""}`}
          >
            <button
              type="button"
              className={t.button}
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className={`${t.question} ${isOpen ? t.questionOpen : ""}`}>
                {faq.question}
              </span>
              <span className={`${t.icon} ${isOpen ? t.iconOpen : ""}`}>
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {/* Animated answer panel */}
            <div
              id={`faq-answer-${index}`}
              className={`
                grid transition-all duration-300 ease-out
                ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
              `}
            >
              <div className="overflow-hidden">
                <div className={t.answer}>
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Re-export for backwards compatibility
export { FAQ as Faqcomp, FAQ as FaqDark };
