import { createFileRoute } from "@tanstack/react-router";
import { LegalLink, LegalPage } from "@/components/site/LegalPage";
import { AtAGlance, buildSections } from "@/components/site/legal-sections/terms";
import { useLegalOverride } from "@/lib/page-content";
import { company } from "@/data/venmax";
import { policies, useSiteSettings } from "@/lib/site-settings";
import { useVehicles } from "@/lib/live-content";

// Route kept at /terms-of-service so existing links keep working.

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Rental Terms & Conditions | VenMax Car Rental & Tours" },
      {
        name: "description",
        content:
          "VenMax rental terms: eligibility, rates and refundable deposits, 200 km/day mileage, fuel, insurance, airport services, chauffeur hire, payments, cancellations and booking on WhatsApp.",
      },
    ],
  }),
  component: RentalTermsPage,
});

function RentalTermsPage() {
  const vehicles = useVehicles();
  const settings = useSiteSettings();
  const p = policies(settings);
  const override = useLegalOverride("terms");
  return (
    <LegalPage
      title="Rental Terms & Conditions"
      description="The terms that apply when you rent a vehicle or book a chauffeur, airport service, shuttle or tour with VenMax."
      updated="October 2026"
      currentHref="/terms-of-service"
      intro={
        <p>
          These terms apply to every vehicle rental, chauffeur hire, airport service, shuttle or
          tour booked with {company.name}. By confirming a booking with VenMax, you agree to them.
          How we handle your personal information is covered separately in our{" "}
          <LegalLink href="/privacy-policy">Privacy Policy</LegalLink>.
        </p>
      }
      lead={<AtAGlance p={p} />}
      sections={override.sections ?? buildSections(vehicles, p)}
      closing={
        <>
          <p>
            Please give accurate information when you make an enquiry or booking. Content on this
            website (text, images, logo) belongs to {company.name} and may not be reproduced without
            permission. These terms are governed by the laws of Zimbabwe.
          </p>
          <p>
            Questions about these terms:{" "}
            <LegalLink href={`mailto:${settings.contact_email_sales}`}>{settings.contact_email_sales}</LegalLink> or{" "}
            {settings.contact_phone_primary}.
          </p>
        </>
      }
      whatsappMessage="Hello VenMax, I have a question about your Rental Terms & Conditions."
    />
  );
}
