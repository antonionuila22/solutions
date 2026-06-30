import { useId, useState } from "react";
import {
  SERVICES,
  ICON_PATHS,
  type IconName,
  type ServiceItem,
} from "../../data/expoProducciones";

interface ServicesCatalogProps {
  /** Título de la sección */
  title?: string;
  /** Subtítulo descriptivo de la sección */
  subtitle?: string;
}

/** Abre el modal de cotización, opcionalmente preseleccionando un servicio. */
function openQuote(serviceId?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("ep:open-quote", { detail: { serviceId } }),
  );
}

function Icon({ name, className }: { name: IconName; className?: string }) {
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const [open, setOpen] = useState(false);
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const buttonId = `${baseId}-button`;

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-white/[0.08] bg-white/[0.025] backdrop-blur",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-orange-500/25 hover:bg-white/[0.04]",
        "hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      ].join(" ")}
    >
      {/* Acento superior que aparece al hover (un solo color de marca) */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-px opacity-0",
          "bg-gradient-to-r from-transparent via-orange-500/60 to-transparent",
          "transition-opacity duration-300 group-hover:opacity-100",
          "motion-reduce:transition-none",
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-6">
        {/* Encabezado: icono + precio */}
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-300 transition-colors duration-300 group-hover:bg-orange-500/[0.16] group-hover:text-orange-200">
            <Icon name={service.icon} className="h-6 w-6" />
          </span>
          <div className="text-right">
            <p className="text-lg font-bold leading-tight text-white">
              {service.priceFrom}
            </p>
            <p className="text-xs text-white/45">{service.priceNote}</p>
          </div>
        </div>

        {/* Título + gancho */}
        <h3 className="mt-5 text-xl font-bold text-white">{service.title}</h3>
        <p className="mt-1.5 text-sm text-white/65">{service.tagline}</p>

        {/* Badges de tecnología */}
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tecnologías">
          {service.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/70"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* Toggle "Ver detalles" — texto sutil (sin caja) para no competir con el
            CTA naranja; el acordeón sigue siendo el control. */}
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={[
            "mt-5 inline-flex min-h-[44px] w-fit items-center gap-1.5 text-sm font-semibold",
            "text-white/65 transition-colors duration-200 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded-md",
            "motion-reduce:transition-none",
          ].join(" ")}
        >
          <span>{open ? "Ocultar detalles" : "Ver detalles"}</span>
          <ChevronIcon
            className={[
              "h-4 w-4 text-orange-300/80 transition-transform duration-300",
              open ? "rotate-180" : "",
              "motion-reduce:transition-none",
            ].join(" ")}
          />
        </button>

        {/* Panel expandible (acordeón animado) */}
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          hidden={!open}
          className={[
            "grid transition-all duration-300 ease-out",
            open
              ? "mt-5 grid-rows-[1fr] opacity-100"
              : "mt-0 grid-rows-[0fr] opacity-0",
            "motion-reduce:transition-none",
          ].join(" ")}
        >
          <div className="overflow-hidden">
            <p className="text-sm leading-relaxed text-white/70">
              {service.description}
            </p>

            {/* QUÉ INCLUYE */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/45">
                Qué incluye
              </h4>
              <ul className="mt-3 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                    <span className="text-sm text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CÓMO TRABAJAMOS */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/45">
                Cómo trabajamos
              </h4>
              <ol className="mt-3 space-y-3">
                {service.process.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-orange-500/25 bg-orange-500/10 text-xs font-bold text-orange-300"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm text-white/70">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* CTA — siempre visible, abre el modal de cotización preseleccionado */}
        <button
          type="button"
          onClick={() => openQuote(service.id)}
          className={[
            "mt-6 flex min-h-[44px] items-center justify-center gap-2 rounded-xl",
            "bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5",
            "text-sm font-semibold text-white shadow-lg shadow-orange-900/30",
            "transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:shadow-orange-900/50 active:scale-[0.99]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]",
            "motion-reduce:transition-none",
          ].join(" ")}
          aria-label={`Solicitar el servicio: ${service.title}`}
        >
          Solicitar este servicio
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default function ServicesCatalog({
  title = "Todo lo que tu negocio necesita, en un solo lugar",
  subtitle = "Desde tu sitio web hasta tus sistemas, automatizaciones y marca. Explora cada servicio, descubre qué incluye y cómo trabajamos.",
}: ServicesCatalogProps) {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-heading"
      className="relative w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Encabezado de sección */}
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="servicios-heading"
            className="text-display-2 text-white text-balance"
          >
            {title}
          </h2>
          <p className="mt-4 text-base text-white/70 sm:text-lg">{subtitle}</p>
        </div>

        {/* Grilla de tarjetas */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
