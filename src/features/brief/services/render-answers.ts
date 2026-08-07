import { BLOCKS } from "../config/blocks";
import { MODULES, PRIORITY_LEVELS } from "../config/modules";
import { getVisibleAnswerable, isAnswered } from "../lib/visible-questions";
import type { AnswerMap, AnswerValue, AnswerableQuestion, BriefResponse } from "../types";

/**
 * Convierte el jsonb de respuestas en algo que una persona pueda leer: el
 * resumen previo al envío, el correo interno y la exportación en Markdown
 * salen todos de aquí, así que las tres vistas nunca se contradicen.
 *
 * Solo se incluyen las preguntas VISIBLES: un brief que enumera las cinco
 * preguntas de redes sociales cuando el proyecto no incluye redes es ruido.
 */

export interface RenderedItem {
  id: string;
  title: string;
  /** Líneas ya legibles. Vacío = sin responder. */
  lines: string[];
  answered: boolean;
  required: boolean;
}

export interface RenderedBlock {
  id: string;
  title: string;
  items: RenderedItem[];
}

const labelOf = (
  options: readonly { value: string; label: string }[],
  value: string
): string => options.find((o) => o.value === value)?.label ?? value;

function linesFor(q: AnswerableQuestion, value: AnswerValue | undefined): string[] {
  if (!isAnswered(q, value)) return [];
  switch (q.type) {
    case "shortText":
    case "longText":
    case "email":
      return String(value).split("\n").filter((l) => l.trim().length > 0);
    case "singleChoice":
      return [labelOf(q.options, String(value))];
    case "multiChoice":
      return (value as string[]).map((v) => labelOf(q.options, v));
    case "ratingScale":
      return [`${value} de ${q.max}`];
    case "priorityMatrix": {
      const map = value as Record<string, string>;
      // Agrupado por nivel, no por módulo: así se lee el alcance de un vistazo.
      const out: string[] = [];
      for (const level of PRIORITY_LEVELS) {
        const mods = q.moduleIds
          .filter((id) => map[id] === level.value)
          .map((id) => MODULES.find((m) => m.id === id)?.label ?? id);
        if (mods.length > 0) out.push(`${level.label} (${mods.length}): ${mods.join("; ")}`);
      }
      return out;
    }
    case "accessChecklist": {
      const map = value as Record<string, { disponible: string; responsable: string }>;
      return q.items
        .filter((item) => map[item.id]?.disponible)
        .map((item) => {
          const e = map[item.id];
          const disp = labelOf(q.availabilityOptions, e.disponible);
          const resp = e.responsable?.trim();
          return `${item.label} — ${disp}${resp ? ` · responsable: ${resp}` : ""}`;
        });
    }
    case "repeater": {
      const rows = value as Record<string, string>[];
      return rows.map((row) =>
        q.fields
          .map((f) => {
            const raw = (row[f.key] ?? "").trim();
            if (!raw) return null;
            return `${f.label}: ${f.options ? labelOf(f.options, raw) : raw}`;
          })
          .filter(Boolean)
          .join(" · ")
      );
    }
  }
}

export function toBlocks(answers: AnswerMap): RenderedBlock[] {
  const visible = getVisibleAnswerable(answers);
  const blocks: RenderedBlock[] = [];
  for (const block of BLOCKS) {
    const items = visible
      .filter((q) => q.block === block.id)
      .map<RenderedItem>((q) => {
        const lines = linesFor(q, answers[q.id]);
        return {
          id: q.id,
          title: q.title,
          lines,
          answered: lines.length > 0,
          required: q.required,
        };
      });
    if (items.length > 0) blocks.push({ id: block.id, title: block.title, items });
  }
  return blocks;
}

const SIN_RESPUESTA = "_Sin responder._";

export function renderBriefMarkdown(response: BriefResponse): string {
  const fecha = new Date(response.completed_at ?? response.created_at).toLocaleDateString(
    "es-HN",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const head = [
    `# Brief de descubrimiento — ${response.organization}`,
    "",
    `- **Completado por:** ${response.contact_name ?? "No indicado"}`,
    `- **Correo:** ${response.contact_email ?? "No indicado"}`,
    `- **Fecha:** ${fecha}`,
    `- **Avance:** ${response.progress}%`,
    "",
  ];
  const body: string[] = [];
  for (const block of toBlocks(response.answers)) {
    body.push(`## ${block.title}`, "");
    for (const item of block.items) {
      body.push(`### ${item.title}`, "");
      if (!item.answered) body.push(SIN_RESPUESTA, "");
      else {
        for (const line of item.lines) body.push(`- ${line}`);
        body.push("");
      }
    }
  }
  return [...head, ...body].join("\n");
}

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** HTML del correo interno. Estilos en línea: los clientes de correo ignoran <style>. */
export function renderBriefHtml(response: BriefResponse): string {
  const parts: string[] = [
    `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0f172a;max-width:680px">`,
    `<h1 style="font-size:20px;margin:0 0 4px">Brief de descubrimiento — ${esc(response.organization)}</h1>`,
    `<p style="margin:0 0 16px;color:#475569;font-size:14px">`,
    `${esc(response.contact_name ?? "Sin nombre")} · ${esc(response.contact_email ?? "sin correo")} · avance ${response.progress}%`,
    `</p>`,
  ];
  for (const block of toBlocks(response.answers)) {
    parts.push(
      `<h2 style="font-size:15px;text-transform:uppercase;letter-spacing:.04em;color:#f97316;margin:24px 0 8px">${esc(block.title)}</h2>`
    );
    for (const item of block.items) {
      parts.push(
        `<p style="margin:12px 0 2px;font-weight:600;font-size:14px">${esc(item.title)}</p>`
      );
      if (!item.answered) {
        parts.push(`<p style="margin:0;color:#94a3b8;font-size:14px">Sin responder.</p>`);
      } else {
        parts.push(
          `<ul style="margin:0;padding-left:18px;font-size:14px;color:#334155">${item.lines
            .map((l) => `<li style="margin:2px 0">${esc(l)}</li>`)
            .join("")}</ul>`
        );
      }
    }
  }
  parts.push(`</div>`);
  return parts.join("");
}
