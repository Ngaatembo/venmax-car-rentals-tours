import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { whatsappLink } from "@/data/venmax";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/#vehicles", label: "Vehicles" },
  { to: "/#services", label: "Services" },
  { to: "/#tours", label: "Tours" },
  { to: "/#why-venmax", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  // Keep the initial render deterministic for SSR and hydration; scroll/menu state updates after mount.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-navy/95 backdrop-blur" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background sm:size-12">
            <img
              src={logo}
              alt="VenMax Car Rental logo"
              width={48}
              height={48}
              className="size-full scale-[1.55] object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold text-navy-foreground">
              VenMax
            </span>
            <span className="block truncate text-[11px] uppercase tracking-[0.18em] text-navy-foreground/60">
              Car Rental & Tours
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-navy-foreground/70 transition-colors hover:text-navy-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={whatsappLink("Hello VenMax, I'd like to enquire about a rental.")}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-navy-foreground/10 bg-navy px-4 pb-6 pt-2 sm:px-6 lg:hidden">
          {navItems.map((item) => (
            <a
              key={item.to}
              href={item.to}
              className="block border-b border-navy-foreground/10 py-3.5 text-sm font-medium text-navy-foreground"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/book"
            className="mt-5 flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Request a Booking
          </Link>
        </nav>
      )}
    </header>
  );
}
