import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Compass,
  Globe,
  Instagram,
  KeyRound,
  MapPin,
  MessageCircle,
  Plane,
  Play,
  Star,
  User,
  Users,
} from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { VehicleCard } from "./VehicleCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import airportImage from "@/assets/airport-pickup.jpg";
import chauffeurImage from "@/assets/range-rover-sport.jpg";
import {
  businessFacts,
  company,
  faqs,
  getVehicle,
  modelOfTheMonthSlug,
  paymentMethods,
  requirements,
  rentalTerms,
  services,
  testimonials,
  trustPoints,
  whatsappLink,
  whyVenMax,
} from "@/data/venmax";
import { useVehicles, useTours, useSiteContent } from "@/lib/live-content";
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

// Kept for reuse (e.g. a future About page) but no longer rendered on the
// homepage — its one-line message now lives in the hero subtext instead.
// "About VenMax" — verbatim company copy the client asked to have visible
// on the main page again (not a new claim; pulled from her own marketing).
export function AboutSection() {
  return (
    <Section id="about">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="About VenMax"
          title="Why Choose VenMax?"
          align="center"
        />
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
          {company.aboutParagraphs.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function WelcomeSection() {
  return (
    <Section tone="navy">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-primary">More Than a Car</p>
        <h2 className="mt-3 text-3xl text-navy-foreground sm:text-4xl">It's Your Journey</h2>
        <p className="mt-5 text-base leading-relaxed text-navy-foreground/80 sm:text-lg">
          From arriving at RGM International Airport to exploring Zimbabwe at your own pace, VenMax
          makes getting around simple, comfortable and reliable — a local team, a well-maintained
          fleet, and a journey that starts the moment you land.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-navy-foreground/60">
          <Compass className="h-4 w-4 text-primary" />
          Harare · Victoria Falls · Hwange · Great Zimbabwe · and beyond
        </div>
      </div>
    </Section>
  );
}

// Small teaser for one spotlighted vehicle, shown right under the hero
// booking widget. Change `modelOfTheMonthSlug` in src/data/venmax.ts to
// rotate the feature — no redesign needed.
export function ModelOfMonthSection() {
  const vehicles = useVehicles();
  const vehicle =
    vehicles.find((v) => v.slug === modelOfTheMonthSlug) ?? getVehicle(modelOfTheMonthSlug);
  if (!vehicle) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 lg:px-8">
      <Link
        to="/book"
        search={{ vehicle: vehicle.slug }}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
      >
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary sm:h-20 sm:w-28">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Model of the Month</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-foreground sm:text-base">
            {vehicle.name}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {vehicle.priceLabel}
            {vehicle.seats ? ` · ${vehicle.seats} seats` : ""}
          </p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export function FleetSection({ limit }: { limit?: number }) {
  const vehicles = useVehicles();
  const list = limit ? vehicles.slice(0, limit) : vehicles;

  return (
    <Section tone="surface" id="vehicles">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="The Fleet"
          title="Vehicles for Every Journey"
          description="From fuel-efficient city cars to rugged 4x4s for Zimbabwe's terrain — every vehicle is well maintained, with transparent pricing and a refundable deposit."
        />
        {limit && (
          <a
            href="/fleet"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            View All Vehicles
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((vehicle) => (
          <VehicleCard key={vehicle.slug} vehicle={vehicle} />
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Prices shown are starting daily rates. Final pricing depends on rental duration — message us
        for a tailored quote.
      </p>
    </Section>
  );
}

export function ServicesSection() {
  const tours = useTours();
  const airport = services.find((s) => s.slug === "airport-transfer");
  const chauffeur = services.find((s) => s.slug === "chauffeur");
  const featuredTour = tours[0];

  const cards = [
    airport && {
      key: "airport",
      eyebrow: "RGM International Airport",
      title: "Airport Transfers",
      description: airport.description,
      image: airportImage,
      badge: "From $30",
      cta: "Book Transfer",
      href: whatsappLink(airport.whatsapp),
    },
    chauffeur && {
      key: "chauffeur",
      eyebrow: "Professional Drivers",
      title: "Chauffeur Services",
      description: chauffeur.description,
      image: chauffeurImage,
      badge: "Fully Vetted",
      cta: "Book Chauffeur",
      href: whatsappLink(chauffeur.whatsapp),
    },
    featuredTour && {
      key: "tours",
      eyebrow: "Zimbabwe Experiences",
      title: "Custom Tours",
      description:
        "Tailored travel packages to Victoria Falls, Hwange, Great Zimbabwe and beyond — corporate retreats or family safaris.",
      image: featuredTour.image,
      badge: "Custom Itinerary",
      cta: "Plan Your Tour",
      href: "/tours" as const,
    },
  ].filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <Section id="services">
      <SectionHeading
        eyebrow="Services & Tours"
        title="Beyond Just Car Rental"
        description="From airport pickups to custom safari itineraries, VenMax delivers end-to-end transportation across Zimbabwe."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.key}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              {card.image && (
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                {card.badge}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="eyebrow">{card.eyebrow}</p>
              <h3 className="mt-2 text-lg">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              {card.href.startsWith("/") ? (
                <Link
                  to={card.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  {card.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// Kept for reuse but no longer rendered directly on the homepage — its
// "free airport pickup" message now lives in the Services & Tours card and
// the Why Choose Us feature row instead.
export function AirportSection() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl sm:aspect-[3/4] lg:aspect-auto lg:min-h-[28rem]">
          <img
            src={airportImage}
            alt="VenMax chauffeur meeting an arriving traveller at the airport"
            loading="lazy"
            width={1200}
            height={1600}
            className="h-full w-full object-cover object-center"
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

// Kept for reuse but no longer rendered on the homepage — its key points
// (WhatsApp booking, no in-country presence needed) now live in the FAQ
// accordion instead of a full standalone section.
export function DiasporaSection() {
  return (
    <Section tone="navy">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Booking From Abroad"
            title="Sorting a car for family back home? We make it simple."
            description="Whether you're arranging a vehicle for relatives visiting Zimbabwe or securing a car ahead of your own trip home, VenMax handles bookings and deposits over WhatsApp — you don't need to be in the country to get it sorted."
            invert
          />
          <ul className="mt-8 space-y-4">
            {[
              "Confirm your vehicle and dates over WhatsApp from anywhere",
              "Secure your booking with a refundable deposit",
              "Free airport pickup so family — or you — are covered on arrival",
              "Clear, upfront pricing before you commit",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-navy-foreground/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(
              "Hello VenMax, I'm based outside Zimbabwe and would like to arrange a vehicle booking. Can you help me sort this over WhatsApp?",
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Book From Abroad on WhatsApp
          </a>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl sm:aspect-[3/4] lg:aspect-auto lg:min-h-[24rem]">
          <img
            src={airportImage}
            alt="VenMax meeting an arriving traveller at Harare's Robert Gabriel Mugabe International Airport"
            loading="lazy"
            width={1200}
            height={1600}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-navy-foreground/90">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Wherever you're booking from
              </span>
            </div>
            <p className="mt-2 text-sm text-navy-foreground/80">
              Zimbabweans in the diaspora trust VenMax to arrange rentals for family and
              homecoming trips — no in-person visit required to get started.
            </p>
          </div>
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
                index === 0 ? "h-80 sm:h-96 lg:h-full" : "h-72 sm:h-80",
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

// Verified-only stats: fleet size and starting price come straight from the
// live vehicle list; the other two tiles are real stated facts (not
// invented customer/rating numbers, which VenMax hasn't supplied yet).
export function WhySection() {
  const vehicles = useVehicles();
  const startingPrice = vehicles.reduce<number | null>((min, v) => {
    const match = v.priceLabel.match(/\$(\d+)/);
    if (!match) return min;
    const price = Number(match[1]);
    return min === null || price < min ? price : min;
  }, null);

  const stats = [
    { value: `${businessFacts.googleRating}★`, label: "Google Rating" },
    { value: startingPrice ? `$${startingPrice}` : "$40", label: "Starting Price/Day" },
    { value: businessFacts.happyClients, label: "Happy Clients" },
    { value: `${vehicles.length}+`, label: "Vehicle Models" },
  ];

  const featureRows = whyVenMax.slice(0, 4);

  return (
    <Section tone="navy" id="why-venmax">
      <SectionHeading
        eyebrow="Why Choose Us"
        title="Harare's Most Trusted Car Rental."
        description="A Zimbabwean-owned company built on straightforward, honest service — real vehicles, real prices, and local knowledge that makes travel here effortless."
        invert
      />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-5 text-center"
          >
            <p className="text-2xl font-semibold text-primary sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs text-navy-foreground/70">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {featureRows.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-5 text-sm text-navy-foreground/90"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {item}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href={whatsappLink("Hello VenMax, I'd like to learn more about renting with you.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          Talk to the VenMax Team
        </a>
      </div>
    </Section>
  );
}

// Full-bleed brand photo with an overlay quote — uses a real VenMax tour
// photo rather than a new asset.
export function BrandPromiseSection() {
  const tours = useTours();
  const image = tours[0]?.image;
  if (!image) return null;

  return (
    <section className="relative flex min-h-[26rem] items-end overflow-hidden bg-navy text-navy-foreground sm:min-h-[32rem]">
      <img
        src={image}
        alt="A VenMax vehicle on the road in Zimbabwe"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/10" />
      <div className="relative mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <p className="eyebrow text-primary">Our Promise</p>
        <h2 className="mt-3 max-w-xl text-3xl leading-tight sm:text-4xl">
          Drive More. Spend Less. Travel Better.
        </h2>
        <p className="mt-3 text-sm text-navy-foreground/80">VenMax Car Rental &amp; Tours</p>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const tours = useTours();
  const bannerImage = tours[1]?.image ?? tours[0]?.image;
  const avatarPalette = ["bg-primary", "bg-navy", "bg-emerald-600", "bg-sky-600", "bg-amber-600"];
  return (
    <Section>
      <SectionHeading
        eyebrow="Customer Reviews"
        title="Trusted by Zimbabweans Across the Country"
        description="Genuine reviews from VenMax customers on our Google Business Profile."
      />
      {bannerImage && (
        <div className="relative mt-8 aspect-[16/7] overflow-hidden rounded-2xl sm:aspect-[16/5]">
          <img
            src={bannerImage}
            alt="A destination VenMax customers have travelled to"
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground sm:left-6 sm:top-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
              ))}
            </div>
            {businessFacts.googleRating} ({businessFacts.googleReviewCount})
          </div>
        </div>
      )}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-foreground">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={
                i < Math.round(businessFacts.googleRating)
                  ? "h-4 w-4 fill-primary text-primary"
                  : "h-4 w-4 text-muted-foreground/30"
              }
            />
          ))}
        </div>
        {businessFacts.googleRating}★ on Google ({businessFacts.googleReviewCount} reviews)
      </div>
      <Carousel opts={{ align: "start", loop: true }} className="mt-8">
        <CarouselContent>
          {testimonials.map((t, i) => (
            <CarouselItem key={i} className="sm:basis-1/2 lg:basis-1/3">
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarPalette[i % avatarPalette.length]}`}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-3 w-3 fill-primary text-primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-4 text-xs font-normal text-muted-foreground">
                  Verified Google review
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
          <CarouselItem className="sm:basis-1/2 lg:basis-1/3">
            <a
              href={company.googleReviews}
              target="_blank"
              rel="noreferrer"
              className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center transition-colors hover:bg-secondary"
            >
              <Star className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold">See all our Google reviews</span>
            </a>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <p className="mt-4 text-center text-xs text-muted-foreground sm:hidden">
        Swipe to see more reviews →
      </p>
    </Section>
  );
}

// Rental Requirements + FAQ, condensed into one accordion so the essential
// information survives without taking up two full homepage sections.
export function RequirementsFaqSection() {
  return (
    <Section tone="surface" id="requirements">
      <SectionHeading
        eyebrow="Requirements & FAQ"
        title="What you need to rent, and answers to common questions"
        description="Simple, straightforward requirements — kept easy to read so you can get on the road quickly."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {requirements.map((req) => (
          <article key={req.number} className="rounded-2xl border border-border bg-card p-6">
            <span className="text-2xl font-semibold text-primary">{req.number}</span>
            <h3 className="mt-3 text-base">{req.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{req.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3">
        {rentalTerms.map((term) => (
          <div key={term.label}>
            <p className="eyebrow">{term.label}</p>
            <p className="mt-2 text-sm">{term.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Our Payment Platforms Include
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <h3 className="text-center text-xl">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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

type EmbedPlatform = "instagram" | "tiktok" | "facebook" | null;

function detectSocialPlatform(url: string): EmbedPlatform {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/facebook\.com|fb\.watch/.test(url)) return "facebook";
  return null;
}

const platformLabel: Record<Exclude<EmbedPlatform, null>, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export function SocialShowcaseSection() {
  const content = useSiteContent();
  const links = [
    content["social_showcase_1"],
    content["social_showcase_2"],
    content["social_showcase_3"],
    content["social_showcase_4"],
  ].filter((url): url is string => Boolean(url));

  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Follow The Journey"
        title="See VenMax in action"
        description="Real posts from our Instagram and TikTok — fleet updates, offers and the road ahead."
        align="center"
      />
      {links.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {links.map((url, i) => {
            const platform = detectSocialPlatform(url);
            const label = platform ? platformLabel[platform] : "Social";
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-navy p-10 text-center text-navy-foreground transition-colors hover:border-primary"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 transition-colors group-hover:bg-primary">
                  <Play className="h-5 w-5 fill-current text-primary group-hover:text-primary-foreground" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-navy-foreground/60">
                    Featured on {label}
                  </span>
                  <span className="mt-1 block text-sm font-semibold">Watch this post</span>
                </span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 flex justify-center">
          <a
            href={company.social.instagram ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            <Instagram className="h-4 w-4" />
            Follow @venmax_car_rental_tours
          </a>
        </div>
      )}
    </Section>
  );
}

export function BookingCta() {
  return (
    <Section tone="navy">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          eyebrow="Ready to Hit the Road?"
          title="Book your vehicle in minutes"
          description="Call us directly or send a WhatsApp — we respond within minutes and confirm availability right away."
          invert
        />
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <a
            href={`tel:${(company.phones[0] ?? "").replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full bg-navy-foreground px-6 py-3 text-sm font-semibold text-navy"
          >
            {company.phones[0]}
          </a>
          <a
            href={whatsappLink("Hello VenMax, I'd like to check availability and book a vehicle.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>
        </div>
      </div>
    </Section>
  );
}
