import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { company, whatsappLink } from "@/data/venmax";

const links = [
  { to: "/#vehicles", label: "Vehicles" },
  { to: "/#services", label: "Services" },
  { to: "/#tours", label: "Tours" },
  { to: "/#why-venmax", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/book", label: "Request a Booking" },
] as const;

export function Footer() {
  return (
    <footer className="bg-ink text-navy-foreground">
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
              Premium vehicle rentals, chauffeur services, airport transfers and tours across
              Zimbabwe — run by a local team you can reach any time.
            </p>
            <a
              href={whatsappLink("Hello VenMax, I'd like to enquire about a rental.")}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
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
                <span>{company.addressLines.join(", ")}</span>
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

        <div className="mt-14 border-t border-navy-foreground/10 pt-6 text-xs text-navy-foreground/50">
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
