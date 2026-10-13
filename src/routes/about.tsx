import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { usePageContent } from "@/lib/page-content";
import {
  AboutSection,
  BookingCta,
  CoreValuesSection,
  MissionVisionSection,
  OfferAndLeadershipSection,
} from "@/components/site/sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://venmax.co.zw/about" }],
    meta: [
      { property: "og:title", content: "About Us | VenMax Car Rental & Tours" },
      { property: "og:description", content: "VenMax's story, mission, vision and the values behind our car rental, self-drive, chauffeur and tour services in Harare, Zimbabwe." },
      { property: "og:url", content: "https://venmax.co.zw/about" },
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
  const content = usePageContent();
  return (
    <>
      <PageHero
        eyebrow="About VenMax"
        title={content.aboutHeroTitle}
        description={content.aboutHeroDescription}
      />
      <AboutSection />
      <MissionVisionSection />
      <CoreValuesSection />
      <OfferAndLeadershipSection />
      <BookingCta />
    </>
  );
}
