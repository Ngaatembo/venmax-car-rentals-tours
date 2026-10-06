/**
 * Admin-editable page text (About, For Diaspora, and the three legal pages).
 *
 * Everything is stored in the same `site_content` key/value table as the other website
 * settings and edited in /admin/content → Pages. Each value has a built-in default equal
 * to the current wording, so a blank field simply keeps the website as it is.
 */
import { useMemo, type ReactNode } from "react";
import { Bullets, LegalLink, type LegalSection } from "@/components/site/LegalPage";
import { company } from "@/data/venmax";
import { fillTokens, policies, useRawSiteContent, useSiteSettings } from "@/lib/site-settings";

// ---------------------------------------------------------------------------
// About + For Diaspora page text
// ---------------------------------------------------------------------------

export const PAGE_DEFAULTS = {
  about_hero_title: "Driving a brighter future together",
  about_hero_description: "Who we are, what we stand for, and the team behind every VenMax journey.",
  about_story: company.aboutParagraphs.join("\n\n"),
  about_target_market: company.targetMarket,
  about_brand_quote: company.brandQuote,
  about_vision: company.vision,
  about_mission: company.mission,
  about_core_values: company.coreValues.map((v) => `${v.title}: ${v.description}`).join("\n"),
  about_offer: company.whatWeOffer.join("\n"),
  about_leadership: company.leadership,

  diaspora_hero_title: "Rent Your Car in Zimbabwe Before You Arrive.",
  diaspora_hero_description:
    "Planning a trip to Zimbabwe from abroad? VenMax makes it easy to arrange your vehicle before you land, with everything handled from start to finish on WhatsApp.",
  diaspora_heading: "Coming to Zimbabwe? Arrange your rental before you arrive.",
  diaspora_description:
    "Whether you're visiting family, attending an event, travelling for business or exploring Zimbabwe, you can arrange your rental with VenMax before your trip — from start to finish on WhatsApp.",
} as const;

export type PageKey = keyof typeof PAGE_DEFAULTS;

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** The About / Diaspora wording the website should show right now (admin text or default). */
export function usePageContent() {
  const raw = useRawSiteContent();
  return useMemo(() => {
    const get = (key: PageKey): string => raw[key]?.trim() || PAGE_DEFAULTS[key];
    return {
      aboutHeroTitle: get("about_hero_title"),
      aboutHeroDescription: get("about_hero_description"),
      aboutParagraphs: get("about_story")
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
        .filter(Boolean),
      targetMarket: get("about_target_market"),
      brandQuote: get("about_brand_quote"),
      vision: get("about_vision"),
      mission: get("about_mission"),
      coreValues: lines(get("about_core_values")).map((line) => {
        const i = line.indexOf(":");
        return i > 0
          ? { title: line.slice(0, i).trim(), description: line.slice(i + 1).trim() }
          : { title: line, description: "" };
      }),
      whatWeOffer: lines(get("about_offer")),
      leadership: get("about_leadership"),
      diasporaHeroTitle: get("diaspora_hero_title"),
      diasporaHeroDescription: get("diaspora_hero_description"),
      diasporaHeading: get("diaspora_heading"),
      diasporaDescription: get("diaspora_description"),
    };
  }, [raw]);
}

// ---------------------------------------------------------------------------
// Legal pages (Terms & Conditions, Privacy Policy, Cookie Policy)
//
// The admin edits one block of plain text per page:
//   ## Section heading {#section-id}   (the {#…} part keeps links to the section working)
//   A paragraph (blank line between paragraphs).
//   - Bullet points start with a dash
//   [link text](https://…)  and  **bold**  are supported.
// ---------------------------------------------------------------------------

export type LegalSlug = "terms" | "privacy" | "cookie";

export const legalKeys = (slug: LegalSlug) => ({
  text: `legal_${slug}_text`,
  updated: `legal_${slug}_updated`,
});

function safeHref(href: string): string | null {
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : null;
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined && m[2] !== undefined) {
      const href = safeHref(m[2]);
      out.push(
        href ? (
          <LegalLink key={key++} href={href} external={/^https?:\/\//i.test(href)}>
            {m[1]}
          </LegalLink>
        ) : (
          m[1]
        ),
      );
    } else if (m[3] !== undefined) {
      out.push(<strong key={key++}>{m[3]}</strong>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function slugify(title: string, used: Set<string>): string {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

function renderBody(bodyLines: string[]): ReactNode {
  const nodes: ReactNode[] = [];
  let para: string[] = [];
  let bullets: string[] = [];
  const flushPara = () => {
    if (para.length) nodes.push(<p key={nodes.length}>{renderInline(para.join(" "))}</p>);
    para = [];
  };
  const flushBullets = () => {
    if (bullets.length) {
      nodes.push(<Bullets key={nodes.length} items={bullets.map((b) => renderInline(b))} />);
    }
    bullets = [];
  };
  for (const raw of bodyLines) {
    const line = raw.trim();
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    if (!line) {
      // A blank line ends a paragraph; bullets keep going so spaced-out lists stay one list.
      flushPara();
    } else if (bullet) {
      flushPara();
      bullets.push(bullet[1] ?? "");
    } else {
      flushBullets();
      para.push(line);
    }
  }
  flushPara();
  flushBullets();
  return <>{nodes}</>;
}

/** Turns the admin's plain text into the same section cards the built-in text uses. */
export function parseLegalText(text: string): LegalSection[] {
  const groups: { title: string; id: string | undefined; body: string[] }[] = [];
  for (const line of text.replace(/\r/g, "").split("\n")) {
    const heading = /^##\s+(.+?)(?:\s*\{#([a-z0-9-]+)\})?\s*$/.exec(line);
    if (heading) groups.push({ title: (heading[1] ?? "").trim(), id: heading[2], body: [] });
    else groups[groups.length - 1]?.body.push(line);
  }
  const used = new Set<string>(groups.flatMap((g) => (g.id ? [g.id] : [])));
  return groups.map((g) => ({
    id: g.id ?? slugify(g.title, used),
    title: g.title,
    content: renderBody(g.body),
  }));
}

/** Admin-written text for a legal page, or null to use the built-in wording. */
export function useLegalOverride(slug: LegalSlug): { sections: LegalSection[] | null; updated: string | null } {
  const raw = useRawSiteContent();
  const settings = useSiteSettings();
  const keys = legalKeys(slug);
  const text = raw[keys.text]?.trim() ?? "";
  const updated = raw[keys.updated]?.trim() ?? "";
  return useMemo(() => {
    const sections = text ? parseLegalText(fillTokens(text, policies(settings))) : [];
    return { sections: sections.length ? sections : null, updated: updated || null };
  }, [text, updated, settings]);
}
