import type { ReactNode } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { PageHero } from "./PageHero";
import { whatsappLink } from "@/data/venmax";

/** The three legal pages, shown in the footer and cross-linked from each legal page. */
export const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Rental Terms & Conditions" },
  { href: "/cookie-policy", label: "Cookie Policy" },
] as const;

export type LegalSection = { id: string; title: string; content: ReactNode };

/** Inline link styled for legal copy. */
export function LegalLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="font-medium text-primary underline underline-offset-2"
    >
      {children}
    </a>
  );
}

/** Bulleted list styled for legal copy. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Small labelled block inside a section card (e.g. "What you need"). */
export function LegalSubhead({ children }: { children: ReactNode }) {
  return <p className="pt-1 text-xs font-semibold uppercase tracking-wider text-foreground">{children}</p>;
}

function TocList({ sections }: { sections: LegalSection[] }) {
  return (
    <ol className="space-y-0.5">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <span className="w-5 shrink-0 text-right font-semibold text-primary">{i + 1}</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Shared layout for the legal pages: page hero, "On this page" contents (collapsible on
 * mobile, sticky on desktop), numbered section cards, then related policies and a
 * WhatsApp prompt for questions.
 */
export function LegalPage({
  title,
  description,
  updated,
  currentHref,
  intro,
  lead,
  sections,
  closing,
  whatsappMessage,
}: {
  title: string;
  description: string;
  updated: string;
  currentHref: (typeof legalLinks)[number]["href"];
  intro?: ReactNode;
  lead?: ReactNode;
  sections: LegalSection[];
  closing?: ReactNode;
  whatsappMessage: string;
}) {
  const related = legalLinks.filter((l) => l.href !== currentHref);
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={description} />
      <section className="py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
            <aside>
              <details className="group rounded-2xl border border-border bg-card lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  <span>
                    On this page{" "}
                    <span className="font-normal text-muted-foreground">
                      · {sections.length} sections
                    </span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-border px-3 py-3">
                  <TocList sections={sections} />
                </div>
              </details>
              <nav aria-label="On this page" className="sticky top-28 hidden lg:block">
                <p className="eyebrow px-2">On this page</p>
                <div className="mt-3">
                  <TocList sections={sections} />
                </div>
                <div className="mt-6 border-t border-border px-2 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Related
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {related.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} className="text-foreground/80 hover:text-primary hover:underline">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </aside>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
              {intro && (
                <div className="mt-3 max-w-3xl space-y-3 text-base leading-relaxed text-foreground/85">
                  {intro}
                </div>
              )}
              {lead}
              <ol className="mt-8 space-y-4 sm:space-y-5">
                {sections.map((s, i) => (
                  <li
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-28 rounded-2xl border border-border bg-card p-5 sm:p-7"
                  >
                    <h2 className="flex items-start gap-3 text-lg leading-snug sm:text-xl">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{s.title}</span>
                    </h2>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85 sm:pl-11 sm:text-[15px]">
                      {s.content}
                    </div>
                  </li>
                ))}
              </ol>

              {closing && (
                <div className="mt-6 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {closing}
                </div>
              )}

              <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-navy p-6 text-navy-foreground sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <p className="font-display text-lg font-semibold">Questions about this page?</p>
                  <p className="mt-1 text-sm text-navy-foreground/70">
                    Message the VenMax team on WhatsApp. See also:{" "}
                    {related.map((l, i) => (
                      <span key={l.href}>
                        {i > 0 && " · "}
                        <a href={l.href} className="underline underline-offset-2 hover:text-navy-foreground">
                          {l.label}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
                <a
                  href={whatsappLink(whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Short privacy notice shown beside any form that collects customer information. */
export function FormPrivacyNotice({
  className = "",
  opensWhatsApp = false,
}: {
  className?: string;
  opensWhatsApp?: boolean;
}) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      VenMax uses these details to reply to your enquiry and arrange your booking.
      {opensWhatsApp && " Sending saves them for the VenMax team and opens WhatsApp with your message ready — nothing is sent there until you press send."}{" "}
      See our{" "}
      <a href="/privacy-policy" className="font-medium text-primary underline underline-offset-2">
        Privacy Policy
      </a>
      .
    </p>
  );
}
