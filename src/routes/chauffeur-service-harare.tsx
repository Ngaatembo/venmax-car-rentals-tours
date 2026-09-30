import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { VehicleCard } from "@/components/site/VehicleCard";
import { buildWhyVenMax, whatsappLink } from "@/data/venmax";
import { policies, useSiteSettings } from "@/lib/site-settings";
import { useVehicles } from "@/lib/live-content";

export const Route = createFileRoute("/chauffeur-service-harare")({
  head: () => ({
    meta: [
      { title: "Chauffeur Service in Harare | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "Professional chauffeur service in Harare, Zimbabwe for business meetings, events and long-distance travel. Available on any vehicle in the VenMax fleet — book on WhatsApp.",
      },
      { property: "og:title", content: "Chauffeur Service in Harare | VenMax" },
      {
        property: "og:description",
        content:
          "Professional chauffeur service in Harare for business travel, events and long trips. Book on WhatsApp.",
      },
    ],
  }),
  component: ChauffeurPage,
});

const useCases = [
  {
    title: "Business meetings",
    description: "Arrive ready to work instead of arriving as the driver.",
  },
  {
    title: "Events & weddings",
    description: "Dress up, not stress about parking or a designated driver.",
  },
  {
    title: "Long-distance travel",
    description: "Share the driving on longer routes across Zimbabwe.",
  },
  {
    title: "Visitors to Harare",
    description: "Someone who knows the roads, so you don't have to learn them on the fly.",
  },
];

function ChauffeurPage() {
  const vehicles = useVehicles();
  const p = policies(useSiteSettings());
  const covers = p.chauffeurClientCovers ? ` ${p.chauffeurClientCovers}` : "";

  return (
    <>
      <PageHero
        eyebrow="Chauffeur Service"
        title="A professional driver, any vehicle in the fleet"
        description={`Sit back and let someone else handle the roads. VenMax's chauffeur option is available on any vehicle in the fleet — book the car you want, then add a driver. Chauffeur service is available for an additional ${p.chauffeurFee}.${covers}`}
      />

      <Section>
        <SectionHeading
          eyebrow="Who it's for"
          title="When you'd rather not be the one driving"
          align="center"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Why VenMax"
          title="What you get with a VenMax chauffeur booking"
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {buildWhyVenMax(p).map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Available Vehicles"
          title="Chauffeur service is available on any vehicle below"
          description={`Pick the vehicle that suits the occasion — the chauffeur option applies fleet-wide. Chauffeur service is available for an additional ${p.chauffeurFee} (not included in the vehicle rental price).${covers}`}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">Ready to book a chauffeur?</h2>
          <p className="mt-4 text-navy-foreground/75">
            Tell us the vehicle, occasion and dates on WhatsApp, or send an enquiry and
            we'll confirm availability and pricing directly.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink("Hello VenMax, I'd like to enquire about your chauffeur service.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp VenMax
            </a>
            <Link
              to="/book"
              className="inline-flex items-center rounded-full border border-navy-foreground/30 px-6 py-3 text-sm font-semibold text-navy-foreground hover:bg-navy-foreground/10"
            >
              Send an enquiry
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
