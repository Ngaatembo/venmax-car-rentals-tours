import { MessageCircle, Users, Briefcase, Cog, Snowflake } from "lucide-react";
import type { Vehicle } from "@/data/venmax";
import { whatsappLink } from "@/data/venmax";
import { Link } from "@tanstack/react-router";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const specs = [
    vehicle.seats ? { icon: Users, label: `${vehicle.seats} seats` } : null,
    vehicle.bags ? { icon: Briefcase, label: `${vehicle.bags} bags` } : null,
    vehicle.transmission ? { icon: Cog, label: vehicle.transmission } : null,
    vehicle.ac ? { icon: Snowflake, label: "A/C" } : null,
  ].filter((s): s is { icon: typeof Users; label: string } => Boolean(s));

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={vehicle.image}
          alt={`${vehicle.name} available from VenMax`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {vehicle.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow">
            {vehicle.badge}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-foreground">
          {vehicle.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg">{vehicle.name}</h3>

        {specs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {specs.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        )}

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {vehicle.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">{vehicle.priceLabel}</p>
            <p className="text-xs text-muted-foreground">{vehicle.deposit}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={whatsappLink(
                `Hi VenMax, I'd like more details about the ${vehicle.name} (${vehicle.priceLabel}).`,
              )}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ask about the ${vehicle.name} on WhatsApp`}
              className="inline-flex items-center justify-center rounded-full border border-border p-2.5 transition-colors hover:bg-secondary"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <Link
              to="/book"
              search={{ vehicle: vehicle.slug }}
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
