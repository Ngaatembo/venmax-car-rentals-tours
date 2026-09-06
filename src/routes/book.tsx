import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { PickupLocationField } from "@/components/site/PickupLocationField";
import { bookingSchema, serviceTypes, submitBookingRequest } from "@/lib/bookings";
import { useVehicles, useTours } from "@/lib/live-content";
import { whatsappLink } from "@/data/venmax";

const searchSchema = z.object({
  vehicle: z.string().optional(),
  service: z.string().optional(),
  pickup: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
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
  const { vehicle, service, pickup, start, end } = Route.useSearch();
  const vehicles = useVehicles();
  const tours = useTours();
  const [pending, setPending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [confirmLink, setConfirmLink] = useState<string | null>(null);
  type BookingFields = keyof z.infer<typeof bookingSchema>;
  const [errors, setErrors] = useState<Partial<Record<BookingFields, string>>>({});
  const [pickupLocation, setPickupLocation] = useState(pickup ?? "");
  const defaultVehicle = useMemo(
    () => (vehicle && vehicles.some((v) => v.slug === vehicle) ? vehicle : ""),
    [vehicle, vehicles],
  );
  const defaultService = useMemo(
    () => (service && serviceTypes.some((s) => s.value === service) ? service : "self-drive"),
    [service],
  );

  function buildConfirmMessage(
    data: z.infer<typeof bookingSchema>,
    ref: string,
  ) {
    const service = serviceTypes.find((s) => s.value === data.serviceType)?.label ?? data.serviceType;
    const vehicleName = vehicles.find((v) => v.slug === data.vehicleSlug)?.name;
    const tourName = tours.find((t) => t.slug === data.tourSlug)?.name;
    const lines = [
      `Hi VenMax, I just submitted a booking request (ref ${ref}).`,
      `Service: ${service}`,
      vehicleName ? `Vehicle: ${vehicleName}` : null,
      tourName ? `Tour interest: ${tourName}` : null,
      `Dates: ${data.startDate} to ${data.endDate}`,
      `Name: ${data.fullName}`,
      `Phone: ${data.phone}`,
      `Pickup/delivery: ${data.pickupLocation}`,
      data.notes ? `Notes: ${data.notes}` : null,
      "Please confirm availability and pricing. Thank you!",
    ].filter(Boolean);
    return lines.join("\n");
  }

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
      const link = whatsappLink(buildConfirmMessage(parsed.data, result.reference));
      setReference(result.reference);
      setConfirmLink(link);
      toast.success("Booking request received.");
      form.reset();
      setPickupLocation("");
      // Open WhatsApp immediately so VenMax actually sees the request —
      // saving to the database alone isn't enough since WhatsApp is their
      // primary channel and nobody may be watching the admin panel live.
      window.open(link, "_blank", "noreferrer");
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
                <span className="font-semibold text-foreground">{reference}</span>. We've opened
                WhatsApp with your details pre-filled — send that message so VenMax can confirm
                availability and final pricing with you directly. If WhatsApp didn't open, use the
                button below.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {confirmLink && (
                  <a
                    href={confirmLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Confirm via WhatsApp
                  </a>
                )}
                <button
                  onClick={() => {
                    setReference(null);
                    setConfirmLink(null);
                  }}
                  className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  Make another request
                </button>
                <a
                  href="/#vehicles"
                  className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary"
                >
                  Back to the fleet
                </a>
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
                  <select name="serviceType" className={fieldClass} defaultValue={defaultService}>
                    {serviceTypes.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <span className="text-xs text-destructive">{errors.serviceType}</span>
                  )}
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
                  <input
                    name="startDate"
                    type="date"
                    defaultValue={start ?? ""}
                    className={fieldClass}
                  />
                  {errors.startDate && (
                    <span className="text-xs text-destructive">{errors.startDate}</span>
                  )}
                </label>
                <label className="grid gap-1.5 text-sm">
                  End date
                  <input
                    name="endDate"
                    type="date"
                    defaultValue={end ?? ""}
                    className={fieldClass}
                  />
                  {errors.endDate && (
                    <span className="text-xs text-destructive">{errors.endDate}</span>
                  )}
                </label>
                <label className="grid gap-1.5 text-sm">
                  Full name
                  <input name="fullName" className={fieldClass} />
                  {errors.fullName && (
                    <span className="text-xs text-destructive">{errors.fullName}</span>
                  )}
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
                  <input type="hidden" name="pickupLocation" value={pickupLocation} />
                  <PickupLocationField
                    value={pickupLocation}
                    onChange={setPickupLocation}
                    selectClassName={fieldClass}
                    inputClassName={fieldClass}
                  />
                  {errors.pickupLocation && (
                    <span className="text-xs text-destructive">{errors.pickupLocation}</span>
                  )}
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
