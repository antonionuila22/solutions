import { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  faqs: FAQItem[];
};

export default function Faqcomp({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-xl border border-orange-200 bg-white shadow-sm transition-all"
        >
          <button
            className="w-full text-left px-6 py-4 text-lg font-medium text-cyan-900 flex justify-between items-center hover:text-orange-500 transition-colors"
            onClick={() => toggle(index)}
          >
            {faq.question}
            <span className="text-orange-400 text-xl">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-6 pb-6 text-gray-700 text-base">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
