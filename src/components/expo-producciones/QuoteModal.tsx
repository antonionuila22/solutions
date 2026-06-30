import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ServiceWizard from "./ServiceWizard";

/**
 * QuoteModal — popup que aloja el ServiceWizard.
 *
 * Se monta UNA vez por página (client:load) y escucha:
 *   - el CustomEvent `ep:open-quote` (detail: { serviceId?, trigger? })
 *   - clics delegados sobre cualquier `[data-quote-open]` (con `data-service-id`
 *     opcional para preseleccionar un servicio)
 *   - `window.__epQuotePending` (clic ocurrido ANTES de la hidratación)
 *
 * Renderiza vía createPortal a <body>, con foco atrapado, ESC, bloqueo de
 * scroll sin salto (scrollbar-gutter), `inert` sobre el resto de la página y
 * animación de entrada/salida (motion-safe).
 */

const OPEN_EVENT = "ep:open-quote";
const PAGE_ID = "ep-page";
const LABEL_ID = "ep-quote-title";
const DESC_ID = "ep-quote-desc";
const EXIT_FALLBACK_MS = 360;

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

export default function QuoteModal() {
  const [mounted, setMounted] = useState(false); // ¿renderizar el portal?
  const [entered, setEntered] = useState(false); // data-state open|closed
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [openToken, setOpenToken] = useState(0);

  const mountedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const downOnBackdrop = useRef(false);
  const reducedMotionRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finalizeClose = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    mountedRef.current = false;
    setMounted(false);
  }, []);

  const closeModal = useCallback(() => {
    if (!mountedRef.current) return;
    setEntered(false);
    if (reducedMotionRef.current) {
      finalizeClose();
      return;
    }
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(finalizeClose, EXIT_FALLBACK_MS);
  }, [finalizeClose]);

  const openModal = useCallback(
    (sid?: string, trigger?: HTMLElement | null) => {
      // Reabrir mientras está abierto NO reinicia el wizard (conserva avances).
      if (mountedRef.current) return;
      mountedRef.current = true;
      lastTriggerRef.current =
        trigger ?? (document.activeElement as HTMLElement | null);
      setServiceId(sid);
      setOpenToken((t) => t + 1);
      setEntered(false);
      setMounted(true);
    },
    [],
  );

  // Suscripción a disparadores (evento + delegación + cola pre-hidratación).
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onOpenEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      openModal(detail.serviceId, detail.trigger ?? null);
    };
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-quote-open]") as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      (window as unknown as { __epQuotePending?: unknown }).__epQuotePending =
        undefined;
      openModal(el.dataset.serviceId || undefined, el);
    };

    window.addEventListener(OPEN_EVENT, onOpenEvent as EventListener);
    document.addEventListener("click", onDocClick);

    const pending = (
      window as unknown as { __epQuotePending?: { serviceId?: string } }
    ).__epQuotePending;
    if (pending) {
      (window as unknown as { __epQuotePending?: unknown }).__epQuotePending =
        undefined;
      openModal(pending.serviceId, null);
    }

    return () => {
      window.removeEventListener(OPEN_EVENT, onOpenEvent as EventListener);
      document.removeEventListener("click", onDocClick);
      // Evita que un valor pendiente sobreviva al desmontaje (p. ej. ClientRouter).
      (window as unknown as { __epQuotePending?: unknown }).__epQuotePending =
        undefined;
    };
  }, [openModal]);

  // Efectos de apertura: animación, bloqueo de scroll, inert y foco.
  useEffect(() => {
    if (!mounted) return;

    const raf = requestAnimationFrame(() => setEntered(true));

    const html = document.documentElement;
    html.classList.add("ep-modal-open");

    const page = document.getElementById(PAGE_ID);
    if (page) {
      page.setAttribute("inert", "");
      page.setAttribute("aria-hidden", "true");
    }

    const focusRaf = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(focusRaf);
      html.classList.remove("ep-modal-open");
      if (page) {
        page.removeAttribute("inert");
        page.removeAttribute("aria-hidden");
      }
      const trigger = lastTriggerRef.current;
      if (trigger && document.contains(trigger)) {
        trigger.focus();
      }
    };
  }, [mounted]);

  // Aborta cualquier temporizador de salida pendiente al desmontar.
  useEffect(
    () => () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    },
    [],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeModal();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = getFocusable(dialogRef.current);
    if (focusables.length === 0) {
      e.preventDefault();
      dialogRef.current?.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    } else if (!dialogRef.current?.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }

  function onOverlayPointerDown(e: React.PointerEvent) {
    downOnBackdrop.current = e.target === backdropRef.current;
  }
  function onOverlayPointerUp(e: React.PointerEvent) {
    if (downOnBackdrop.current && e.target === backdropRef.current) {
      closeModal();
    }
    downOnBackdrop.current = false;
  }

  function onDialogTransitionEnd(e: React.TransitionEvent) {
    if (e.target !== dialogRef.current) return;
    if (!entered) finalizeClose();
  }

  if (!mounted) return null;

  const state = entered ? "open" : "closed";

  return createPortal(
    <div
      className="ep-modal-root fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto p-0 font-poppins sm:items-center sm:p-6"
      onPointerDown={onOverlayPointerDown}
      onPointerUp={onOverlayPointerUp}
    >
      <style>{`
        /* Colores de superficie GARANTIZADOS aquí (viajan con el JS del
           componente, no con el bundle de Tailwind): si una caché vieja o un
           service worker sirven CSS obsoleto, el modal igual se ve sólido y
           oscuro en iOS — nunca lavado/translúcido. */
        .ep-modal-root { color-scheme: dark; }
        .ep-modal-backdrop {
          opacity: 0;
          background-color: rgba(5, 5, 10, 0.9);
          transition: opacity 200ms ease;
        }
        .ep-modal-backdrop[data-state="open"] { opacity: 1; }
        .ep-modal-dialog {
          background-color: #14141c;
          color: #fff;
          isolation: isolate;
          opacity: 0;
          transform: translateY(100%);
          transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* Estado abierto sin transform (none) para no crear un bloque contenedor
           que rompería el position:sticky del progreso/footer del wizard. */
        .ep-modal-dialog[data-state="open"] { opacity: 1; transform: none; }
        @media (min-width: 640px) {
          .ep-modal-dialog {
            transform: translateY(12px) scale(0.98);
            transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1),
                        transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          .ep-modal-dialog[data-state="open"] { transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ep-modal-backdrop,
          .ep-modal-dialog {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div
        ref={backdropRef}
        data-state={state}
        aria-hidden="true"
        className="ep-modal-backdrop absolute inset-0 bg-[#05050a]/80"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={LABEL_ID}
        aria-describedby={DESC_ID}
        tabIndex={-1}
        data-state={state}
        onKeyDown={onKeyDown}
        onTransitionEnd={onDialogTransitionEnd}
        className="ep-modal-dialog relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#14141c] text-white shadow-2xl shadow-black/60 sm:max-w-2xl sm:rounded-2xl"
      >
        {/* Asa (solo móvil) */}
        <div
          className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-white/20 sm:hidden"
          aria-hidden="true"
        />

        {/* Encabezado */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-8">
          <div className="min-w-0">
            <h2 id={LABEL_ID} className="text-base font-semibold text-white">
              Solicita tu cotización
            </h2>
            <p id={DESC_ID} className="mt-0.5 text-xs text-white/50">
              Respuesta en menos de 24 horas, sin compromiso
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeModal}
            aria-label="Cerrar"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition-colors duration-200 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Cuerpo desplazable */}
        <div
          data-scroll
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        >
          <ServiceWizard
            key={openToken}
            variant="modal"
            preselectedServiceId={serviceId}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
