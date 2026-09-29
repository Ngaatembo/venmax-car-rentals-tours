import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Bullets, LegalLink, LegalPage, type LegalSection } from "@/components/site/LegalPage";
import { company, whatsappLink } from "@/data/venmax";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
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

const address = company.addressLines.join(", ");

// Only states what VenMax has confirmed or what this website demonstrably does.
// No retention periods, security certifications or data-sharing arrangements are
// claimed — add them here only once VenMax confirms them.
const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who We Are",
    content: (
      <>
        <p>
          {company.name} ("VenMax", "we", "us") is a car rental and tours company based at{" "}
          {address}.
        </p>
        <p>
          This policy explains what personal information we collect when you use this website or
          contact us about a rental, chauffeur hire, airport service, shuttle or tour, why we use
          it, and the choices you have.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p>We only ask for what we need to handle your enquiry or booking:</p>
        <Bullets
          items={[
            <>
              <strong>Contact details</strong> — your name, phone number and email address.
            </>,
            <>
              <strong>Booking details</strong> — the service, vehicle or tour you're interested in,
              your dates, pick-up or delivery location, and any notes you add.
            </>,
            <>
              <strong>Your messages</strong> — what you send us through the website forms,
              WhatsApp, email or phone.
            </>,
            <>
              <strong>Rental requirements</strong> — for self-drive hire, the documents and details
              listed in our <LegalLink href="/terms-of-service#rental-eligibility">Rental Terms &amp; Conditions</LegalLink>{" "}
              (ID and passport, driver's licence, proof of residence or employment, and next of kin
              details). These are shared with the VenMax team when your rental is arranged — the
              website forms do not ask you to upload documents.
            </>,
            <>
              <strong>Your location, only if you choose</strong> — if you tap "Use my current
              location" on a booking form, your browser asks your permission and then shares your
              position once to fill in the pick-up address.
            </>,
          ]}
        />
        <p>
          This website does not take payments online and never asks for card or bank details.
          Payments are arranged directly with the VenMax team.
        </p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why We Use It",
    content: (
      <>
        <Bullets
          items={[
            "To reply to your enquiry and arrange your booking — availability, dates, price, delivery or pick-up.",
            "To check that you meet the rental requirements for self-drive hire.",
            "To keep in touch with you about your booking before, during and after the rental.",
            "To contact your next of kin in an emergency.",
            "To handle deposits, cancellations, refunds, excess mileage, traffic fines, tolls or damage connected with a rental.",
            "To meet our legal obligations.",
          ]}
        />
        <p>VenMax does not sell your personal information.</p>
      </>
    ),
  },
  {
    id: "who-may-receive-it",
    title: "Who May Receive It",
    content: (
      <>
        <Bullets
          items={[
            <>
              <strong>The VenMax team</strong> — the staff who arrange and manage your booking.
            </>,
            <>
              <strong>The services this website runs on</strong> — the website's hosting and
              database providers store form submissions for VenMax.
            </>,
            <>
              <strong>WhatsApp</strong> — messages you send us on WhatsApp are carried by WhatsApp
              under its own{" "}
              <LegalLink href="https://www.whatsapp.com/legal/privacy-policy" external>
                privacy policy
              </LegalLink>
              .
            </>,
            <>
              <strong>OpenStreetMap</strong> — only if you use "Use my current location": your
              position is sent to OpenStreetMap's address look-up service to turn it into a street
              address.
            </>,
            <>
              <strong>Your chosen payment provider</strong> — for example Mukuru, Western Union,
              WorldRemit, your bank, EcoCash or InnBucks, which process your payment under their
              own terms.
            </>,
            <>
              <strong>Authorities or other parties</strong> — where the law requires it, or where
              it's needed to deal with an accident, damage, traffic fine or toll involving a
              rented vehicle.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "whatsapp-communications",
    title: "WhatsApp & Communications",
    content: (
      <>
        <p>
          VenMax is WhatsApp-first: most bookings are discussed with our team on WhatsApp, and you
          can also reach us by email or phone.
        </p>
        <Bullets
          items={[
            "When you send the enquiry or quote form, your details are saved for the VenMax team and WhatsApp opens with your message ready. Nothing is sent on WhatsApp until you press send.",
            "We use your contact details to talk to you about your enquiry and booking.",
            "If you'd prefer to be contacted a different way, or want us to stop messaging you, just tell us.",
          ]}
        />
      </>
    ),
  },
  {
    id: "where-information-is-stored",
    title: "Where Information Is Stored",
    content: (
      <>
        <Bullets
          items={[
            <>
              <strong>Website forms</strong> — saved in the online database behind this website.
              Only signed-in VenMax staff accounts can view submitted forms; they are not
              publicly visible. The database is hosted by a cloud provider, so it may be stored
              on servers outside Zimbabwe.
            </>,
            <>
              <strong>WhatsApp, email and phone</strong> — conversations stay in VenMax's WhatsApp
              and email accounts.
            </>,
            <>
              <strong>Information shared when arranging a rental</strong> — kept by the VenMax
              team with your booking records.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention",
    content: (
      <>
        <p>
          We keep your information only for as long as it's needed to handle your enquiry or
          booking and any follow-up — such as deposit refunds, cancellations, excess mileage,
          traffic fines or damage — and for VenMax's business records.
        </p>
        <p>
          You can ask us to delete your information at any time (see{" "}
          <LegalLink href="#your-rights">Customer / Data Subject Rights</LegalLink>). We'll delete
          what we are not required to keep.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Customer / Data Subject Rights",
    content: (
      <>
        <p>
          Under Zimbabwe's Cyber and Data Protection Act [Chapter 12:07], you can ask VenMax to:
        </p>
        <Bullets
          items={[
            "Tell you whether we hold personal information about you, and give you a copy.",
            "Correct information that is wrong or incomplete.",
            "Delete your information, where we don't need to keep it.",
            "Stop using your information for a particular purpose, or withdraw a consent you've given.",
          ]}
        />
        <p>
          Send your request by WhatsApp or email using the details in{" "}
          <LegalLink href="#contact-us">Contact Us</LegalLink>. We may need to confirm who you are
          before acting on it.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>
          This website uses only the essential browser storage it needs to work — for example,
          remembering that you've closed the cookie notice. There are no advertising or tracking
          cookies.
        </p>
        <p>
          Read the full <LegalLink href="/cookie-policy">Cookie Policy</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "Contact Us",
    content: (
      <>
        <p>For any privacy question or request:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={whatsappLink("Hello VenMax, I have a question about my personal information.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-secondary"
          >
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold text-foreground">WhatsApp</span>
              {company.phones[0]}
            </span>
          </a>
          <a
            href={`mailto:${company.emails[0]}`}
            className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-secondary"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">Email</span>
              <span className="break-words">{company.emails[0]}</span>
            </span>
          </a>
          <div className="flex items-start gap-3 rounded-xl border border-border p-4">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold text-foreground">Phone</span>
              {company.phones.join(" · ")}
            </span>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border p-4">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold text-foreground">Office</span>
              {address}
            </span>
          </div>
        </div>
      </>
    ),
  },
];

function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="What personal information VenMax collects, why, and the choices you have — in plain language."
      updated="September 2026"
      currentHref="/privacy-policy"
      sections={sections}
      whatsappMessage="Hello VenMax, I have a question about your Privacy Policy."
    />
  );
}
