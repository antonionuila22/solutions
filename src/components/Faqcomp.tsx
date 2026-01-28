import React, { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  faqs: FAQItem[];
};

export default function Faqcomp({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col gap-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            style={{
              borderColor: isOpen ? "#fdba74" : undefined,
              backgroundColor: isOpen ? "#fff7ed" : undefined,
              boxShadow: isOpen ? "0 4px 6px -1px rgba(0,0,0,0.1)" : undefined,
            }}
          >
            <button
              type="button"
              className="w-full text-left px-5 py-4 flex justify-between items-center gap-4"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span
                className="text-base font-semibold"
                style={{ color: isOpen ? "#ea580c" : "#1e293b" }}
              >
                {faq.question}
              </span>
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isOpen ? "#f97316" : "#f1f5f9",
                  color: isOpen ? "white" : "#64748b",
                }}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
