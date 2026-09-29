import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Compass,
  CalendarDays,
  Globe,
  Instagram,
  KeyRound,
  MapPin,
  Search,
  MessageCircle,
  Plane,
  Play,
  Star,
  Tag,
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
import logo from "@/assets/logo-header.png";
import {
  businessFacts,
  company,
  diasporaBenefits,
  diasporaMarkets,
  howItWorks,
  valueCards,
  fleetCountLabel,
  type Vehicle,
  paymentMethods,
  requirements,
  rentalTerms,
  standardMileagePolicy,
  trustPoints,
  whatsappLink,
  whyVenMax,
} from "@/data/venmax";
import { useFleet, useVehicles, useTours, useSiteContent, useServices, useFaqs, useTestimonials } from "@/lib/live-content";
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
// Mission & Vision — verbatim from VenMax's official venmax.co.zw site.
export function CoreValuesSection() {
  return (
    <Section id="values">
      <SectionHeading
        eyebrow="What Drives Us"
        title="Our Core Values"
        description="The principles that shape every rental, every trip, and every conversation with VenMax."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {company.coreValues.map((value) => (
          <article key={value.title} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {value.description}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function OfferAndLeadershipSection() {
  return (
    <Section tone="surface">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="What We Offer" title="Built around your convenience" />
          <ul className="mt-6 space-y-4">
            {company.whatWeOffer.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading eyebrow="Our Leadership" title="A team built for the road" />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {company.leadership}
          </p>
        </div>
      </div>
    </Section>
  );
}

export function MissionVisionSection() {
  return (
    <Section tone="navy" id="mission-vision">
      <SectionHeading
        eyebrow="What Drives Us"
        title="Our Mission & Vision"
        invert
        align="center"
      />
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-8">
          <p className="eyebrow text-primary">Our Vision</p>
          <p className="mt-4 text-lg leading-relaxed text-navy-foreground">{company.vision}</p>
        </div>
        <div className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-8">
          <p className="eyebrow text-primary">Our Mission</p>
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/85">
            {company.mission}
          </p>
        </div>
      </div>
    </Section>
  );
}

export function AboutSection({ showCta = false }: { showCta?: boolean } = {}) {
  return (
    <Section id="about">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="About VenMax"
          title="Why Choose VenMax?"
          align="center"
        />
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
          {company.aboutParagraphs.map((para) => {
            const parts = para.split(/(1000\+)/);
            return (
              <p key={para}>
                {parts.map((part, i) =>
                  part === "1000+" ? (
                    <strong key={i} className="font-semibold text-primary">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
            );
          })}
        </div>
        <p className="mt-6 text-sm">
          <span className="font-semibold text-foreground">Target Market: </span>
          <span className="text-muted-foreground">{company.targetMarket}</span>
        </p>
        <blockquote className="mt-8 rounded-2xl border border-border bg-card px-6 py-5 text-base font-semibold leading-relaxed text-primary">
          “{company.brandQuote}”
        </blockquote>
        {showCta && (
          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Learn More About Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
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

/**
 * Homepage "Featured Vehicles": a short curated selection from the live database.
 * Vehicles marked "Featured" in the admin panel are used (max 8); if none are marked,
 * the first few by admin sort order. No vehicle is singled out as a flagship.
 */
export function FleetSection() {
  const { vehicles } = useFleet();
  const featured = vehicles.filter((v) => v.isFeatured).slice(0, 8);
  const list = featured.length > 0 ? featured : vehicles.slice(0, 6);
  const countLabel = fleetCountLabel(vehicles.length);

  return (
    <Section tone="surface" id="vehicles">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow={countLabel ? `${countLabel} available` : "The Fleet"}
          title="Featured Vehicles"
          description="A selection from the VenMax fleet, each with its own daily rate and deposit shown up front."
        />
        <a
          href="/fleet"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          View Full Fleet
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((vehicle) => (
          <VehicleCard key={vehicle.slug} vehicle={vehicle} />
        ))}
      </div>
      <div className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="text-xl">Explore the Full Fleet</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          VenMax has a wide range of vehicles for city driving, family trips, business travel and
          longer journeys.
        </p>
        <a
          href="/fleet"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          View All Vehicles
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Daily rates shown. Discounts are available for longer rental periods — message us on
        WhatsApp for details.
      </p>
    </Section>
  );
}

type Band = { key: string; label: string; test: (price: number) => boolean };
const rateBands: Band[] = [
  { key: "lt50", label: "Under $50/day", test: (p) => p < 50 },
  { key: "50-100", label: "$50 – $100/day", test: (p) => p >= 50 && p <= 100 },
  { key: "100-200", label: "$100 – $200/day", test: (p) => p > 100 && p <= 200 },
  { key: "200+", label: "Over $200/day", test: (p) => p > 200 },
];

function ratePerDay(v: Vehicle) {
  const m = v.priceLabel.replace(/,/g, "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

const categoryGroups: { key: string; label: string; test: (v: Vehicle) => boolean }[] = [
  { key: "economy", label: "Economy", test: (v) => /economy/i.test(v.category) },
  {
    key: "hybrid",
    label: "Hybrid",
    test: (v) => /hybrid/i.test(v.fuelType ?? "") || /hybrid/i.test(v.name),
  },
  { key: "suv", label: "SUVs", test: (v) => /suv/i.test(v.category) },
  { key: "4x4", label: "4x4", test: (v) => /4x4/i.test(v.category) },
  { key: "luxury", label: "Luxury", test: (v) => /luxury/i.test(v.category) },
  { key: "trucks", label: "Trucks", test: (v) => /truck|pickup/i.test(v.category) },
  { key: "chauffeur", label: "Chauffeur", test: (v) => /chauffeur/i.test(v.category) },
];

const PAGE_SIZE = 24;

/** Full searchable catalogue for /fleet. Everything comes from the live vehicle data. */
export function FleetCatalogue() {
  const { vehicles } = useFleet();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [band, setBand] = useState("any");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Only offer a category when vehicles in it actually exist. Any raw category that none
  // of the named groups cover (e.g. "Family MPV") gets its own chip.
  const chips = useMemo(() => {
    const named = categoryGroups
      .filter((g) => vehicles.some(g.test))
      .map((g) => ({ key: g.key, label: g.label, test: g.test }));
    const covered = (v: Vehicle) => categoryGroups.some((g) => g.test(v));
    const extra = Array.from(new Set(vehicles.filter((v) => !covered(v)).map((v) => v.category)))
      .filter(Boolean)
      .map((c) => ({
        key: `cat:${c}`,
        label: c,
        test: (v: Vehicle) => v.category === c,
      }));
    return [...named, ...extra];
  }, [vehicles]);

  const bands = useMemo(
    () =>
      rateBands.filter((b) =>
        vehicles.some((v) => {
          const r = ratePerDay(v);
          return r !== null && b.test(r);
        }),
      ),
    [vehicles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const chip = chips.find((c) => c.key === group);
    const rb = rateBands.find((b) => b.key === band);
    return vehicles.filter((v) => {
      if (q && !v.name.toLowerCase().includes(q)) return false;
      if (chip && !chip.test(v)) return false;
      if (rb) {
        const r = ratePerDay(v);
        if (r === null || !rb.test(r)) return false;
      }
      return true;
    });
  }, [vehicles, query, group, band, chips]);

  const countLabel = fleetCountLabel(vehicles.length);
  const shown = filtered.slice(0, visible);
  const filtersActive = query.trim() !== "" || group !== "all" || band !== "any";

  const chipClass = (active: boolean) =>
    cn(
      "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-background hover:bg-secondary",
    );

  return (
    <Section tone="surface" id="vehicles">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow={countLabel ? `${countLabel} available` : "The Fleet"}
          title="Explore the VenMax Fleet"
          description="Every vehicle shows its own daily rate and deposit. Found one you like? Enquire on WhatsApp and the team will confirm availability."
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search by vehicle name"
            aria-label="Search vehicles by name"
            className="w-full rounded-full border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        {bands.length > 1 && (
          <select
            value={band}
            onChange={(e) => {
              setBand(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            aria-label="Filter by daily rate"
            className="rounded-full border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="any">Any daily rate</option>
            {bands.map((b) => (
              <option key={b.key} value={b.key}>
                {b.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {chips.length > 0 && (
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            type="button"
            onClick={() => {
              setGroup("all");
              setVisible(PAGE_SIZE);
            }}
            className={chipClass(group === "all")}
          >
            All Vehicles
          </button>
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => {
                setGroup(c.key);
                setVisible(PAGE_SIZE);
              }}
              className={chipClass(group === c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing {shown.length} of {filtered.length} {filtered.length === 1 ? "vehicle" : "vehicles"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No vehicles match your search. Try a different name or filter — or ask VenMax
            directly.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGroup("all");
                  setBand("any");
                }}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
              >
                Clear filters
              </button>
            )}
            <a
              href={whatsappLink(
                "Hi VenMax, I'd like to enquire about renting a vehicle. Please help me with the available options.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Check Rental Options
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      )}

      {filtered.length > shown.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible((n) => n + PAGE_SIZE)}
            className="rounded-full border border-border bg-background px-7 py-3 text-sm font-semibold hover:bg-secondary"
          >
            Show more vehicles
          </button>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Daily rates shown. Discounts are available for longer rental periods — message us on
        WhatsApp for details.
      </p>
    </Section>
  );
}

export function ServicesSection() {
  const tours = useTours();
  const services = useServices();
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
      badge: "$30 per trip",
      cta: "Book Transfer",
      href: whatsappLink(airport.whatsapp),
    },
    chauffeur && {
      key: "chauffeur",
      eyebrow: "Professional Drivers",
      title: "Chauffeur Services",
      description: chauffeur.description,
      image: chauffeurImage,
      badge: "With a Driver",
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
    <Section id="airport">
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
        </div>
        <div>
          <SectionHeading
            eyebrow="Airport Services"
            title="Airport Services"
            description="Two separate services — please note the difference."
          />
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Free vehicle pickup
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Airport pickup is FREE when a customer has hired a vehicle from VenMax and requires
                the vehicle at the airport.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Airport shuttle · $30 per trip
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Harare airport shuttle services are available at $30 per trip. Ask about airport
                drop-off, or a pickup-and-drop-off service, when you message us.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                "Hi VenMax, I'd like to arrange airport pickup with my vehicle rental. Please help me with the arrangements.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Arrange Airport Pickup
            </a>
            <a
              href={whatsappLink("Hello VenMax, I'd like to enquire about the Harare airport shuttle.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Ask About the Shuttle
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

const valueIcons = { tag: Tag, calendar: CalendarDays, message: MessageCircle, globe: Globe };

export function ValueCardsSection() {
  return (
    <Section>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {valueCards.map((card) => {
          const Icon = valueIcons[card.icon];
          return (
            <article key={card.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base uppercase tracking-wide">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function HowItWorksSection() {
  return (
    <Section tone="surface" id="how-it-works">
      <SectionHeading
        eyebrow="How It Works"
        title="Four simple steps"
        description="Everything can be arranged conveniently through WhatsApp."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((item) => (
          <article key={item.step} className="rounded-2xl border border-border bg-card p-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Step {item.step}
            </span>
            <h3 className="mt-3 text-base uppercase tracking-wide">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href={whatsappLink("Hello VenMax, I'd like to start a rental enquiry.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          Book on WhatsApp
        </a>
      </div>
    </Section>
  );
}

export function MileageSection() {
  return (
    <Section tone="surface" id="mileage">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Long-Distance"
          title="Flexible Mileage for Longer Trips"
          description="Planning a longer journey? VenMax can discuss customized mileage arrangements based on your trip."
        />
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            For rentals of one month or more, unlimited mileage is available.
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Customized mileage packages are available based on individual trip requirements.
          </div>
          <a
            href={whatsappLink("Hello VenMax, I'm planning a longer trip and would like to discuss mileage.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Discuss my trip on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Section>
  );
}

export function BookingPaymentSection() {
  return (
    <Section id="booking-payment">
      <SectionHeading
        eyebrow="Booking & Payment"
        title="Simple Booking. Direct Communication."
        description="Bookings are currently handled through WhatsApp or email, allowing customers to discuss their rental directly with the VenMax team."
      />
      <div className="mt-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Confirmed payment methods include
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {method}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Payment arrangements are agreed directly with the VenMax team.
        </p>
      </div>
    </Section>
  );
}

// Reused on the homepage teaser and (with `full`) the dedicated /diaspora page.
export function DiasporaSection({ full = false }: { full?: boolean } = {}) {
  return (
    <Section tone="navy" id="diaspora">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="For Diaspora"
            title="Serving Customers Around the World"
            description="Whether you're visiting family, attending an event, travelling for business or exploring Zimbabwe, you can contact VenMax before your trip and arrange your rental remotely."
            invert
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {diasporaMarkets.map((m) => (
              <span
                key={m}
                className="rounded-full border border-navy-foreground/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-foreground"
              >
                {m}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink(
                "Hi VenMax, I'm travelling to Zimbabwe from [COUNTRY] and would like to arrange a rental before my trip. Please help me with the options.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Plan My Rental on WhatsApp
            </a>
            {!full && (
              <a
                href="/diaspora"
                className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/30 px-6 py-3 text-sm font-semibold text-navy-foreground"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl sm:aspect-[3/4] lg:aspect-auto lg:min-h-[24rem]">
          <img
            src={airportImage}
            alt="VenMax vehicle pickup for an arriving traveller at the airport"
            loading="lazy"
            width={1200}
            height={1600}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </Section>
  );
}

export function DiasporaBenefitsSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Why Arrange Ahead"
        title="Made for customers travelling in"
        description="Everything can be arranged conveniently through WhatsApp."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {diasporaBenefits.map((b) => (
          <article key={b.title} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base uppercase tracking-wide">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
          </article>
        ))}
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
  const content = useSiteContent();
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
    { value: content["vehicle_models_display"] || fleetCountLabel(vehicles.length)?.replace(" vehicles", ""), label: "Vehicles" },
  ].filter((st): st is { value: string; label: string } => Boolean(st.value));

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
  const testimonials = useTestimonials();
  const avatarPalette = ["bg-primary", "bg-navy", "bg-emerald-600", "bg-sky-600", "bg-amber-600"];
  return (
    <Section>
      <SectionHeading
        eyebrow="Customer Reviews"
        title="Trusted by Customers Across Zimbabwe"
        description="Genuine reviews from VenMax customers on our Google Business Profile."
      />
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
              ))}
            </div>
            100+ Positive Ratings
          </div>
          <img
            src={logo}
            alt="VenMax Car Rental logo"
            loading="lazy"
            className="h-14 w-auto object-contain sm:h-16"
          />
        </div>
        <div className="mt-6 h-2.5 w-full rounded-full bg-navy sm:mt-8" />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-foreground">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
        100+ Positive Ratings
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
                    {"V"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Verified Customer</p>
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
                  Customer Review
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
  const faqs = useFaqs();
  return (
    <Section tone="surface" id="requirements">
      <SectionHeading
        eyebrow="Requirements & FAQ"
        title="Rental requirements and common questions"
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
      {standardMileagePolicy && (
        <p className="mt-3 text-center text-xs text-muted-foreground">{standardMileagePolicy}</p>
      )}

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
          title="Ready to book? Message us on WhatsApp"
          description="Send your vehicle choice and dates — the VenMax team will confirm availability and the next steps with you directly."
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
            Book on WhatsApp
          </a>
        </div>
      </div>
    </Section>
  );
}

export function CancellationSection() {
  return (
    <Section id="cancellation">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Cancellation & Refunds"
          title="Flexible Cancellation"
          description="In the event of an emergency or change of plans, customers can cancel their rental. VenMax does not charge a cancellation fee and refunds the exact amount paid."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base uppercase tracking-wide">Affordable Rental Rates</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Value-focused rental options for local and diaspora customers.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-base uppercase tracking-wide">Competitive Deposits</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Clear deposit amounts are shown on every vehicle.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
