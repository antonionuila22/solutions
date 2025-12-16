import { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  faqs: FAQItem[];
};

export default function FaqDark({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full divide-y divide-white/[0.06]">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="group">
            <button
              className="w-full text-left py-6 flex justify-between items-start gap-8 focus:outline-none"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span
                className={`text-lg font-medium leading-relaxed transition-colors duration-300 ${
                  isOpen ? "text-white" : "text-neutral-300 group-hover:text-white"
                }`}
              >
                {faq.question}
              </span>
              <span
                className={`
                  flex-shrink-0 mt-1 w-6 h-6 flex items-center justify-center
                  transition-transform duration-300 ease-out
                  ${isOpen ? "rotate-180" : ""}
                `}
              >
                <svg
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isOpen ? "text-white" : "text-neutral-500 group-hover:text-neutral-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
            <div
              className={`
                grid transition-all duration-300 ease-out
                ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}
              `}
            >
              <div className="overflow-hidden">
                <p className="text-neutral-400 leading-relaxed pr-14">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
