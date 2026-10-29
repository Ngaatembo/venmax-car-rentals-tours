import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, CarFront, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { vehicles } from "@/data/venmax";
import { whatsappLink } from "@/data/venmax";

export const Route = createFileRoute("/trip-planner")({
  head: () => ({
    meta: [
      { title: "Trip Planner Prototype | VenMax Car Rental & Tours" },
      {
        name: "description",
        content: "Experimental trip planner for estimating VenMax rental costs before confirming details on WhatsApp.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TripPlannerPage,
});

type FormState = {
  vehicleSlug: string;
  startDate: string;
  endDate: string;
  destinations: string;
  kilometres: string;
  customMileage: boolean;
};

function parseMoney(label: string): number | null {
  const match = label.replace(/,/g, "").match(/\$\s*(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function calendarDayDifference(start: string, end: string): number | null {
  if (!start || !end) return null;
  const startTime = Date.parse(`${start}T00:00:00Z`);
  const endTime = Date.parse(`${end}T00:00:00Z`);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) return null;
  return Math.round((endTime - startTime) / 86_400_000);
}

const FREE_KM_PER_DAY = 200;
const EXCESS_RATE_PER_KM = 0.6;

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function TripPlannerPage() {
  const [form, setForm] = useState<FormState>({
    vehicleSlug: vehicles[0]?.slug ?? "",
    startDate: "",
    endDate: "",
    destinations: "",
    kilometres: "",
    customMileage: false,
  });

  const selectedVehicle = vehicles.find((vehicle) => vehicle.slug === form.vehicleSlug);
  const days = calendarDayDifference(form.startDate, form.endDate);
  const dailyRate = selectedVehicle ? parseMoney(selectedVehicle.priceLabel) : null;
  const deposit = selectedVehicle ? parseMoney(selectedVehicle.deposit) : null;
  const distance = form.kilometres.trim() ? Number(form.kilometres) : null;
  const validDistance = distance !== null && Number.isFinite(distance) && distance >= 0;
  const quoteOnly = form.customMileage || (days !== null && days >= 30) || dailyRate === null || deposit === null;
  const includedKm = days !== null ? days * FREE_KM_PER_DAY : 0;
  const excessKm = validDistance ? Math.max(0, (distance ?? 0) - includedKm) : 0;
  const baseRental = days !== null && dailyRate !== null ? days * dailyRate : null;
  const excessCharge = validDistance ? excessKm * EXCESS_RATE_PER_KM : null;
  const estimate = baseRental !== null && excessCharge !== null ? baseRental + excessCharge : null;
  const canPrepareEnquiry =
    Boolean(selectedVehicle && form.startDate && form.endDate && days && form.destinations.trim() && validDistance);

  const breakdown = useMemo(() => {
    if (!selectedVehicle || !days || dailyRate === null || deposit === null || !validDistance || quoteOnly) return null;
    return { days, baseRental: days * dailyRate, includedKm, excessKm, excessCharge: excessKm * EXCESS_RATE_PER_KM, deposit };
  }, [selectedVehicle, days, dailyRate, deposit, validDistance, quoteOnly, includedKm, excessKm]);

  const enquiryMessage = () => {
    if (!selectedVehicle || !days || !validDistance) return "";
    const distanceText = `${distance} km`;
    const estimateText = quoteOnly || estimate === null
      ? "Please provide a quote for this trip; no automatic price is being calculated."
      : `Indicative estimate: ${money(estimate)} rental estimate + ${money(deposit ?? 0)} refundable deposit (shown separately).`;
    return [
      "Hi VenMax, I'd like to enquire about a rental using the Trip Planner prototype.",
      `Vehicle: ${selectedVehicle.name}`,
      `Pickup date: ${form.startDate}`,
      `Return date: ${form.endDate}`,
      `Estimated rental duration: ${days} day(s), using the prototype's calendar-day difference rule`,
      `Destinations: ${form.destinations.trim()}`,
      `Estimated total distance: ${distanceText}`,
      form.customMileage ? "Mileage request: please quote a customised long-distance mileage package." : "",
      estimateText,
      "Please confirm availability, the applicable rental duration rules, any long-rental discount, mileage terms and the final price. I understand this is not a booking confirmation.",
    ].filter(Boolean).join("\n");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">WebAura × VenMax · Private experiment</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">Plan your trip. Understand the costs before you enquire.</h1>
          <p className="mt-4 max-w-2xl text-base text-navy-foreground/80 sm:text-lg">
            Choose a vehicle, enter your travel dates and route, then prepare a detailed enquiry for the VenMax team to confirm.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-navy-foreground/80">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />No booking or payment is made here</span>
            <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" />Final details confirmed on WhatsApp</span>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:px-8 lg:py-12">
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-primary/10 p-3 text-primary"><CarFront className="h-5 w-5" /></span>
              <div>
                <h2 className="text-xl font-semibold">1. Choose your vehicle</h2>
                <p className="mt-1 text-sm text-muted-foreground">Published daily rates and deposits from VenMax's current fleet.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {vehicles.map((vehicle) => (
                <button
                  type="button"
                  key={vehicle.slug}
                  onClick={() => setForm((current) => ({ ...current, vehicleSlug: vehicle.slug }))}
                  aria-pressed={form.vehicleSlug === vehicle.slug}
                  className={`rounded-xl border p-3 text-left transition-colors ${form.vehicleSlug === vehicle.slug ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                >
                  <div className="flex gap-3">
                    <img src={vehicle.image} alt={vehicle.name} className="h-20 w-24 rounded-lg bg-muted object-cover" />
                    <div className="min-w-0">
                      <p className="font-semibold">{vehicle.name}</p>
                      <p className="mt-1 text-sm">{vehicle.priceLabel}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{vehicle.deposit}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-primary/10 p-3 text-primary"><CalendarDays className="h-5 w-5" /></span>
              <div>
                <h2 className="text-xl font-semibold">2. Tell us about your trip</h2>
                <p className="mt-1 text-sm text-muted-foreground">Enter the details you know. VenMax will confirm the final arrangements.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Rental start date
                <input required type="date" value={form.startDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm((current) => ({ ...current, startDate: e.target.value }))} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3 text-base" />
              </label>
              <label className="block text-sm font-medium">
                Rental return date
                <input required type="date" value={form.endDate} min={form.startDate || new Date().toISOString().slice(0, 10)} onChange={(e) => setForm((current) => ({ ...current, endDate: e.target.value }))} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3 text-base" />
              </label>
            </div>
            {form.startDate && form.endDate && !days && <p role="alert" className="mt-2 text-sm text-destructive">Return date must be after the rental start date.</p>}
            <label className="mt-4 block text-sm font-medium">
              Destinations / route
              <textarea required rows={3} value={form.destinations} onChange={(e) => setForm((current) => ({ ...current, destinations: e.target.value }))} placeholder="e.g. Harare → Mutare → Harare" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3 text-base" />
            </label>
            <label className="mt-4 block text-sm font-medium">
              Estimated total distance (km)
              <input required type="number" min="0" step="1" value={form.kilometres} onChange={(e) => setForm((current) => ({ ...current, kilometres: e.target.value }))} placeholder="e.g. 540" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3 text-base" />
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Enter your own estimate. This prototype does not claim to calculate live road distance.</span>
            </label>
            <label className="mt-4 flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
              <input type="checkbox" checked={form.customMileage} onChange={(e) => setForm((current) => ({ ...current, customMileage: e.target.checked }))} className="mt-1 h-4 w-4 accent-primary" />
              <span><span className="font-semibold">I need a customised long-distance mileage package.</span><span className="mt-1 block text-muted-foreground">VenMax prices these case by case, so the planner will request a quote instead of guessing.</span></span>
            </label>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7 lg:sticky lg:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your trip summary</p>
          <h2 className="mt-2 text-2xl font-bold">Cost estimate</h2>
          {selectedVehicle && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <img src={selectedVehicle.image} alt="" className="h-16 w-20 rounded-lg object-cover" />
              <div><p className="font-semibold">{selectedVehicle.name}</p><p className="text-sm text-muted-foreground">{selectedVehicle.priceLabel}</p></div>
            </div>
          )}
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3"><span className="text-muted-foreground">Rental duration</span><span className="font-medium">{days ? `${days} day(s)` : "Choose dates"}</span></div>
            {quoteOnly ? (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="font-semibold">A personalised quote is needed</p>
                <p className="mt-1 text-sm text-muted-foreground">{form.customMileage ? "Custom mileage packages are priced by VenMax case by case." : days && days >= 30 ? "Monthly rentals may have different pricing; unlimited mileage is advertised for rentals of one month or more." : "A verified rate is not available for this selection."}</p>
              </div>
            ) : breakdown ? (
              <>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Rental at published daily rate</span><span className="font-medium">{money(breakdown.baseRental)}</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Included mileage</span><span className="font-medium">{breakdown.includedKm.toLocaleString()} km</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Excess mileage</span><span className="font-medium">{breakdown.excessKm.toLocaleString()} km</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Excess mileage charge</span><span className="font-medium">{money(breakdown.excessCharge)}</span></div>
                <div className="border-t border-border pt-3 flex justify-between gap-3 text-base"><span className="font-semibold">Estimated rental cost</span><span className="font-bold">{money(breakdown.baseRental + breakdown.excessCharge)}</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Refundable deposit (separate)</span><span className="font-semibold">{money(breakdown.deposit)}</span></div>
                <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">Potential amount before any confirmed discounts: {money(breakdown.baseRental + breakdown.excessCharge + breakdown.deposit)} including the refundable deposit.</div>
              </>
            ) : (
              <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">Choose valid dates and enter an estimated distance to see a breakdown.</p>
            )}
          </div>

          <div className="mt-5 rounded-xl border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Important estimate notes</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
              <li>Uses published daily rate, 200 km included per rental day and US$0.60/km excess mileage.</li>
              <li>Duration currently uses the calendar-day difference between pickup and return. VenMax must confirm its billing rule.</li>
              <li>Longer-rental discounts, availability, custom packages and the final price must be confirmed by VenMax.</li>
              <li>The deposit is shown separately and is not a rental expense.</li>
            </ul>
          </div>

          <a
            href={canPrepareEnquiry ? whatsappLink(enquiryMessage()) : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!canPrepareEnquiry}
            onClick={(e) => { if (!canPrepareEnquiry) e.preventDefault(); }}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-colors ${canPrepareEnquiry ? "bg-primary text-primary-foreground hover:bg-primary/90" : "pointer-events-none bg-muted text-muted-foreground"}`}
          >
            <MessageCircle className="h-4 w-4" /> Prepare WhatsApp enquiry <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-center text-xs text-muted-foreground">This opens a pre-filled message for you to review and send. It does not book a vehicle.</p>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> VenMax Car Rental & Tours · Harare, Zimbabwe</p>
        </aside>
      </main>
    </div>
  );
}
