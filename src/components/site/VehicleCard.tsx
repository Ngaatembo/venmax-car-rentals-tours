import { MessageCircle } from "lucide-react";
import type { Vehicle } from "@/data/venmax";
import { whatsappLink } from "@/data/venmax";
import { Link } from "@tanstack/react-router";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={vehicle.image}
          alt={`${vehicle.name} available from VenMax`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-foreground">
          {vehicle.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg">{vehicle.name}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{vehicle.priceLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">{vehicle.deposit}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {vehicle.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={whatsappLink(
              `Hi VenMax, I'd like more details about the ${vehicle.name} (${vehicle.priceLabel}).`,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Details
          </a>
          <Link
            to="/book"
            search={{ vehicle: vehicle.slug }}
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Check availability
          </Link>
        </div>
      </div>
    </article>
  );
}
