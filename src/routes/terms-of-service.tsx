import { createFileRoute } from "@tanstack/react-router";
import { standardMileagePolicy } from "@/data/venmax";
import { company } from "@/data/venmax";

export const Route = createFileRoute("/terms-of-service")({
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <div className="prose prose-sm mt-8 max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-3 [&_p]:leading-relaxed [&_li]:mt-1">
        <p>
          These terms govern your use of the {company.name} website and any vehicle rental,
          chauffeur service, airport transfer, shuttle, or tour booking made with us. By
          submitting a booking, you agree to these terms.
        </p>

        <h2>Bookings</h2>
        <p>
          Sending an enquiry through this website is a request, not a confirmed
          reservation. A booking is only confirmed once VenMax has verified availability and
          contacted you to confirm the details, dates, and price.
        </p>

        <h2>Self-drive rental requirements</h2>
        <p>To hire a vehicle for self-drive, you must provide:</p>
        <ul>
          <li>Drivers must be 25 years or older</li>
          <li>A valid driver's licence held for at least 2 years</li>
          <li>A valid ID and passport</li>
          <li>Proof of residence or employment</li>
          <li>Next of kin details, for use in an emergency</li>
        </ul>

        <h2>Mileage and fuel</h2>
        <p>
          {standardMileagePolicy ? `${standardMileagePolicy} ` : ""}
          Unlimited mileage is available for rentals of one month or more, and customized mileage
          arrangements can be discussed for longer trips. The renter pays for the fuel used during
          the rental and returns the vehicle with the same fuel level it was collected with.
        </p>

        <h2>Chauffeur service</h2>
        <p>
          A VenMax chauffeur can be arranged on any vehicle for an additional US$20/day (not
          included in the vehicle rental price). The client covers the driver's food and
          accommodation. The age requirement above applies to self-drive customers only, as the
          driver is provided by VenMax.
        </p>

        <h2>Payments and deposits</h2>
        <p>
          Rental rates are fixed once your booking is confirmed. A refundable security deposit is
          required. VenMax may deduct from the deposit for minor damage, excess mileage or other
          outstanding charges. The remaining deposit is refunded when the vehicle is returned, using
          the payment method agreed with you.
        </p>

        <h2>Cancellations</h2>
        <p>
          In the event of an emergency or change of plans, customers can cancel their rental.
          VenMax does not charge a cancellation fee. This applies to every booking, and the full
          amount paid is refunded within 3 business working days.
        </p>

        <h2>Vehicle condition and liability</h2>
        <p>
          Vehicles are provided in good working condition at the start of the rental. The renter
          is responsible for the vehicle during the rental period, including any traffic fines,
          tolls, or damage beyond normal wear and tear. VenMax is not liable for personal
          belongings left in a vehicle, or for delays caused by circumstances outside our
          reasonable control (e.g. weather, road closures, mechanical failure not caused by
          negligence).
        </p>

        <h2>Website use</h2>
        <p>
          You agree to provide accurate information when submitting a booking or enquiry, and not
          to use this website for any unlawful purpose. Content on this website (text, images,
          logo) belongs to {company.name} and may not be reproduced without permission.
        </p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of Zimbabwe.</p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${company.emails[0]}`} className="text-primary underline underline-offset-2">
            {company.emails[0]}
          </a>{" "}
          or {company.phones[0]}.
        </p>

      </div>
    </div>
  );
}
