import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Globe, MessageCircle, Star } from "lucide-react";
import {
  AirportSection,
  BookingCta,
  BookingPaymentSection,
  CancellationSection,
  DiasporaSection,
  FleetSection,
  HowItWorksSection,
  MileageSection,
  RequirementsFaqSection,
  ServicesSection,
  TestimonialsSection,
  ValueCardsSection,
} from "@/components/site/sections";
import { BookingWidget } from "@/components/site/BookingWidget";
import { whatsappLink } from "@/data/venmax";
import heroImage from "@/assets/toyota-fortuner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Car Rental Zimbabwe | Affordable Car Hire in Harare | VenMax" },
      {
        name: "description",
        content:
          "Affordable car rental in Zimbabwe with easy WhatsApp booking. Vehicles from $40/day for local and diaspora customers. Arrange your Harare car hire before you arrive.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <img
          src={heroImage}
          alt="VenMax Toyota GD6 available for hire in Zimbabwe"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />
        <div className="relative mx-auto flex min-h-[min(640px,88svh)] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Affordable car rental in Zimbabwe &middot; Easy WhatsApp booking
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-tight sm:text-6xl">
            Reliable Car Rental in Zimbabwe, Made Simple.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-navy-foreground/80">
            Choose your vehicle, send us a WhatsApp message and let our team help arrange your
            rental — whether you're in Zimbabwe or planning your trip from abroad.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappLink("Hi VenMax, I'd like to enquire about renting a vehicle. Please help me with the available options.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Book on WhatsApp
            </a>
            <a
              href="/fleet"
              className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/30 bg-navy-foreground/10 px-7 py-3.5 text-sm font-semibold text-navy-foreground"
            >
              View Our Fleet
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-foreground/80">
            <span className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Serving local and diaspora customers
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              100+ Positive Ratings
            </span>
          </div>
        </div>
      </section>
      <div className="relative z-10 mx-auto -mt-10 max-w-3xl px-4 sm:-mt-12 sm:px-6 lg:px-8">
        <BookingWidget />
      </div>
      <ValueCardsSection />
      <FleetSection />
      <HowItWorksSection />
      <AirportSection />
      <DiasporaSection />
      <MileageSection />
      <BookingPaymentSection />
      <CancellationSection />
      <ServicesSection />
      <TestimonialsSection />
      <RequirementsFaqSection />
      <BookingCta />
    </div>
  );
}
