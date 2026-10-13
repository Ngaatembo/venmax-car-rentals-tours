import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { buildSections } from "@/components/site/legal-sections/cookie";
import { useLegalOverride } from "@/lib/page-content";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://venmax.co.zw/cookie-policy" }],
    meta: [
      { property: "og:title", content: "Cookie Policy | VenMax Car Rental & Tours" },
      { property: "og:description", content: "VenMax's website uses only essential browser storage — no advertising or tracking cookies." },
      { property: "og:url", content: "https://venmax.co.zw/cookie-policy" },
      { title: "Cookie Policy | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "VenMax's website uses only essential browser storage — no advertising or tracking cookies.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  const settings = useSiteSettings();
  const override = useLegalOverride("cookie");
  return (
    <LegalPage
      title="Cookie Policy"
      description="How this website uses cookies and similar browser storage."
      updated={override.updated ?? "September 2026"}
      currentHref="/cookie-policy"
      sections={override.sections ?? buildSections(settings)}
      whatsappMessage="Hello VenMax, I have a question about your Cookie Policy."
    />
  );
}
