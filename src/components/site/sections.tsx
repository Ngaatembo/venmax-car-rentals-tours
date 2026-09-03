import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  KeyRound,
  MapPin,
  MessageCircle,
  Plane,
  Star,
  User,
  Users,
} from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { VehicleCard } from "./VehicleCard";
import airportImage from "@/assets/airport-pickup.jpg";
import {
  company,
  requirements,
  rentalTerms,
  services,
  trustPoints,
  whatsappLink,
  whyVenMax,
} from "@/data/venmax";
import { useVehicles, useTours } from "@/lib/live-content";
import { cn } from "@/lib/utils";

const serviceIcons = {
  key: KeyRound,
  user: User,
  plane: Plane,
  users: Users,
};

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-background py-12 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {trustPoints.map((point) => (
          <div key={point.title}>
            <h3 className="text-base">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FleetSection({ limit }: { limit?: number }) {
  const vehicles = useVehicles();
  const list = limit ? vehicles.slice(0, limit) : vehicles;
  return (
    <Section tone="surface" id="vehicles">
      <SectionHeading
        eyebrow="The Fleet"
        title="Choose the right vehicle for your Zimbabwe journey"
        description="A curated fleet from economical hybrids to flagship 4x4s. Discounts available for longer rentals — every price is transparent, with no hidden charges."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((vehicle) => (
          <VehicleCard key={vehicle.slug} vehicle={vehicle} />
        ))}
      </div>
      {limit ? (
        <div className="mt-10 text-center">
          <a
            href="/#vehicles"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            View the full fleet
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Prices shown are starting daily rates. Final pricing depends on rental duration — message
          us for a tailored quote.
        </p>
      )}
    </Section>
  );
}

export function ServicesSection() {
  return (
    <Section tone="navy" id="services">
      <SectionHeading
        eyebrow="Services"
        title="Every way to travel with VenMax"
        description="From independent self-drive to fully chauffeured journeys — tailored to how you want to experience Zimbabwe."
        invert
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const Icon = serviceIcons[service.icon];
          return (
            <article
              key={service.slug}
              className="flex flex-col rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-6"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg text-navy-foreground">{service.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-foreground/70">
                {service.description}
              </p>
              <a
                href={whatsappLink(service.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Enquire
                <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function AirportSection() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={airportImage}
            alt="VenMax chauffeur meeting an arriving traveller at the airport"
            loading="lazy"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-6 top-6 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            Complimentary · Airport Pickup
          </span>
        </div>
        <div>
          <SectionHeading
            eyebrow="Airport & Delivery"
            title="Arriving in Zimbabwe? Start your journey the easy way."
            description="We meet you at the airport and bring your vehicle to you — so your trip begins the moment you land."
          />
          <ul className="mt-8 space-y-4">
            {[
              "Free airport pickup on arrival",
              "Vehicle delivery anywhere in Harare",
              "Easy WhatsApp booking",
              "Flexible rental options",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(
              "Hello VenMax, I'd like to arrange a free airport pickup for my arrival in Harare.",
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Arrange Airport Pickup
          </a>
        </div>
      </div>
    </Section>
  );
}

export function ToursSection() {
  const tours = useTours();
  return (
    <Section tone="navy" id="tours">
      <SectionHeading
        eyebrow="Explore Zimbabwe"
        title="Your journey doesn't end at the vehicle"
        description="VenMax is also a tours company. From the thunder of Victoria Falls to the ancient stone of Great Zimbabwe, we help you reach the places that make this country extraordinary — the vehicle is just how you get there."
        invert
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, index) => (
          <article
            key={tour.slug}
            className={cn(
              "group relative overflow-hidden rounded-2xl",
              index === 0 && "sm:col-span-2 lg:row-span-2",
            )}
          >
            <img
              src={tour.image}
              alt={tour.name}
              loading="lazy"
              width={1024}
              height={768}
              className={cn(
                "w-full object-cover transition-transform duration-700 group-hover:scale-105",
                index === 0 ? "h-80 lg:h-full" : "h-72",
              )}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/5" />
            <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-navy-foreground/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-navy-foreground/90 backdrop-blur-sm">
              <MapPin className="h-3 w-3 text-primary" />
              Zimbabwe Journey
            </span>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className={cn("text-navy-foreground", index === 0 ? "text-2xl" : "text-lg")}>
                {tour.name}
              </h3>
              <p
                className={cn(
                  "mt-2 leading-relaxed text-navy-foreground/80",
                  index === 0 ? "max-w-lg text-base" : "max-w-md text-sm",
                )}
              >
                {tour.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-navy-foreground p-8 text-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl">Plan your journey with VenMax</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us where you want to go — we'll handle the vehicle, the route and the logistics.
          </p>
        </div>
        <a
          href={whatsappLink(
            "Hello VenMax, I'd like to plan a trip around Zimbabwe with you. Can you help with a vehicle and itinerary?",
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          Plan Your Trip With VenMax
        </a>
      </div>
    </Section>
  );
}

export function WhySection() {
  return (
    <Section tone="surface" id="why-venmax">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Why VenMax"
            title="A local partner you can trust on every road"
            description="We're a Zimbabwean company built on straightforward, honest service. Real vehicles, real prices, and the local knowledge that makes travel here effortless."
          />
          <a
            href={whatsappLink("Hello VenMax, I'd like to learn more about renting with you.")}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Talk to the VenMax Team
          </a>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {whyVenMax.map((item) => (
            <li key={item} className="flex items-start gap-3 border-b border-border py-4 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function TestimonialsSection() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card px-8 py-14 text-center">
        <p className="eyebrow text-primary">Customer Reviews</p>
        <h2 className="mt-3 text-2xl sm:text-3xl">Hear it from real VenMax customers</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Genuine reviews from VenMax customers are collected on our Google Business Profile. Take a
          look before you book — and if you've travelled with us, we'd love to hear from you there
          too.
        </p>
        <a
          href={company.googleProfile}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Star className="h-4 w-4" />
          See Our Google Reviews
        </a>
      </div>
    </Section>
  );
}

export function RequirementsSection() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Rental Requirements"
        title="What you need to rent"
        description="Simple, straightforward requirements — kept easy to read so you can get on the road quickly."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {requirements.map((req) => (
          <article key={req.number} className="rounded-2xl border border-border bg-card p-6">
            <span className="font-display text-2xl font-semibold text-primary">{req.number}</span>
            <h3 className="mt-3 text-base">{req.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{req.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3">
        {rentalTerms.map((term) => (
          <div key={term.label}>
            <p className="eyebrow">{term.label}</p>
            <p className="mt-2 text-sm">{term.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href={whatsappLink(
            "Hello VenMax, I have a question about your rental requirements before I book.",
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          Ask About Requirements
        </a>
      </div>
    </Section>
  );
}

export function BookingCta() {
  return (
    <Section tone="navy">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          eyebrow="Ready When You Are"
          title="Book your vehicle in minutes"
          description="No complicated forms. Send us a booking request or message us directly and we'll confirm availability right away."
          invert
        />
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-full bg-navy-foreground px-6 py-3 text-sm font-semibold text-navy"
          >
            Request a Booking
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={whatsappLink("Hello VenMax, I'd like to check availability and book a vehicle.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Book via WhatsApp
          </a>
          <p className="w-full text-sm text-navy-foreground/70 lg:text-right">
            {company.phones[0]}
          </p>
        </div>
      </div>
    </Section>
  );
}
