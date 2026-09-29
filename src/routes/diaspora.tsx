import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import {
  AirportSection,
  BookingCta,
  BookingPaymentSection,
  CancellationSection,
  DiasporaBenefitsSection,
  DiasporaSection,
  FleetSection,
  HowItWorksSection,
  MileageSection,
} from "@/components/site/sections";
import { whatsappLink } from "@/data/venmax";

export const Route = createFileRoute("/diaspora")({
  head: () => ({
    meta: [
      { title: "Car Hire Zimbabwe for the Diaspora | Rent Before You Arrive | VenMax" },
      {
        name: "description",
        content:
          "Car rental for Zimbabweans abroad and visitors: arrange your Harare car hire, including airport vehicle pickup, before you land — booked through WhatsApp.",
      },
    ],
  }),
  component: DiasporaPage,
});

function DiasporaPage() {
  return (
    <>
      <PageHero
        eyebrow="For Diaspora"
        title="Rent Your Car in Zimbabwe Before You Arrive."
        description="Planning a trip to Zimbabwe from abroad? VenMax makes it easy to arrange your vehicle before you land, with the booking process handled conveniently through WhatsApp."
      />
      <div className="bg-navy pb-12 text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href={whatsappLink(
              "Hi VenMax, I'm travelling to Zimbabwe from [COUNTRY] and would like to arrange a rental before my trip. Please help me with the options.",
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Plan My Rental on WhatsApp
          </a>
          <a
            href="#vehicles"
            className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/30 px-7 py-3.5 text-sm font-semibold text-navy-foreground"
          >
            View Vehicles
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <DiasporaSection full />
      <DiasporaBenefitsSection />
      <AirportSection />
      <MileageSection />
      <FleetSection limit={6} />
      <HowItWorksSection />
      <BookingPaymentSection />
      <CancellationSection />
      <BookingCta />
    </>
  );
}
