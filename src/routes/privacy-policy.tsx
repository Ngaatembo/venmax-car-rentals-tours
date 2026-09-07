import { createFileRoute } from "@tanstack/react-router";
import { company } from "@/data/venmax";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <div className="prose prose-sm mt-8 max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-3 [&_p]:leading-relaxed [&_li]:mt-1">
        <p>
          {company.name} ("VenMax", "we", "us") respects your privacy. This policy explains what
          personal information we collect when you use our website or book a vehicle, tour, or
          transfer with us, why we collect it, and what rights you have over it.
        </p>

        <h2>Information we collect</h2>
        <p>When you make a booking or contact us, we may collect:</p>
        <ul>
          <li>Full name, phone number, and email address</li>
          <li>Pickup/drop-off location and rental or travel dates</li>
          <li>
            For self-drive rentals: driver's license number and expiry, and a form of
            identification (national ID or passport number)
          </li>
          <li>Residential or business address</li>
          <li>Any message or notes you provide with a booking or enquiry</li>
          <li>Payment confirmation details relevant to your booking (we do not store full card numbers)</li>
        </ul>
        <p>
          We only collect what is reasonably needed to process a rental, tour booking, or
          enquiry — we do not collect this information for advertising or resell it to third
          parties.
        </p>

        <h2>How we use your information</h2>
        <ul>
          <li>To confirm and manage your booking, including vehicle handover and return</li>
          <li>To verify eligibility to drive (license validity) for self-drive rentals</li>
          <li>To contact you about your booking via phone, WhatsApp, or email</li>
          <li>To respond to enquiries submitted through our contact form</li>
          <li>To meet legal or insurance obligations connected to vehicle rental</li>
        </ul>

        <h2>Where your information is stored</h2>
        <p>
          Booking and customer data is stored in a secured, access-controlled database
          (Supabase, hosted in the EU/UK region) and is only accessible to authorized VenMax
          staff who need it to fulfil your booking. Access is protected by account-level
          permissions and is not publicly accessible.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We retain booking and customer records for as long as needed to fulfil the rental
          relationship and to meet reasonable business, insurance, or legal record-keeping needs.
          You may request deletion of your data at any time (see "Your rights" below), subject to
          any records we are legally required to keep.
        </p>

        <h2>Who we share it with</h2>
        <p>
          We do not sell your personal information. We may share limited details with insurance
          providers or relevant authorities where required by law, or in connection with an
          accident, dispute, or claim involving a rented vehicle.
        </p>

        <h2>Your rights</h2>
        <p>You can ask us at any time to:</p>
        <ul>
          <li>Provide a copy of the personal information we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Delete your information, where we are not required to keep it</li>
        </ul>
        <p>
          To make a request, contact us using the details below. We will respond within a
          reasonable time.
        </p>

        <h2>Cookies</h2>
        <p>
          Our website uses only essential cookies needed for the site and admin panel to
          function (such as keeping you signed in). See our{" "}
          <a href="/cookie-policy" className="text-primary underline underline-offset-2">
            Cookie Policy
          </a>{" "}
          for details.
        </p>

        <h2>Contact us</h2>
        <p>
          For any privacy question or request, contact us at{" "}
          <a href={`mailto:${company.emails[0]}`} className="text-primary underline underline-offset-2">
            {company.emails[0]}
          </a>{" "}
          or {company.phones[0]}.
        </p>

        <p className="mt-8 text-xs text-muted-foreground">
          This policy is provided as a good-faith summary of our data practices and is not a
          substitute for legal advice. VenMax recommends this policy be reviewed by a qualified
          lawyer in Zimbabwe to confirm alignment with the Cyber and Data Protection Act [Chapter
          12:07] and any other applicable law before relying on it as a binding legal document.
        </p>
      </div>
    </div>
  );
}
