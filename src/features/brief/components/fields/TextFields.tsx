import { useEffect, useRef } from "react";
import { inputClass, type FieldProps } from "../field-contract";
import type { EmailQuestion, LongTextQuestion, ShortTextQuestion } from "../../types";

/** Enfoca sin robar el scroll: la transición de pantalla ya posicionó la vista. */
function useAutoFocus<T extends HTMLElement>(enabled: boolean | undefined) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(() => ref.current?.focus({ preventScroll: true }), 120);
    return () => window.clearTimeout(id);
  }, [enabled]);
  return ref;
}

const asText = (v: unknown) => (typeof v === "string" ? v : "");

export function ShortTextField({
  question,
  value,
  onChange,
  onAdvance,
  autoFocus,
  labelledBy,
}: FieldProps<ShortTextQuestion>) {
  const ref = useAutoFocus<HTMLInputElement>(autoFocus);
  return (
    <input
      ref={ref}
      type="text"
      className={inputClass}
      value={asText(value)}
      placeholder={question.placeholder}
      aria-labelledby={labelledBy}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onAdvance();
        }
      }}
    />
  );
}

export function EmailField({
  question,
  value,
  onChange,
  onAdvance,
  autoFocus,
  labelledBy,
}: FieldProps<EmailQuestion>) {
  const ref = useAutoFocus<HTMLInputElement>(autoFocus);
  return (
    <input
      ref={ref}
      type="email"
      inputMode="email"
      autoComplete="email"
      spellCheck={false}
      className={inputClass}
      value={asText(value)}
      placeholder={question.placeholder ?? "nombre@organizacion.hn"}
      aria-labelledby={labelledBy}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onAdvance();
        }
      }}
    />
  );
}

export function LongTextField({
  question,
  value,
  onChange,
  onAdvance,
  autoFocus,
  labelledBy,
}: FieldProps<LongTextQuestion>) {
  const ref = useAutoFocus<HTMLTextAreaElement>(autoFocus);
  const text = asText(value);

  // El textarea crece con el contenido: en un formulario de una pregunta por
  // pantalla, un scroll interno de 4 líneas esconde lo que la persona escribió.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 420)}px`;
  }, [text, ref]);

  return (
    <>
      <textarea
        ref={ref}
        rows={3}
        className={`${inputClass} resize-none leading-relaxed`}
        value={text}
        placeholder={question.placeholder ?? "Escribe aquí…"}
        aria-labelledby={labelledBy}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Enter = salto de línea (es texto largo). Ctrl/Cmd+Enter avanza.
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onAdvance();
          }
        }}
      />
      <p className="mt-2 text-xs text-slate-500">
        Enter hace un salto de línea. Usa Ctrl + Enter para continuar.
      </p>
    </>
  );
}
