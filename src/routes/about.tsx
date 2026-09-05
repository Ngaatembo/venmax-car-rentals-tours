import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import {
  AboutSection,
  BookingCta,
  CoreValuesSection,
  MissionVisionSection,
  OfferAndLeadershipSection,
} from "@/components/site/sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "VenMax's story, mission, vision and the values behind our car rental, self-drive, chauffeur and tour services in Harare, Zimbabwe.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About VenMax"
        title="Driving a brighter future together"
        description="Who we are, what we stand for, and the team behind every VenMax journey."
      />
      <AboutSection />
      <MissionVisionSection />
      <CoreValuesSection />
      <OfferAndLeadershipSection />
      <BookingCta />
    </>
  );
}
