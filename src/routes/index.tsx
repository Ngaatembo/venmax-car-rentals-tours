import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import {
  AirportSection,
  BookingCta,
  FleetSection,
  RequirementsSection,
  ServicesSection,
  TestimonialsSection,
  ToursSection,
  TrustStrip,
  WhySection,
} from "@/components/site/sections";
import heroImage from "@/assets/hero-harare.jpg";
import { company, whatsappLink } from "@/data/venmax";

export const Route = createFileRoute("/")({
  component: Index,
});

function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <img
        src={heroImage}
        alt="VenMax Toyota Fortuner available for hire in Harare"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/90 to-navy" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-24 lg:pt-48">
        <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Harare &middot; Zimbabwe
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl leading-tight sm:text-6xl">
          Experience Zimbabwe <span className="text-primary">on Your Own Terms</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-navy-foreground/80">
          Premium vehicle rentals, chauffeur services and airport transfers in Harare.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#vehicles"
            className="inline-flex items-center gap-2 rounded-full bg-navy-foreground px-7 py-3.5 text-sm font-semibold text-navy"
          >
            Browse Vehicles
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={whatsappLink("Hello VenMax, I'd like to book a vehicle.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp VenMax
          </a>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-foreground/80">
          {["Free Airport Pickup", "Harare Vehicle Delivery", "Transparent Pricing"].map(
            (item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div>
      <Hero />
      <TrustStrip />
      <FleetSection />
      <RequirementsSection />
      <ServicesSection />
      <AirportSection />
      <ToursSection />
      <WhySection />
      <TestimonialsSection />
      <BookingCta />
    </div>
  );
}
