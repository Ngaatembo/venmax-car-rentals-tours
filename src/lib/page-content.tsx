/**
 * Admin-editable page text (About, For Diaspora, and the three legal pages).
 *
 * Everything is stored in the same `site_content` key/value table as the other website
 * settings and edited in /admin/content → Pages. Each value has a built-in default equal
 * to the current wording, so a blank field simply keeps the website as it is.
 */
import { useMemo, type ReactNode } from "react";
import { Bullets, LegalLink, type LegalSection } from "@/components/site/LegalPage";
import { company, howItWorks, trustPoints, valueCards } from "@/data/venmax";
import { fillTokens, policies, useRawSiteContent, useSiteSettings } from "@/lib/site-settings";

const VERIFICATION_SENTENCE =
  "To provide a safe and secure experience for everyone, we may occasionally ask for additional verification, such as professional background or personal details, before confirming your vehicle.";

/**
 * Admin-saved text can contain older verification wording. Swap it for the approved wording so
 * the site never shows the superseded statements.
 */
export function stripOldVerificationWording(text: string): string {
  return text
    .replace(
      /In some instances,? we may (?:also )?ask for (?:your )?personal social[- ]media handles and professional background,? for further identity verification\.?/gi,
      VERIFICATION_SENTENCE,
    )
    .replace(
      /\s*VenMax does not require access to your social[- ]media profiles, private photos, social-media logins or full bank transaction history for rental verification\.?/gi,
      "",
    );
}

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

  home_welcome_title: "It's Your Journey",
  home_welcome_text:
    "From arriving at RGM International Airport to exploring Zimbabwe at your own pace, VenMax makes getting around simple, comfortable and reliable — a local team, a well-maintained fleet, and a journey that starts the moment you land.",
  home_welcome_places: "Harare · Victoria Falls · Hwange · Great Zimbabwe · and beyond",

  home_price_title: "Lower deposits. Fairer rates. Drive away sooner.",
  home_price_description:
    "Pay less upfront. Our small and mid SUVs need just a $100 refundable deposit, lower than most car hire companies in Zimbabwe.",
  home_price1_heading: "Deposits below market rates",
  home_price1_value: "From $100",
  home_price1_label: "Refundable deposit on small and mid SUVs",
  home_price1_text: "Lower than most in the market, and shown clearly on every vehicle.",
  home_price2_heading: "Affordable rental rates",
  home_price2_value: "From $40/day",
  home_price2_label: "Value-focused options for local and diaspora customers",
  home_price2_text: "Clear daily rates and deposits, so you know the cost before you book.",

  home_value_cards: valueCards.map((c) => `${c.title}: ${c.description}`).join("\n"),
  home_trust_points: trustPoints.map((t) => `${t.title}: ${t.description}`).join("\n"),

  home_why_title: "Harare's Most Trusted Car Rental.",
  home_why_description:
    "A Zimbabwean-owned company built on straightforward, honest service — real vehicles, real prices, and local knowledge that makes travel here effortless.",
  home_why_list:
    "Zimbabwean-owned, local knowledge\nAll vehicles insured and well maintained\nTransparent pricing, no hidden fees\nFree vehicle pickup at the airport for hired vehicles",
  home_promise_title: "Drive More. Spend Less. Travel Better.",

  how_title: "Four simple steps",
  how_description: "Everything can be arranged conveniently through WhatsApp.",
  how_steps: howItWorks.map((h) => `${h.title}: ${h.description}`).join("\n"),

  req_title: "Rental requirements and common questions",
  req_description:
    "Simple, straightforward requirements — kept easy to read so you can get on the road quickly.",
  req_cards: [
    "Driver Age: Self-drive customers must be {min_age} years or older. No age limit applies when you book a VenMax chauffeur.",
    "Driver's Licence: The driver's licence must have been held for at least {licence_years} years.",
    "Identification & Next of Kin: Customers provide both a valid ID and passport, plus next of kin details in case of an emergency.",
    "Proof of Residence or Employment: Proof of residence or employment is required.",
    "Insurance & Damage: All VenMax vehicles are insured. Minor damage that insurance doesn't cover, such as scratches, may be deducted from the deposit.",
    "Fuel: Customers pay for fuel used during their rental and return the vehicle with the same fuel level.",
    "Cross-Border Travel: {cross_border}",
    "Vehicle Items: Lost vehicle items may be charged at applicable market rates.",
  ].join("\n"),

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

function titled(value: string): { title: string; description: string }[] {
  return lines(value).map((line) => {
    const i = line.indexOf(":");
    return i > 0
      ? { title: line.slice(0, i).trim(), description: line.slice(i + 1).trim() }
      : { title: line, description: "" };
  });
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
      welcomeTitle: get("home_welcome_title"),
      welcomeText: get("home_welcome_text"),
      welcomePlaces: get("home_welcome_places"),
      priceTitle: get("home_price_title"),
      priceDescription: get("home_price_description"),
      priceCards: [
        {
          heading: get("home_price1_heading"),
          value: get("home_price1_value"),
          label: get("home_price1_label"),
          text: get("home_price1_text"),
        },
        {
          heading: get("home_price2_heading"),
          value: get("home_price2_value"),
          label: get("home_price2_label"),
          text: get("home_price2_text"),
        },
      ],
      valueCards: titled(get("home_value_cards")),
      trustPoints: titled(get("home_trust_points")),
      whyTitle: get("home_why_title"),
      whyDescription: get("home_why_description"),
      whyList: lines(get("home_why_list")),
      promiseTitle: get("home_promise_title"),
      howTitle: get("how_title"),
      howDescription: get("how_description"),
      howSteps: titled(get("how_steps")),
      reqTitle: get("req_title"),
      reqDescription: get("req_description"),
      reqCards: titled(stripOldVerificationWording(get("req_cards"))),
      diasporaHeroTitle: get("diaspora_hero_title"),
      diasporaHeroDescription: get("diaspora_hero_description"),
      diasporaHeading: get("diaspora_heading"),
      diasporaDescription: get("diaspora_description"),
    };
  }, [raw]);
}

/** Rental requirement cards (numbered 01, 02 …) with {placeholders} filled from Rates & Policies. */
export function useRequirements() {
  const content = usePageContent();
  const p = policies(useSiteSettings());
  return content.reqCards.map((c, i) => ({
    number: String(i + 1).padStart(2, "0"),
    title: c.title,
    description: fillTokens(c.description, p),
  }));
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
  const rawText = raw[keys.text]?.trim() ?? "";
  const normalized = slug === "terms"
    ? rawText
        .replace(
          /VenMax may request the documents and details listed above to verify rental eligibility, prevent fraud or vehicle theft, protect customers and the fleet, and fulfil the rental agreement\.\s*VenMax does not require access to your social media profiles, private photos, social-media logins or full bank transaction history for rental verification\.?/gi,
          "VenMax may request the documents and details listed above to verify rental eligibility, prevent fraud or vehicle theft, protect customers and the fleet, and fulfil the rental agreement. To provide a safe and secure experience for everyone, we may occasionally ask for additional verification, such as professional background or personal details, before confirming your vehicle. Please rest assured that we value your trust; your information is held in the strictest confidence and is always handled safely in accordance with our Privacy Policy.",
        )
        .replace(
          /Harare airport shuttle\s*[—-]\s*\$30 per trip\.?/gi,
          "Harare airport shuttle — $30 per trip, inclusive of fuel, for destinations within Harare only.",
        )
    : slug === "privacy"
      ? rawText.replace(
          /VenMax Car Rental & Tours \("VenMax", "we", "us"\) is/gi,
          "VenMax Car Rental & Tours is",
        )
      : rawText;
  const text = stripOldVerificationWording(normalized);
  const updated = raw[keys.updated]?.trim() ?? "";
  return useMemo(() => {
    const sections = text ? parseLegalText(fillTokens(text, policies(settings))) : [];
    return { sections: sections.length ? sections : null, updated: updated || null };
  }, [text, updated, settings]);
}
