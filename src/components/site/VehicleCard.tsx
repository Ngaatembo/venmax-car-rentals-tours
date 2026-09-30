import { useState } from "react";
import { MessageCircle, Users, Briefcase, Cog, Snowflake, Fuel } from "lucide-react";
import type { Vehicle } from "@/data/venmax";
import { vehicleCardMessage, vehicleDetailMessage, whatsappLink } from "@/data/venmax";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

function getSpecs(vehicle: Vehicle) {
  return [
    vehicle.seats ? { icon: Users, label: `${vehicle.seats} seats` } : null,
    vehicle.bags ? { icon: Briefcase, label: `${vehicle.bags} bags` } : null,
    vehicle.transmission ? { icon: Cog, label: vehicle.transmission } : null,
    vehicle.fuelType ? { icon: Fuel, label: vehicle.fuelType } : null,
    vehicle.ac ? { icon: Snowflake, label: "A/C" } : null,
  ].filter((s): s is { icon: typeof Users; label: string } => Boolean(s));
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = [vehicle.image, ...(vehicle.gallery ?? [])];
  const specs = getSpecs(vehicle);
  const isTruck = /truck/i.test(vehicle.category);
  // Avoid repeating the category when it is already included at the end of the vehicle name.
  // Example: "Toyota Hilux D4D Truck" + "Truck" badge -> "Toyota Hilux D4D" + "Truck".
  const displayName = vehicle.name.replace(new RegExp(`\\s+${vehicle.category}import { useState } from "react";
import { MessageCircle, Users, Briefcase, Cog, Snowflake, Fuel } from "lucide-react";
import type { Vehicle } from "@/data/venmax";
import { vehicleCardMessage, vehicleDetailMessage, whatsappLink } from "@/data/venmax";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

function getSpecs(vehicle: Vehicle) {
  return [
    vehicle.seats ? { icon: Users, label: `${vehicle.seats} seats` } : null,
    vehicle.bags ? { icon: Briefcase, label: `${vehicle.bags} bags` } : null,
    vehicle.transmission ? { icon: Cog, label: vehicle.transmission } : null,
    vehicle.fuelType ? { icon: Fuel, label: vehicle.fuelType } : null,
    vehicle.ac ? { icon: Snowflake, label: "A/C" } : null,
  ].filter((s): s is { icon: typeof Users; label: string } => Boolean(s));
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [open, setOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = [vehicle.image, ...(vehicle.gallery ?? [])];
, "i"), "");
  const availabilityNote =
    vehicle.status && vehicle.status !== "available" ? "Availability on request" : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View details for ${displayName}`}
        className="relative aspect-[4/3] overflow-hidden bg-secondary text-left"
      >
        <img
          src={vehicle.image}
          alt={`${displayName} available from VenMax`}
          loading="lazy"
          width={1024}
          height={768}
          style={vehicle.imagePosition ? { objectPosition: vehicle.imagePosition } : undefined}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {vehicle.badge && vehicle.badge.trim().toLowerCase() !== vehicle.category.trim().toLowerCase() && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow">
            {vehicle.badge}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-foreground">
          {vehicle.category}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg">{displayName}</h3>

        <div className="mt-2">
          <p className="text-xl font-semibold text-primary">{vehicle.priceLabel}</p>
          <p className="text-sm text-muted-foreground">{vehicle.deposit}</p>
        </div>

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
        {availabilityNote && (
          <p className="mt-2 text-xs font-medium text-muted-foreground">{availabilityNote}</p>
        )}

        <div className="mt-5 grid gap-2">
          <a
            href={whatsappLink(vehicleCardMessage(vehicle))}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Book this vehicle on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View details
          </button>
        </div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setActivePhoto(0);
        }}
      >
        <DialogContent className="max-h-[92svh] overflow-y-auto p-0 sm:max-w-lg">
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={photos[activePhoto] ?? vehicle.image}
              alt={displayName}
              style={
                activePhoto === 0 && vehicle.imagePosition
                  ? { objectPosition: vehicle.imagePosition }
                  : undefined
              }
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy-foreground">
              {isTruck ? "Truck" : vehicle.category}
            </span>
          </div>
          {photos.length > 1 && (
            <div className="flex gap-2 px-6 pt-4">
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  aria-label={`Show photo ${i + 1} of ${vehicle.name}`}
                  aria-current={i === activePhoto}
                  className={`h-14 w-20 overflow-hidden rounded-lg border-2 ${
                    i === activePhoto ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="p-6 pt-2">
            <DialogTitle className="text-xl">{displayName}</DialogTitle>
            <DialogDescription className="mt-2">{vehicle.description}</DialogDescription>
            <div className="mt-4 flex items-baseline justify-between gap-3 rounded-xl bg-secondary/60 p-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Daily rate</p>
                <p className="text-2xl font-semibold text-primary">{vehicle.priceLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Deposit</p>
                <p className="text-sm font-semibold">{vehicle.deposit}</p>
              </div>
            </div>
            {specs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {specs.map(({ icon: Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-1.5">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                ))}
              </div>
            )}
            {vehicle.features && vehicle.features.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {vehicle.features.map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-6 font-display text-base font-semibold">Interested in this vehicle?</p>
            <a
              href={whatsappLink(vehicleDetailMessage(vehicle))}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Book on WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Availability and booking requirements are confirmed with the VenMax team on WhatsApp.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
