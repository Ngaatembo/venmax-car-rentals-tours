import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import {
  bookingSchema,
  serviceTypes,
  submitBookingRequest,
  tours,
  vehicles,
} from "@/lib/bookings";

const searchSchema = z.object({
  vehicle: z.string().optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Request a Booking | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "Request a vehicle, chauffeur, airport transfer or tour booking with VenMax in Harare, Zimbabwe.",
      },
      { property: "og:title", content: "Request a Booking | VenMax" },
      {
        property: "og:description",
        content: "Request a vehicle, chauffeur, airport transfer or tour booking with VenMax.",
      },
    ],
  }),
  component: BookPage,
});

const fieldClass =
  "rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function BookPage() {
  const { vehicle } = Route.useSearch();
  const [pending, setPending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const defaultVehicle = useMemo(
    () => (vehicle && vehicles.some((v) => v.slug === vehicle) ? vehicle : ""),
    [vehicle],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please complete the highlighted fields.");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const result = await submitBookingRequest(parsed.data);
      setReference(result.reference);
      toast.success("Booking request received.");
      form.reset();
    } catch {
      toast.error("Something went wrong — please try again or use WhatsApp.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Request a booking"
        description="Send us your details and dates — VenMax confirms availability and pricing personally."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          {reference ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 text-2xl">Request received</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your booking request reference is{" "}
                <span className="font-semibold text-foreground">{reference}</span>. VenMax will
                confirm availability and final pricing with you directly. For the fastest
                response, mention this reference on WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setReference(null)}
                  className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  Make another request
                </button>
                <Link
                  to="/vehicles"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Back to the fleet
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  Service
                  <select name="serviceType" className={fieldClass} defaultValue="self-drive">
                    {serviceTypes.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && <span className="text-xs text-destructive">{errors.serviceType}</span>}
                </label>
                <label className="grid gap-1.5 text-sm">
                  Vehicle (optional)
                  <select name="vehicleSlug" className={fieldClass} defaultValue={defaultVehicle}>
                    <option value="">Any suitable vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.slug} value={v.slug}>
                        {v.name} — {v.priceLabel}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm sm:col-span-2">
                  Destination / tour interest (optional)
                  <select name="tourSlug" className={fieldClass} defaultValue="">
                    <option value="">No specific tour</option>
                    {tours.map((t) => (
                      <option key={t.slug} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-sm">
                  Start date
                  <input name="startDate" type="date" className={fieldClass} />
                  {errors.startDate && <span className="text-xs text-destructive">{errors.startDate}</span>}
                </label>
                <label className="grid gap-1.5 text-sm">
                  End date
                  <input name="endDate" type="date" className={fieldClass} />
                  {errors.endDate && <span className="text-xs text-destructive">{errors.endDate}</span>}
                </label>
                <label className="grid gap-1.5 text-sm">
                  Full name
                  <input name="fullName" className={fieldClass} />
                  {errors.fullName && <span className="text-xs text-destructive">{errors.fullName}</span>}
                </label>
                <label className="grid gap-1.5 text-sm">
                  Phone / WhatsApp
                  <input name="phone" className={fieldClass} />
                  {errors.phone && <span className="text-xs text-destructive">{errors.phone}</span>}
                </label>
                <label className="grid gap-1.5 text-sm">
                  Email
                  <input name="email" type="email" className={fieldClass} />
                  {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
                </label>
                <label className="grid gap-1.5 text-sm">
                  Pickup / delivery location
                  <input name="pickupLocation" placeholder="e.g. Harare Airport" className={fieldClass} />
                  {errors.pickupLocation && <span className="text-xs text-destructive">{errors.pickupLocation}</span>}
                </label>
                <label className="grid gap-1.5 text-sm sm:col-span-2">
                  Notes (optional)
                  <textarea name="notes" rows={4} className={fieldClass} />
                </label>
              </div>
              <button
                type="submit"
                disabled={pending}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 sm:w-auto"
              >
                {pending ? "Submitting…" : "Submit booking request"}
              </button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
