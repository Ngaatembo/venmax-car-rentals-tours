import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { company } from "@/data/venmax";

/**
 * Office location map. The Google Maps embed only loads after the visitor taps
 * "Show map" — Google can set its own cookies, and the site otherwise promises
 * no third-party cookies (see the Cookie Policy).
 */
export function OfficeMap({ className = "" }: { className?: string }) {
  const [show, setShow] = useState(false);
  const address = company.addressLines.join(", ");
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-card ${className}`}>
      <div className="relative aspect-[4/3] flex-1 bg-secondary sm:aspect-auto sm:min-h-[20rem]">
        {show ? (
          <iframe
            title={`Map showing the VenMax office at ${address}`}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
            style={{
              backgroundImage:
                "linear-gradient(hsl(0 0% 50% / 0.08) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50% / 0.08) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </span>
            <p className="max-w-xs text-sm font-semibold text-foreground">{address}</p>
            <button
              type="button"
              onClick={() => setShow(true)}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Show map
            </button>
            <p className="max-w-xs text-[11px] leading-snug text-muted-foreground">
              Loads Google Maps, which may set its own cookies.{" "}
              <a href="/cookie-policy" className="underline underline-offset-2">
                Cookie Policy
              </a>
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
        <span className="text-muted-foreground">VenMax office · Milton Park, Harare</span>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-primary"
        >
          <Navigation className="h-4 w-4" />
          Get directions
        </a>
      </div>
    </div>
  );
}
