/**
 * Lightweight text splitting. We don't use GSAP SplitText so the engine stays
 * dependency-light and we control the exact DOM (mask-friendly word wrappers).
 *
 * Splitting is destructive, so each element is tagged `data-split-done` to stay
 * idempotent across re-scans (View Transitions can re-run effects). Inline
 * markup (a highlighted `<span>`, links, `<br>`) is preserved and recursed into,
 * so styled words inside a heading animate too.
 */

export interface SplitResult {
  words: HTMLElement[];
  chars: HTMLElement[];
}

export function splitText(el: HTMLElement, mode: "words" | "chars"): SplitResult {
  if (el.hasAttribute("data-split-done")) {
    return {
      words: Array.from(el.querySelectorAll<HTMLElement>(".anim-word-inner")),
      chars: Array.from(el.querySelectorAll<HTMLElement>(".anim-char")),
    };
  }

  const label = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  el.setAttribute("aria-label", label);

  const words: HTMLElement[] = [];
  const chars: HTMLElement[] = [];

  const buildWord = (text: string, parent: Node) => {
    const mask = document.createElement("span");
    mask.className = "anim-word";
    mask.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.className = "anim-word-inner";

    if (mode === "chars") {
      for (const ch of text) {
        const c = document.createElement("span");
        c.className = "anim-char";
        c.textContent = ch;
        inner.appendChild(c);
        chars.push(c);
      }
    } else {
      inner.textContent = text;
    }

    mask.appendChild(inner);
    parent.appendChild(mask);
    words.push(inner);
  };

  // Walk source children into `dest`, turning text into word/char spans and
  // recursing through inline elements so their text animates within the
  // original wrapper (keeping its styling).
  const process = (source: Node, dest: Node) => {
    Array.from(source.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const tokens = (node.textContent ?? "").split(/(\s+)/);
        tokens.forEach((tok) => {
          if (tok.trim() === "") {
            if (tok.length) dest.appendChild(document.createTextNode(" "));
          } else {
            buildWord(tok, dest);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elNode = node as HTMLElement;
        if (elNode.tagName === "BR" || elNode.childNodes.length === 0) {
          dest.appendChild(elNode.cloneNode(true));
        } else {
          const shell = elNode.cloneNode(false) as HTMLElement;
          process(elNode, shell);
          dest.appendChild(shell);
        }
      }
    });
  };

  const frag = document.createDocumentFragment();
  process(el, frag);
  el.textContent = "";
  el.appendChild(frag);

  el.setAttribute("data-split-done", "true");
  return { words, chars };
}
