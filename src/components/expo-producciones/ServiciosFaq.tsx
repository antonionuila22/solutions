import { useId, useState } from "react";
import { FAQ_ITEMS } from "../../data/expoProducciones";

interface ServiciosFaqProps {
  /** Texto del encabezado (opcional). */
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function ServiciosFaq({
  eyebrow = "Preguntas frecuentes",
  title = "Resolvemos tus dudas",
  subtitle = "Todo lo que necesitas saber antes de empezar tu proyecto con nosotros.",
}: ServiciosFaqProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const baseId = useId();

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className="mx-auto w-full max-w-3xl px-4 py-16 sm:py-20"
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .ep-faq-panel,
          .ep-faq-chevron {
            transition: none !important;
          }
        }
      `}</style>

      <header className="mb-10 text-center">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-teal-400 backdrop-blur">
          {eyebrow}
        </span>
        <h2
          id={`${baseId}-heading`}
          className="mt-4 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
          {subtitle}
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${baseId}-button-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <li
              key={item.q}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur transition-colors duration-300 hover:border-white/20"
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-white outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] sm:px-6 sm:py-5"
                  style={{ minHeight: "44px" }}
                >
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className={`ep-faq-chevron grid h-8 w-8 shrink-0 place-items-center rounded-full border text-teal-400 transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 border-orange-500/40 bg-orange-500/10 text-orange-400"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="h-4 w-4"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`ep-faq-panel grid transition-all duration-300 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-white/70 sm:px-6 sm:pb-6 sm:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
