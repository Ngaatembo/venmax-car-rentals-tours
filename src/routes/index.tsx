import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MessageCircle, Star, Zap } from "lucide-react";
import {
  BookingCta,
  BrandPromiseSection,
  DiasporaSection,
  FleetSection,
  ModelOfMonthSection,
  RequirementsFaqSection,
  ServicesSection,
  SocialShowcaseSection,
  TestimonialsSection,
  TrustStrip,
  WelcomeSection,
  WhySection,
} from "@/components/site/sections";
import { BookingWidget } from "@/components/site/BookingWidget";
import { businessFacts, whatsappLink } from "@/data/venmax";
import heroImage from "@/assets/toyota-fortuner.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <img
          src={heroImage}
          alt="VenMax Toyota Fortuner available for hire in Harare"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />
        <div className="relative mx-auto flex min-h-[min(640px,88svh)] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
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
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              Browse Our Fleet
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink("Hello VenMax, I'd like to book a vehicle.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/30 bg-navy-foreground/10 px-7 py-3.5 text-sm font-semibold text-navy-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-foreground/80">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 fill-primary text-primary" />
              No Hidden Fees
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 fill-primary text-primary" />
              Flexible Terms
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {businessFacts.googleRating}★ Rated
            </span>
          </div>
        </div>
      </section>
      <div className="relative z-10 mx-auto -mt-10 max-w-3xl px-4 sm:-mt-12 sm:px-6 lg:px-8">
        <BookingWidget />
      </div>
      <ModelOfMonthSection />
      <WelcomeSection />
      <TrustStrip />
      <FleetSection limit={6} />
      <WhySection />
      <BrandPromiseSection />
      <DiasporaSection />
      <TestimonialsSection />
      <ServicesSection />
      <RequirementsFaqSection />
      <SocialShowcaseSection />
      <BookingCta />
    </div>
  );
}
