import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, MessageCircle } from "lucide-react";
import {
  Bullets,
  LegalLink,
  LegalPage,
  LegalSubhead,
  type LegalSection,
} from "@/components/site/LegalPage";
import { company, whatsappLink, type Vehicle } from "@/data/venmax";
import { policies, useSiteSettings, type Policies, type SiteSettings } from "@/lib/site-settings";
import { useVehicles } from "@/lib/live-content";

// Route kept at /terms-of-service so existing links keep working.
export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Rental Terms & Conditions | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "VenMax rental terms: eligibility, rates and refundable deposits, 200 km/day mileage, fuel, insurance, airport services, chauffeur hire, payments, cancellations and booking on WhatsApp.",
      },
    ],
  }),
  component: RentalTermsPage,
});

function dollars(label: string): number | null {
  const m = label.replace(/,/g, "").match(/\$\s?(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

function glance(p: Policies) {
  return [
    { value: p.freeKm, label: "Free mileage per day" },
    { value: `${p.excessRate}/km`, label: "Excess mileage" },
    { value: "Refundable", label: "Deposits returned when you bring the car back" },
    { value: "No fee", label: `To cancel — full refund within ${p.refundDays} business working days` },
    { value: `+${p.chauffeurFee}`, label: "Chauffeur hire, on any vehicle" },
    { value: "Free", label: p.deliveryNote.replace(/^Free vehicle delivery/i, "Vehicle delivery").replace(/\.$/, "") },
  ];
}

function AtAGlance({ p }: { p: Policies }) {
  return (
    <div className="mt-8">
      <p className="eyebrow">At a glance</p>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {glance(p).map((g) => (
          <div key={g.label} className="rounded-2xl border border-border bg-surface p-4">
            <p className="font-display text-lg font-semibold text-primary sm:text-xl">{g.value}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{g.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatesAndDeposits({ vehicles }: { vehicles: Vehicle[] }) {
  const rates = vehicles.map((v) => dollars(v.priceLabel)).filter((n): n is number => n !== null);
  const deposits = [
    ...new Set(vehicles.map((v) => dollars(v.deposit)).filter((n): n is number => n !== null)),
  ].sort((a, b) => a - b);
  const min = rates.length ? Math.min(...rates) : null;
  const max = rates.length ? Math.max(...rates) : null;
  const depositText =
    deposits.length > 1
      ? `${deposits.slice(0, -1).map((d) => `$${d}`).join(", ")} or $${deposits[deposits.length - 1]}`
      : deposits.length === 1
        ? `$${deposits[0]}`
        : null;

  return (
    <>
      <Bullets
        items={[
          <>
            Each vehicle has its own daily rate and refundable deposit, shown on the{" "}
            <LegalLink href="/fleet">Fleet</LegalLink> page
            {min !== null && max !== null && (
              <>
                {" "}
                — from ${min}/day to ${max}/day
              </>
            )}
            .
          </>,
          ...(depositText
            ? [<>Refundable deposits are {depositText}, depending on the vehicle.</>]
            : []),
          "Your rate is fixed once your booking is confirmed.",
        ]}
      />
      <details className="group rounded-xl border border-border">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
          See the rate and deposit for each vehicle
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="overflow-x-auto border-t border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-semibold sm:px-4">Vehicle</th>
                <th className="px-3 py-2.5 font-semibold sm:px-4">Rate</th>
                <th className="px-3 py-2.5 font-semibold sm:px-4">Deposit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vehicles.map((v) => (
                <tr key={v.slug}>
                  <td className="px-3 py-2.5 text-foreground sm:px-4">{v.name}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-primary sm:px-4">
                    {v.priceLabel}
                  </td>
                  <td className="px-3 py-2.5 sm:px-4">{v.deposit.replace(/\s*refundable deposit/i, "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

function buildSections(vehicles: Vehicle[], p: Policies): LegalSection[] {
  return [
    {
      id: "rental-eligibility",
      title: "Rental Eligibility",
      content: (
        <>
          <LegalSubhead>For self-drive hire you'll need</LegalSubhead>
          <Bullets
            items={[
              `To be ${p.minAge} years or older.`,
              `A valid driver's licence, held for at least ${p.licenceYears} years.`,
              "A valid ID and passport.",
              "Proof of residence or employment.",
              "Next of kin details, for use in an emergency.",
            ]}
          />
          <p>
            No age limit applies when you book a VenMax chauffeur, because the vehicle is driven by
            our driver.
          </p>
        </>
      ),
    },
    {
      id: "rates-and-deposits",
      title: "Vehicle Rates & Deposits",
      content: <RatesAndDeposits vehicles={vehicles} />,
    },
    {
      id: "security-deposits",
      title: "Security Deposits",
      content: (
        <Bullets
          items={[
            "All VenMax deposits are refundable.",
            "The deposit is paid once your booking is confirmed, to secure the vehicle.",
            "Your deposit is refunded when you return the vehicle — on the spot, not the next day — using the payment method agreed with you.",
            "VenMax may deduct from the deposit for minor damage not covered by insurance (such as scratches), excess mileage or other outstanding charges.",
          ]}
        />
      ),
    },
    {
      id: "mileage",
      title: "Mileage",
      content: (
        <Bullets
          items={[
            `Standard rentals include ${p.freeKm} free mileage per day.`,
            `Excess mileage is charged at ${p.excessRate} per km.`,
            `Unlimited mileage is available for rentals of ${p.unlimitedFrom} or more.`,
            "Affordable customised mileage packages are available for tourists and clients on longer trips, arranged case by case.",
          ]}
        />
      ),
    },
    {
      id: "fuel",
      title: "Fuel",
      content: (
        <Bullets
          items={[
            "You pay for the fuel used during your rental.",
            "Please return the vehicle with the same fuel level it had when you collected it.",
          ]}
        />
      ),
    },
    {
      id: "insurance",
      title: "Insurance & Damage",
      content: (
        <>
          <p>All VenMax vehicles are insured, and are provided in good working condition at the start of your rental.</p>
          <LegalSubhead>Damage</LegalSubhead>
          <Bullets
            items={[
              "Accident-related damage covered by the vehicle's insurance is not charged to you.",
              "Minor damage that insurance doesn't cover, such as scratches, is charged to you and may be deducted from your deposit.",
            ]}
          />
          <LegalSubhead>During the rental, you are responsible for</LegalSubhead>
          <Bullets
            items={[
              "The vehicle, for the whole rental period.",
              "Any traffic fines and tolls.",
            ]}
          />
          <p>
            VenMax is not liable for personal belongings left in a vehicle, or for delays caused by
            circumstances outside our reasonable control (for example weather, road closures, or
            mechanical failure not caused by negligence).
          </p>
        </>
      ),
    },
    {
      id: "airport-services",
      title: "Airport Services",
      content: (
        <>
          <p>These are two separate services:</p>
          <Bullets
            items={[
              <>
                <strong>Free airport vehicle pickup</strong> — when you have hired a VenMax vehicle
                and need it at the airport.
              </>,
              <>
                <strong>Harare airport shuttle — {p.shuttlePerTrip}.</strong> Ask about airport drop-off,
                or a pickup-and-drop-off service, when you message us.
              </>,
            ]}
          />
        </>
      ),
    },
    {
      id: "chauffeur-hire",
      title: "Chauffeur Hire",
      content: (
        <Bullets
          items={[
            `A VenMax chauffeur can be added to any vehicle for an additional ${p.chauffeurFee}. This is not included in the vehicle's daily rate.`,
            "The client covers the driver's food and accommodation.",
            "The self-drive age requirement does not apply, because VenMax provides the driver.",
          ]}
        />
      ),
    },
    {
      id: "when-you-pay",
      title: "When You Pay",
      content: (
        <Bullets
          items={[
            "Once your booking is confirmed, you pay the vehicle's refundable security deposit to secure your booking.",
            "The balance can be paid on or before the day you collect the vehicle.",
          ]}
        />
      ),
    },
    {
      id: "payment-methods",
      title: "Payment Methods",
      content: (
        <>
          <p>VenMax accepts:</p>
          <ul className="flex flex-wrap gap-2">
            {p.paymentMethods.map((m) => (
              <li
                key={m}
                className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-semibold text-foreground sm:text-sm"
              >
                {m}
              </li>
            ))}
          </ul>
          <p>
            Payments are arranged directly with the VenMax team. This website does not take online
            payments.
          </p>
        </>
      ),
    },
    {
      id: "cancellation-refunds",
      title: "Cancellation & Refunds",
      content: (
        <Bullets
          items={[
            "In an emergency or if your plans change, you can cancel your rental.",
            "VenMax does not charge a cancellation fee. This applies to every booking.",
            `The full amount you paid is refunded within ${p.refundDays} business working days.`,
          ]}
        />
      ),
    },
    {
      id: "cross-border-travel",
      title: "Cross-Border Travel",
      content: <p>{p.crossBorder}</p>,
    },
    {
      id: "lost-vehicle-items",
      title: "Lost Vehicle Items",
      content: <p>Lost vehicle items may be charged at applicable market rates.</p>,
    },
    {
      id: "longer-rentals",
      title: "Longer Rentals",
      content: (
        <Bullets
          items={[
            `Unlimited mileage is available for rentals of ${p.unlimitedFrom} or more.`,
            "Affordable customised mileage packages are available for tourists and clients on longer trips, arranged case by case.",
            "Discounts are available for longer rental periods — message us on WhatsApp for details.",
          ]}
        />
      ),
    },
    {
      id: "booking-process",
      title: "Booking Process",
      content: (
        <>
          <ol className="space-y-2">
            {[
              <>
                Choose your vehicle on the <LegalLink href="/fleet">Fleet</LegalLink> page.
              </>,
              "Message VenMax on WhatsApp — or send the website enquiry form or an email.",
              "The VenMax team confirms availability, dates, price, deposit and requirements with you.",
              "Your booking is confirmed only once VenMax confirms it with you. An enquiry is a request, not a reservation.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-navy-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <p>
            <strong>Delivery:</strong> {p.deliveryNote} This is for rental customers and is
            separate from the airport shuttle.
          </p>
          <a
            href={whatsappLink("Hi VenMax, I'd like to book a vehicle. Please confirm availability and requirements.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Book on WhatsApp
          </a>
        </>
      ),
    },
  ];
}

function RentalTermsPage() {
  const vehicles = useVehicles();
  const settings = useSiteSettings();
  const p = policies(settings);
  return (
    <LegalPage
      title="Rental Terms & Conditions"
      description="The terms that apply when you rent a vehicle or book a chauffeur, airport service, shuttle or tour with VenMax."
      updated="September 2026"
      currentHref="/terms-of-service"
      intro={
        <p>
          These terms apply to every vehicle rental, chauffeur hire, airport service, shuttle or
          tour booked with {company.name}. By confirming a booking with VenMax, you agree to them.
          How we handle your personal information is covered separately in our{" "}
          <LegalLink href="/privacy-policy">Privacy Policy</LegalLink>.
        </p>
      }
      lead={<AtAGlance p={p} />}
      sections={buildSections(vehicles, p)}
      closing={
        <>
          <p>
            Please give accurate information when you make an enquiry or booking. Content on this
            website (text, images, logo) belongs to {company.name} and may not be reproduced without
            permission. These terms are governed by the laws of Zimbabwe.
          </p>
          <p>
            Questions about these terms:{" "}
            <LegalLink href={`mailto:${settings.contact_email_sales}`}>{settings.contact_email_sales}</LegalLink> or{" "}
            {settings.contact_phone_primary}.
          </p>
        </>
      }
      whatsappMessage="Hello VenMax, I have a question about your Rental Terms & Conditions."
    />
  );
}
