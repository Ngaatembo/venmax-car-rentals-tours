import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { FleetSection, BookingCta } from "@/components/site/sections";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Fleet | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "The full VenMax fleet — economy hybrids, family SUVs, 4x4 pickups and premium 4x4s available for self-drive or chauffeur-driven hire in Harare.",
      },
    ],
  }),
  component: FleetPage,
});

function FleetPage() {
  return (
    <>
      <PageHero
        eyebrow="The Fleet"
        title="Vehicles for Every Journey"
        description="From fuel-efficient city cars to rugged 4x4s for Zimbabwe's terrain — every vehicle is well maintained, with transparent pricing and a refundable deposit."
      />
      <FleetSection />
      <BookingCta />
    </>
  );
}
