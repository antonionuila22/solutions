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
    <div className="w-full space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.03] transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05]"
        >
          <button
            className="w-full text-left px-6 py-5 text-lg font-medium text-white flex justify-between items-center gap-4"
            onClick={() => toggle(index)}
          >
            <span>{faq.question}</span>
            <span className={`text-white/60 text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
              +
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 pb-6 text-neutral-400 text-base leading-relaxed">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
