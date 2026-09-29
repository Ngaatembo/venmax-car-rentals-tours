import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { FleetCatalogue, BookingCta } from "@/components/site/sections";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Car Rental Fleet Harare | Daily Rates from $40 | VenMax" },
      {
        name: "description",
        content:
          "Browse the VenMax fleet — hybrids, SUVs, a Hilux D4D truck and premium 4x4s with clear daily rates and deposits. Book on WhatsApp.",
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
        title="Explore the VenMax Fleet"
        description="From fuel-efficient city cars to rugged 4x4s for Zimbabwe's terrain — browse the full range, with the daily rate and deposit shown for every vehicle."
      />
      <FleetCatalogue />
      <BookingCta />
    </>
  );
}
