import { useEffect, useMemo, useState } from "react";
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
import roadImage from "@/assets/hero-harare.jpg";
import brandPromiseImage from "@/assets/venmax-serena-road.jpg";
import happyClientImage from "@/assets/venmax-happy-client.jpg";
import logo from "@/assets/logo-header.png";
import {
  businessFacts,
  company,
  diasporaMarkets,
  howItWorks,
  valueCards,
  fleetCountLabel,
  type Vehicle,
  googleMaps,
  trustPoints,
  whatsappLink,
  buildDiasporaBenefits,
  buildRentalTerms,
  buildRequirements,
  buildWhyVenMax,
} from "@/data/venmax";
import { useFleet, useVehicles, useTours, useSiteContent, useServices, useFaqs, useTestimonials } from "@/lib/live-content";
import { cn } from "@/lib/utils";
import { fillTokens, phoneHref, policies, useSiteSettings } from "@/lib/site-settings";
import { usePageContent } from "@/lib/page-content";

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
  const content = usePageContent();
  return (
    <Section id="values">
      <SectionHeading
        eyebrow="What Drives Us"
        title="Our Core Values"
        description="The principles that shape every rental, every trip, and every conversation with VenMax."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {content.coreValues.map((value) => (
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
  const content = usePageContent();
  return (
    <Section tone="surface">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="What We Offer" title="Built around your convenience" />
          <ul className="mt-6 space-y-4">
            {content.whatWeOffer.map((item) => (
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
            {content.leadership}
          </p>
        </div>
      </div>
    </Section>
  );
}

export function MissionVisionSection() {
  const content = usePageContent();
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
          <p className="mt-4 text-lg leading-relaxed text-navy-foreground">{content.vision}</p>
        </div>
        <div className="rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-8">
          <p className="eyebrow text-primary">Our Mission</p>
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/85">
            {content.mission}
          </p>
        </div>
      </div>
    </Section>
  );
}

export function AboutSection({ showCta = false }: { showCta?: boolean } = {}) {
  const content = usePageContent();
  return (
    <Section id="about">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="About VenMax"
          title="Why Choose VenMax?"
          align="center"
        />
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
          {content.aboutParagraphs.map((para) => {
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
          <span className="text-muted-foreground">{content.targetMarket}</span>
        </p>
        <blockquote className="mt-8 rounded-2xl border border-border bg-card px-6 py-5 text-base font-semibold leading-relaxed text-primary">
          “{content.brandQuote}”
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
  const modelsDisplay = useSiteContent()["vehicle_models_display"];
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
      <div
        className={cn(
          "mt-10 grid gap-6 sm:grid-cols-2",
          list.length > 2 ? "lg:grid-cols-3" : "mx-auto max-w-4xl",
        )}
      >
        {list.map((vehicle) => (
          <VehicleCard key={vehicle.slug} vehicle={vehicle} />
        ))}
      </div>
      <div className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[1fr_20rem]">
        <div className="flex flex-col justify-center p-8 text-center md:p-10 md:text-left">
          <h3 className="text-xl">Explore the Full Fleet</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            VenMax has {modelsDisplay ? `${modelsDisplay} vehicle models` : "a wide range of vehicles"}{" "}
            for city driving, family trips, business travel and longer journeys.
          </p>
          <div>
            <a
              href="/fleet"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              View All Vehicles
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/5] bg-secondary md:aspect-auto md:min-h-[26rem]">
          <img
            src="/videos/fleet-lineup-poster.jpg"
            alt="VenMax vehicles parked in a row: a Toyota Hilux, a Mazda CX-5 and a Nissan Serena"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[50%_50%]"
          />
          <AmbientVideo
            base="/videos/fleet-lineup"
            poster="/videos/fleet-lineup-poster.jpg"
            label="A walk along VenMax vehicles parked in a row"
          />
        </div>
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
  // Admin-editable marketing figure (site_content.vehicle_models_display, e.g. "40+").
  const modelsDisplay = useSiteContent()["vehicle_models_display"];
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
      {modelsDisplay && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-foreground">
              VenMax has {modelsDisplay} vehicle models.
            </span>{" "}
            <span className="text-muted-foreground">
              These are the vehicles currently listed online — if you need something you don't see,
              ask us and we'll check.
            </span>
          </p>
          <a
            href={whatsappLink(
              "Hi VenMax, I'm looking for a vehicle I didn't see on the website. Can you help me find one?",
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground sm:self-auto"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Ask on WhatsApp
          </a>
        </div>
      )}

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

export function ChauffeurSection() {
  const p = policies(useSiteSettings());
  const services = useServices();
  const chauffeur = services.find((s) => s.slug === "chauffeur");

  return (
    <Section id="services">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl bg-navy lg:order-none lg:aspect-auto lg:min-h-[30rem]">
          <img
            src={chauffeurImage}
            alt="A black VenMax executive SUV available with a professional driver"
            loading="lazy"
            width={678}
            height={1080}
            // Tall photo: the vehicle sits in the lower-middle of the frame.
            className="absolute inset-0 h-full w-full object-cover object-[50%_62%]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            With a Driver
          </span>
        </div>
        <div>
          <SectionHeading
            eyebrow="Professional Drivers"
            title="Chauffeur Services"
            description={
              chauffeur?.description ??
              "Sit back with a professional driver for business meetings, events and long-distance travel."
            }
          />
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Executive travel with a professional driver",
              "Business meetings, events and long-distance journeys",
              p.chauffeurFeeNote,
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={whatsappLink(
                chauffeur?.whatsapp ?? "Hello VenMax, I'd like to enquire about your chauffeur services.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Book Chauffeur
            </a>
            <a
              href="/chauffeur-service-harare"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ToursTeaserSection() {
  const tours = useTours();
  const tour = tours[0];
  if (!tour) return null;

  return (
    <Section tone="surface" id="experiences">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Zimbabwe Experiences"
            title="Custom Tours"
            description="Tailored travel packages to Victoria Falls, Hwange, Great Zimbabwe and beyond — corporate retreats or family safaris."
          />
          <a
            href="/tours"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Plan Your Tour
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
          <img
            src={tour.image}
            alt={`${tour.name}, Zimbabwe`}
            loading="lazy"
            width={1920}
            height={1278}
            className="h-full w-full object-cover object-[50%_45%]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            {tour.name}
          </span>
          <a
            href="/tours#photo-credits"
            className="absolute bottom-3 right-3 rounded-full bg-navy/70 px-2.5 py-1 text-[10px] text-navy-foreground/80 hover:text-navy-foreground"
          >
            Photo credits
          </a>
        </div>
      </div>
    </Section>
  );
}

// Kept for reuse but no longer rendered directly on the homepage — its
// "free airport pickup" message now lives in the Services & Tours card and
// the Why Choose Us feature row instead.
export function AirportSection() {
  const p = policies(useSiteSettings());
  return (
    <Section id="airport">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[30rem]">
          <img
            src={airportImage}
            alt="A VenMax Toyota Hilux parked in front of Harare's airport control tower"
            loading="lazy"
            width={1200}
            height={1600}
            // Portrait photo: keep the control tower AND the front of the vehicle in frame.
            className="absolute inset-0 h-full w-full object-cover object-[50%_42%] lg:object-[50%_25%]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            Airport Services
          </span>
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
                Airport shuttle · {p.shuttlePerTrip}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Harare airport shuttle services are available at {p.shuttlePerTrip}. Ask about airport
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

export function PriceAdvantageSection() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Why VenMax"
        title="Lower deposits. Fairer rates. Drive away sooner."
        description="Pay less upfront. Our small and mid SUVs need just a $100 refundable deposit, lower than most car hire companies in Zimbabwe."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-primary/40 bg-card p-6 sm:p-8">
          <h3 className="text-base uppercase tracking-wide">Deposits below market rates</h3>
          <p className="mt-4 text-4xl font-semibold text-primary">From $100</p>
          <p className="mt-1 text-sm text-muted-foreground">Refundable deposit on small and mid SUVs</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Lower than most in the market, and shown clearly on every vehicle.
          </p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h3 className="text-base uppercase tracking-wide">Affordable rental rates</h3>
          <p className="mt-4 text-4xl font-semibold text-primary">From $40/day</p>
          <p className="mt-1 text-sm text-muted-foreground">Value-focused options for local and diaspora customers</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Clear daily rates and deposits, so you know the cost before you book.
          </p>
        </article>
      </div>
    </Section>
  );
}

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
  const p = policies(useSiteSettings());
  return (
    <Section tone="surface" id="mileage">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
          <img
            src={roadImage}
            alt="A long tree-lined road in Zimbabwe"
            loading="lazy"
            width={1920}
            height={1080}
            // Road vanishes toward the centre-left; keep it and the tree canopy in frame on mobile.
            className="h-full w-full object-cover object-[42%_50%]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            Long-distance
          </span>
        </div>
        <div>
          <SectionHeading
            eyebrow="Long-Distance"
            title="Flexible Mileage for Longer Trips"
            description="Planning a longer journey? VenMax offers tourists and clients affordable customised mileage packages, arranged case by case for each trip."
          />
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {p.standardMileage}
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {p.unlimitedSentence}
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Affordable customised mileage packages for tourists and clients on longer trips, arranged case by case.
            </div>
            <a
              href={whatsappLink(
                "Hello VenMax, I'm planning a longer trip and would like to discuss mileage.",
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Discuss my trip on WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function BookingPaymentSection() {
  const p = policies(useSiteSettings());
  return (
    <Section id="booking-payment">
      <SectionHeading
        eyebrow="Booking & Payment"
        title="Simple Booking. Direct Communication."
        description="Booking with VenMax is simple: everything is discussed and confirmed directly with our team via WhatsApp or email."
      />
      <div className="mt-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Confirmed payment methods include
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {p.paymentMethods.map((method) => (
            <span
              key={method}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {method}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Once your booking is confirmed, you pay the vehicle's refundable deposit to secure it. The
          balance can be paid on or before the day you collect the vehicle. Payment arrangements are
          agreed directly with the VenMax team.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm">
          <p className="font-semibold">{p.deliveryNote}</p>
          <p className="mt-1 text-muted-foreground">
            This is vehicle delivery for rental customers — separate from the airport shuttle
            ({p.shuttlePerTrip}).
          </p>
        </div>
      </div>
    </Section>
  );
}

// SVG flags (public/flags, from country-flag-icons, MIT) — emoji flags render as
// plain letters on Windows, so they looked inconsistent across devices.
const marketFlags: Record<string, string> = {
  UK: "/flags/gb.svg",
  USA: "/flags/us.svg",
  Canada: "/flags/ca.svg",
  Australia: "/flags/au.svg",
  "South Africa": "/flags/za.svg",
  Sweden: "/flags/se.svg",
  Europe: "/flags/eu.svg",
};

/**
 * Dedicated diaspora visual: VenMax's own footage of RGM International Airport arrivals plays
 * over an illustration (the fallback on slow connections or with reduced motion). No stock
 * photo is used, so nothing can be mistaken for a real VenMax customer.
 */
/**
 * Muted looping clip laid over a still image once it can play. The still stays as the
 * fallback (slow connection, playback error, or reduced-motion preference).
 */
function AmbientVideo({
  base,
  poster,
  label,
  caption,
}: {
  base: string;
  poster: string;
  label: string;
  caption?: string;
}) {
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    try {
      setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch {
      setReduceMotion(true);
    }
  }, []);
  if (reduceMotion) return null;
  return (
    <>
      <video
        className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onCanPlay={() => setReady(true)}
        onError={() => setReady(false)}
      >
        <source src={`${base}.webm`} type="video/webm" />
        <source src={`${base}.mp4`} type="video/mp4" />
      </video>
      {ready && caption && (
        <span className="absolute bottom-4 left-4 z-20 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
          {caption}
        </span>
      )}
    </>
  );
}

function DiasporaVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-[#16213a] via-navy to-[#0b1220] lg:mx-0 lg:ml-auto">
      <AmbientVideo
        base="/videos/harare-arrivals"
        poster="/videos/harare-arrivals-poster.jpg"
        label="RGM International Airport, international arrivals entrance"
        caption="RGM International Airport Arrivals"
      />

      <svg
        viewBox="0 0 400 500"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Illustration: a rental arranged on WhatsApp from abroad, with the vehicle ready on arrival in Zimbabwe"
      >
        <defs>
          <linearGradient id="dv-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="320" cy="90" r="70" fill="url(#dv-glow)" />
        {/* flight path from abroad to Zimbabwe */}
        <path
          d="M50 150 C 150 40, 300 60, 330 250"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
        <circle cx="50" cy="150" r="7" fill="#ffffff" fillOpacity="0.8" />
        <g transform="translate(330 262)">
          <circle r="16" fill="#d9002f" />
          <circle r="6" fill="#fff" />
        </g>
        {/* plane */}
        <g transform="translate(190 68) rotate(35)" fill="#ffffff">
          <path d="M0 -14 L4 -3 L20 5 L20 9 L4 5 L3 14 L8 18 L8 21 L0 19 L-8 21 L-8 18 L-3 14 L-4 5 L-20 9 L-20 5 L-4 -3 Z" />
        </g>
        <g transform="translate(0 -70)">
        {/* road */}
        <path d="M-10 470 L410 420 L410 510 L-10 510 Z" fill="#0b1220" />
        <path d="M0 462 L400 416" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="14 12" />
        {/* car silhouette */}
        <g transform="translate(150 372)" fill="#ffffff" fillOpacity="0.92">
          <path d="M0 52 L8 30 C12 20 20 14 32 14 L88 14 C100 14 108 20 114 30 L130 44 L136 46 C140 47 142 50 142 54 L142 60 L0 60 Z" />
          <circle cx="34" cy="62" r="12" fill="#0b1220" />
          <circle cx="34" cy="62" r="6" fill="#ffffff" fillOpacity="0.9" />
          <circle cx="110" cy="62" r="12" fill="#0b1220" />
          <circle cx="110" cy="62" r="6" fill="#ffffff" fillOpacity="0.9" />
        </g>
        {/* suitcase */}
        <g transform="translate(60 396)">
          <rect x="0" y="10" width="46" height="52" rx="7" fill="#d9002f" />
          <rect x="14" y="0" width="18" height="12" rx="4" fill="none" stroke="#ffffff" strokeWidth="3" />
          <rect x="6" y="20" width="34" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.5" />
          <rect x="6" y="30" width="34" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.5" />
        </g>
        </g>
        {/* chat bubble */}
        <g transform="translate(40 200)">
          <rect width="150" height="70" rx="16" fill="#25D366" />
          <path d="M28 70 L20 92 L50 70 Z" fill="#25D366" />
          <rect x="18" y="18" width="98" height="8" rx="4" fill="#ffffff" fillOpacity="0.9" />
          <rect x="18" y="34" width="70" height="8" rx="4" fill="#ffffff" fillOpacity="0.7" />
          <path d="M112 48 l8 8 l16 -18" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <span className="absolute left-4 top-4 rounded-full bg-navy-foreground/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-navy">
        Arrange before you arrive
      </span>
      <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12 text-sm text-navy-foreground/90">
        You're abroad. You're coming to Zimbabwe. Your rental can already be arranged.
      </p>
    </div>
  );
}

// Reused on the homepage teaser and (with `full`) the dedicated /diaspora page.
export function DiasporaSection({ full = false }: { full?: boolean } = {}) {
  const content = usePageContent();
  return (
    <Section tone="navy" id="diaspora">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="For Diaspora"
            title={content.diasporaHeading}
            description={content.diasporaDescription}
            invert
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {diasporaMarkets.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-navy-foreground"
              >
                {marketFlags[m] && (
                  <img
                    src={marketFlags[m]}
                    alt=""
                    aria-hidden="true"
                    width={21}
                    height={14}
                    className="h-3.5 w-[21px] shrink-0 rounded-[2px] object-cover ring-1 ring-white/20"
                  />
                )}
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
        <DiasporaVisual />
      </div>
    </Section>
  );
}

export function DiasporaBenefitsSection() {
  const p = policies(useSiteSettings());
  return (
    <Section>
      <SectionHeading
        eyebrow="Why Arrange Ahead"
        title="Made for customers travelling in"
        description="Everything can be arranged conveniently through WhatsApp."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {buildDiasporaBenefits(p).map((b) => (
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
            <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground shadow backdrop-blur-sm">
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
  const settings = useSiteSettings();
  const p = policies(settings);
  const vehicles = useVehicles();
  const content = useSiteContent();
  const startingPrice = vehicles.reduce<number | null>((min, v) => {
    const match = v.priceLabel.match(/\$(\d+)/);
    if (!match) return min;
    const price = Number(match[1]);
    return min === null || price < min ? price : min;
  }, null);

  const stats = [
    { value: `${settings.stat_google_rating}★`, label: "Google Rating" },
    { value: startingPrice ? `$${startingPrice}` : "$40", label: "Starting Price/Day" },
    { value: settings.stat_happy_clients, label: "Happy Clients" },
    { value: content["vehicle_models_display"] || fleetCountLabel(vehicles.length)?.replace(" vehicles", ""), label: "Vehicle Models" },
  ].filter((st): st is { value: string; label: string } => Boolean(st.value));

  const featureRows = buildWhyVenMax(p).slice(0, 4);

  return (
    <Section tone="navy" id="why-venmax">
      <SectionHeading
        eyebrow="Trusted in Harare"
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

// Brand banner beside a real VenMax photo: the Serena out on a gravel road trip.
// Photo-beside-text (stacked on phones) because the client photo is too small to
// stretch full-bleed without going soft.
export function BrandPromiseSection() {
  return (
    <section className="bg-navy text-navy-foreground">
      <div className="grid lg:min-h-[30rem] lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:order-2 lg:aspect-auto">
          <img
            src={brandPromiseImage}
            alt="A VenMax Nissan Serena on a gravel road through the trees"
            loading="lazy"
            width={676}
            height={507}
            className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
          />
          <div className="absolute inset-y-0 left-0 hidden w-1/4 bg-gradient-to-r from-navy to-transparent lg:block" />
        </div>
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:py-16 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-12">
          <p className="eyebrow text-primary">Our Promise</p>
          <h2 className="mt-3 max-w-xl text-3xl leading-tight sm:text-4xl">
            Drive More. Spend Less. Travel Better.
          </h2>
          <p className="mt-3 text-sm text-navy-foreground/80">VenMax Car Rental &amp; Tours</p>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const settings = useSiteSettings();
  const testimonials = useTestimonials();
  const avatarPalette = ["bg-primary", "bg-navy", "bg-emerald-600", "bg-sky-600", "bg-amber-600"];
  return (
    <Section>
      <SectionHeading
        eyebrow="Customer Reviews"
        title="Trusted by Customers Across Zimbabwe and Abroad"
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
      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-navy text-navy-foreground shadow-xl">
        <div className="grid items-stretch md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[360px] overflow-hidden md:min-h-[430px]">
            <img
              src={happyClientImage}
              alt="A happy VenMax customer enjoying a rental vehicle"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-navy/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              Real customer experience
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <div className="flex items-center gap-1.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
              Real people. Real journeys.
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              One of our happy clients, captured during her VenMax rental. We love seeing our customers enjoy the freedom to drive, explore and experience Zimbabwe.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={whatsappLink("Hi VenMax, I'd like to enquire about renting a vehicle.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Start Your Journey
              </a>
              <Link
                to="/fleet"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-foreground">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
        <a href={googleMaps.place} target="_blank" rel="noreferrer" className="hover:underline">
          {settings.hero_trust_rating}
        </a>
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
                    {t.name.trim().charAt(0).toUpperCase() || "V"}
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
                  Google review
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
  const p = policies(useSiteSettings());
  const faqs = useFaqs();
  return (
    <Section tone="surface" id="requirements">
      <SectionHeading
        eyebrow="Requirements & FAQ"
        title="Rental requirements and common questions"
        description="Simple, straightforward requirements — kept easy to read so you can get on the road quickly."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {buildRequirements(p).map((req) => (
          <article key={req.number} className="rounded-2xl border border-border bg-card p-6">
            <span className="text-2xl font-semibold text-primary">{req.number}</span>
            <h3 className="mt-3 text-base">{req.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{req.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        {buildRentalTerms(p).map((term) => (
          <div key={term.label}>
            <p className="eyebrow">{term.label}</p>
            <p className="mt-2 text-sm">{term.value}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <h3 className="text-center text-xl">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`}>
              <AccordionTrigger>{fillTokens(faq.question, p)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{fillTokens(faq.answer, p)}</AccordionContent>
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

type EmbedPlatform = "instagram" | "tiktok" | "facebook" | "linkedin" | null;

function detectSocialPlatform(url: string): EmbedPlatform {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/facebook\.com|fb\.watch/.test(url)) return "facebook";
  if (/linkedin\.com|lnkd\.in/.test(url)) return "linkedin";
  return null;
}

const platformLabel: Record<Exclude<EmbedPlatform, null>, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  linkedin: "LinkedIn",
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
        description="Real posts from our social pages — fleet updates, offers and the road ahead."
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
  const settings = useSiteSettings();
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
            href={phoneHref(settings.contact_phone_primary)}
            className="inline-flex items-center gap-2 rounded-full bg-navy-foreground px-6 py-3 text-sm font-semibold text-navy"
          >
            {settings.contact_phone_primary}
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
  const p = policies(useSiteSettings());
  return (
    <Section id="cancellation">
      <div className="grid items-start gap-8">
        <SectionHeading
          eyebrow="Cancellation & Refunds"
          title="Flexible Cancellation"
          description={`In the event of an emergency or change of plans, customers can cancel their rental. VenMax does not charge a cancellation fee, and the full amount paid is refunded within ${p.refundDays} business working days. This applies to every booking.`}
        />
      </div>
    </Section>
  );
}
