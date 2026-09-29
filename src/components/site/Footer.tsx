import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { company, whatsappLink } from "@/data/venmax";
import { legalLinks } from "./LegalPage";

const links = [
  { to: "/fleet", label: "Fleet" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/diaspora", label: "For Diaspora" },
  { to: "/#services", label: "Services" },
  { to: "/#requirements", label: "Rental Requirements" },
  { to: "/about", label: "About" },
  { to: "/tours", label: "Tours" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink pb-16 text-navy-foreground sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background">
                <img
                  src={logo}
                  alt="VenMax Car Rental logo"
                  loading="lazy"
                  width={48}
                  height={48}
                  className="size-full scale-[1.55] object-contain"
                />
              </span>
              <div>
                <p className="font-display text-lg font-bold">{company.shortName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-navy-foreground/60">
                  {company.tagline}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-foreground/70">
              Affordable car rental in Zimbabwe with easy WhatsApp booking — for local and
              diaspora customers.
            </p>
            <a
              href={whatsappLink("Hello VenMax, I'd like to enquire about a rental.")}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Book on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-navy-foreground/60">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.to}>
                  <a
                    href={link.to}
                    className="text-sm text-navy-foreground/70 transition-colors hover:text-navy-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-navy-foreground/60">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-navy-foreground/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    company.addressLines.join(", ")
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-navy-foreground hover:underline"
                >
                  {company.addressLines.join(", ")}
                </a>
              </li>
              {company.phones.map((phone) => (
                <li key={phone} className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                </li>
              ))}
              {company.emails.map((email) => (
                <li key={email} className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href={company.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="VenMax on Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-foreground/15 text-navy-foreground/70 hover:text-navy-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
              {company.social.instagram && (
                <a
                  href={company.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="VenMax on Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-foreground/15 text-navy-foreground/70 hover:text-navy-foreground"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              <a
                href={company.social.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="VenMax on TikTok"
                className="inline-flex h-10 items-center justify-center rounded-full border border-navy-foreground/15 px-3 text-xs font-semibold text-navy-foreground/70 hover:text-navy-foreground"
              >
                TikTok
              </a>
              <a
                href={company.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="VenMax on LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-foreground/15 text-navy-foreground/70 hover:text-navy-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-navy-foreground/10 pt-6 text-xs text-navy-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-0">
            {legalLinks.map((l, i) => (
              <span key={l.href} className="inline-flex items-center whitespace-nowrap">
                <a
                  href={l.href}
                  className="text-navy-foreground/70 hover:text-navy-foreground hover:underline"
                >
                  {l.label}
                </a>
                {i < legalLinks.length - 1 && (
                  <span aria-hidden="true" className="hidden px-2.5 text-navy-foreground/25 sm:inline">
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
