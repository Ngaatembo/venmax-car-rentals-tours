import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeading } from "@/components/site/Section";
import { VehicleCard } from "@/components/site/VehicleCard";
import { requirements, rentalTerms, whatsappLink } from "@/data/venmax";
import { useVehicles } from "@/lib/live-content";

export const Route = createFileRoute("/self-drive-car-hire-harare")({
  head: () => ({
    meta: [
      { title: "Self-Drive Car Hire in Harare | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "Self-drive car hire in Harare, Zimbabwe with transparent pricing, free airport vehicle pickup with a hired vehicle and free vehicle delivery. Book any vehicle in the VenMax fleet on WhatsApp.",
      },
      { property: "og:title", content: "Self-Drive Car Hire in Harare | VenMax" },
      {
        property: "og:description",
        content:
          "Self-drive car hire in Harare with transparent pricing and free airport vehicle pickup with a hired vehicle. Book on WhatsApp.",
      },
    ],
  }),
  component: SelfDrivePage,
});

function SelfDrivePage() {
  const vehicles = useVehicles();

  return (
    <>
      <PageHero
        eyebrow="Self-Drive Car Hire"
        title="Self-drive car hire in Harare, on your own terms"
        description="Pick your own vehicle, keep your own schedule. VenMax's self-drive fleet covers everyday runabouts through to premium SUVs, with clear pricing and no in-person visit required to start the conversation."
      />

      <Section>
        <SectionHeading
          eyebrow="Why self-drive with VenMax"
          title="Built for people who'd rather drive themselves"
          description="No third-party aggregator, no hidden fees layered onto a quote — just a real Harare-based fleet with prices shown upfront."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Every price and deposit shown upfront — no back-and-forth for a quote",
            "Free airport vehicle pickup when you hire a VenMax vehicle",
            "Free vehicle delivery anywhere in Harare",
            "Multi-day hire discounts available",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-sm"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="The Fleet"
          title="Choose your self-drive vehicle"
          description="From economy hatchbacks to premium SUVs — every vehicle below is available for self-drive hire."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Requirements"
              title="What you need to self-drive"
              description="Straightforward requirements — no surprises on pickup day."
            />
            <div className="mt-8 space-y-6">
              {requirements.map((req) => (
                <div key={req.number} className="flex gap-4">
                  <span className="text-lg font-semibold text-primary">{req.number}</span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{req.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Rental Terms" title="Good to know before you book" />
            <div className="mt-8 space-y-5">
              {rentalTerms.map((term) => (
                <div key={term.label} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold text-foreground">{term.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{term.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="navy">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">Ready to book your self-drive vehicle?</h2>
          <p className="mt-4 text-navy-foreground/75">
            Confirm your vehicle and dates on WhatsApp, or fill in a booking request and we'll
            reply with availability and final pricing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(
                "Hello VenMax, I'd like to arrange a self-drive car hire in Harare.",
              )}
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
              Submit a booking request
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
