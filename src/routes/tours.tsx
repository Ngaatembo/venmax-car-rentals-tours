import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ToursSection, BookingCta } from "@/components/site/sections";

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Tours in Zimbabwe | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "Custom Zimbabwe travel packages from VenMax — Victoria Falls, Hwange, Great Zimbabwe, Matobo Hills and Harare, with the vehicle and route sorted for you.",
      },
    ],
  }),
  component: ToursPage,
});

function ToursPage() {
  return (
    <>
      <PageHero
        eyebrow="Zimbabwe Experiences"
        title="Explore Zimbabwe with VenMax"
        description="Custom itineraries to the country's most extraordinary places — the vehicle is just how you get there."
      />
      <ToursSection />
      <BookingCta />
    </>
  );
}
