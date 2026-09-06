import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Hero "quick booking" card — a fast path into the real booking form at
 * /book. It intentionally does not talk to Supabase directly: it just
 * carries what the visitor typed into /book's search params, so the
 * existing booking schema, validation and confirmation flow (see
 * src/routes/book.tsx, src/lib/bookings.ts) stay the single source of
 * truth for what actually gets submitted.
 */
export function BookingWidget() {
  const [service, setService] = useState<"self-drive" | "chauffeur">("self-drive");
  const [pickup, setPickup] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = new URLSearchParams();
  params.set("service", service);
  if (pickup) params.set("pickup", pickup);
  if (startDate) params.set("start", startDate);
  if (endDate) params.set("end", endDate);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <Tabs value={service} onValueChange={(v) => setService(v as typeof service)}>
          <TabsList>
            <TabsTrigger value="self-drive">Self-Drive</TabsTrigger>
            <TabsTrigger value="chauffeur">Chauffeur Driven</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="hidden shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground sm:inline-block">
          Free Quote
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-medium text-muted-foreground sm:col-span-2">
          Pick-up location
          <span className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="e.g. VenMax Office, RGM Airport"
              list="pickup-location-options"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
            <datalist id="pickup-location-options">
              <option value="VenMax Office - Milton Park, Harare" />
              <option value="RGM Airport" />
              <option value="Harare CBD" />
            </datalist>
          </span>
        </label>
        <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
          Pick-up date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-medium text-muted-foreground">
          Return date
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>

      <Link
        to="/book"
        search={{
          service,
          pickup: pickup || undefined,
          start: startDate || undefined,
          end: endDate || undefined,
        }}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Get Instant Quote
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
