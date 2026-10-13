import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { buildSections } from "@/components/site/legal-sections/privacy";
import { useLegalOverride } from "@/lib/page-content";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://venmax.co.zw/privacy-policy" }],
    meta: [
      { property: "og:title", content: "Privacy Policy | VenMax Car Rental & Tours" },
      { property: "og:description", content: "How VenMax Car Rental & Tours collects, uses and looks after the personal information you share through this website, WhatsApp, email or phone." },
      { property: "og:url", content: "https://venmax.co.zw/privacy-policy" },
      { title: "Privacy Policy | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "How VenMax Car Rental & Tours collects, uses and looks after the personal information you share through this website, WhatsApp, email or phone.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const settings = useSiteSettings();
  const override = useLegalOverride("privacy");
  return (
    <LegalPage
      title="Privacy Policy"
      description="What personal information VenMax collects, why, and the choices you have — in plain language."
      updated="October 2026"
      currentHref="/privacy-policy"
      sections={override.sections ?? buildSections(settings)}
      whatsappMessage="Hello VenMax, I have a question about your Privacy Policy."
    />
  );
}
