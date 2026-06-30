import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CODEBRAND_SALES, ICON_PATHS, type IconName } from "../../data/expoProducciones";

interface IconProps {
  name: IconName;
  className?: string;
}

function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface CodebrandSalesShowcaseProps {
  /** id del ancla de la sección (opcional) */
  id?: string;
}

// Acentos de etapa on-brand: naranja en el flujo, teal para "Ganados" (éxito).
const stageAccents = [
  "from-orange-400 to-amber-400",
  "from-orange-400 to-amber-400",
  "from-orange-400 to-amber-400",
  "from-teal-400 to-emerald-400",
];

export default function CodebrandSalesShowcase({
  id = "codebrand-sales",
}: CodebrandSalesShowcaseProps) {
  const [activeStage, setActiveStage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMounted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // total de tarjetas previas por columna, para escalonar la animación global
  let cardOffset = 0;

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby="cbsales-heading"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <style>{`
        @keyframes ep-cbsales-enter {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ep-cbsales-card {
          opacity: 0;
          animation: ep-cbsales-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .ep-cbsales-card { opacity: 1 !important; animation: none !important; }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        {/* ── Columna izquierda ── */}
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center rounded-full border border-orange-500/18 bg-orange-500/[0.08] px-3 py-1 text-xs font-semibold text-orange-300">
            {CODEBRAND_SALES.badge}
          </span>

          <h2
            id="cbsales-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {CODEBRAND_SALES.name}
          </h2>

          <p className="mt-3 text-lg font-medium text-white/90 sm:text-xl">
            {CODEBRAND_SALES.tagline}
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
            {CODEBRAND_SALES.description}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {CODEBRAND_SALES.includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-400/15 text-teal-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("ep:open-quote", {
                    detail: { serviceId: "codebrand-sales" },
                  }),
                )
              }
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
            >
              Quiero Codebrand Sales
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* features mini-grid */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CODEBRAND_SALES.features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#111117] p-4 transition-colors duration-300 hover:border-white/20 hover:bg-[#17171e]"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-300">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Columna derecha: mock Kanban ── */}
        <div className="relative">
          <div
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-orange-500/10 via-transparent to-teal-400/10"
            aria-hidden="true"
          />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111117] shadow-2xl shadow-black/40">
            {/* barra de ventana */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" aria-hidden="true" />
              <div className="ml-3 flex items-center gap-2 text-xs font-medium text-white/50">
                <Icon name="saas" className="h-3.5 w-3.5 text-teal-400" />
                <span>Codebrand Sales · Pipeline</span>
              </div>
            </div>

            {/* tablero */}
            <div
              className="flex gap-3 overflow-x-auto p-4 [scrollbar-width:thin] sm:gap-4 snap-x snap-mandatory"
              role="list"
              aria-label="Etapas del pipeline de ventas"
            >
              {CODEBRAND_SALES.pipeline.map((column, colIndex) => {
                const isActive = activeStage === colIndex;
                const accent = stageAccents[colIndex % stageAccents.length];
                return (
                  <div
                    key={column.stage}
                    role="listitem"
                    className="flex w-40 flex-none snap-start flex-col sm:w-44"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveStage(colIndex)}
                      onMouseEnter={() => setActiveStage(colIndex)}
                      onFocus={() => setActiveStage(colIndex)}
                      aria-pressed={isActive}
                      className={`mb-3 flex min-h-[44px] items-center justify-between rounded-xl border px-3 py-2 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 ${
                        isActive
                          ? "border-white/20 bg-white/[0.08]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full bg-gradient-to-r ${accent}`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-semibold text-white">{column.stage}</span>
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/60">
                        {column.deals.length}
                      </span>
                    </button>

                    <div
                      className={`flex flex-col gap-2.5 rounded-xl p-2 transition-colors duration-300 ${
                        isActive ? "bg-white/[0.04]" : "bg-transparent"
                      }`}
                    >
                      {column.deals.map((deal, dealIndex) => {
                        const globalIndex = cardOffset + dealIndex;
                        const cardStyle: CSSProperties =
                          mounted && !reducedMotion
                            ? { animationDelay: `${globalIndex * 80}ms` }
                            : reducedMotion
                            ? {}
                            : { opacity: 0 };
                        return (
                          <article
                            key={deal}
                            style={cardStyle}
                            className={`ep-cbsales-card group cursor-default rounded-xl border border-white/10 bg-[#1a1a22] p-3 transition-all duration-300 ${
                              isActive
                                ? "border-white/20 shadow-lg shadow-black/30"
                                : "hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium text-white">
                                {deal}
                              </span>
                              <span
                                className={`h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-r ${accent}`}
                                aria-hidden="true"
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="flex items-center gap-1 text-[11px] text-white/45">
                                <Icon name="crm" className="h-3 w-3" />
                                Lead
                              </span>
                              <span className="text-[11px] font-medium text-teal-300/90">
                                ${(globalIndex + 3) * 7}0
                              </span>
                            </div>
                          </article>
                        );
                      })}
                      {/* acumular offset tras renderizar columna */}
                      {(() => {
                        cardOffset += column.deals.length;
                        return null;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-white/35 lg:hidden">
            Desliza para ver todas las etapas →
          </p>
        </div>
      </div>
    </section>
  );
}
