/**
 * Turns the built-in legal page sections into the plain-text format the admin edits
 * (see parseLegalText in page-content.tsx), so the editor opens pre-filled with the text
 * the website shows today. Browser only (uses DOMParser).
 */
import { renderToStaticMarkup } from "react-dom/server";
import type { LegalSection } from "@/components/site/LegalPage";

const BLOCK_TAGS = new Set(["p", "ul", "ol", "li", "div", "details", "summary", "table", "section", "h1", "h2", "h3", "h4"]);

function tagOf(node: Node): string {
  return node.nodeType === 1 ? (node as Element).tagName.toLowerCase() : "";
}

function inline(node: Node): string {
  if (node.nodeType === 3) return node.textContent ?? "";
  if (node.nodeType !== 1) return "";
  const el = node as Element;
  const tag = tagOf(el);
  // Step numbers rendered in little circles are layout, not text.
  if (tag === "span" && /^\d+$/.test((el.textContent ?? "").trim())) return "";
  const inner = Array.from(el.childNodes).map(inline).join("");
  // Stacked label/value lines inside a card (e.g. "Email" over the address) get a space.
  if (tag === "span" && /(^|\s)block(\s|$)/.test(el.getAttribute("class") ?? "")) return ` ${inner} `;
  if (tag === "a") {
    const href = el.getAttribute("href");
    const label = inner.replace(/\s+/g, " ").trim();
    return href && label ? `[${label}](${href})` : inner;
  }
  if (tag === "strong" || tag === "b") {
    const t = inner.replace(/\s+/g, " ").trim();
    return t ? `**${t}**` : inner;
  }
  return inner;
}

function clean(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function hasBlockChild(el: Element): boolean {
  return Array.from(el.querySelectorAll("*")).some((c) => BLOCK_TAGS.has(tagOf(c)));
}

function blocks(parent: Element, out: string[]) {
  let run = "";
  const flush = () => {
    const t = clean(run);
    if (t) out.push(t);
    run = "";
  };
  for (const child of Array.from(parent.childNodes)) {
    if (child.nodeType === 3) {
      run += child.textContent ?? "";
      continue;
    }
    if (child.nodeType !== 1) continue;
    const el = child as Element;
    const tag = tagOf(el);
    if (tag === "ul" || tag === "ol") {
      flush();
      const items = Array.from(el.children)
        .map((li) => clean(inline(li)))
        .filter(Boolean)
        .map((t) => `- ${t}`);
      if (items.length) out.push(items.join("\n"));
    } else if (tag === "table") {
      flush();
      const rows = Array.from(el.querySelectorAll("tbody tr"))
        .map((tr) =>
          Array.from(tr.children)
            .map((c) => clean(c.textContent ?? ""))
            .filter(Boolean)
            .join(" — "),
        )
        .filter(Boolean)
        .map((t) => `- ${t}`);
      if (rows.length) out.push(rows.join("\n"));
    } else if (tag === "summary") {
      flush();
      const t = clean(inline(el));
      if (t) out.push(`**${t}**`);
    } else if (tag === "p" || /^h[1-6]$/.test(tag)) {
      flush();
      const t = clean(inline(el));
      if (!t) continue;
      // Small uppercase labels ("For self-drive hire you'll need") become bold lines.
      out.push((el.getAttribute("class") ?? "").includes("uppercase") ? `**${t}**` : t);
    } else if (hasBlockChild(el)) {
      flush();
      blocks(el, out);
    } else if (el.querySelector("span.block")) {
      // A contact card: keep each one on its own line.
      flush();
      const t = clean(inline(el));
      if (t) out.push(`- ${t}`);
    } else {
      run += inline(el);
    }
  }
  flush();
}

export function sectionsToText(sections: LegalSection[]): string {
  if (typeof DOMParser === "undefined") return "";
  return sections
    .map((s) => {
      const doc = new DOMParser().parseFromString(
        `<div id="root">${renderToStaticMarkup(<>{s.content}</>)}</div>`,
        "text/html",
      );
      const out: string[] = [];
      const root = doc.getElementById("root");
      if (root) blocks(root, out);
      return `## ${s.title} {#${s.id}}\n\n${out.join("\n\n")}`;
    })
    .join("\n\n\n");
}
