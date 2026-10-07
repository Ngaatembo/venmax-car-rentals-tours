import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Bullets, LegalLink, type LegalSection } from "@/components/site/LegalPage";
import { company, whatsappLink } from "@/data/venmax";
import { contactInfo, type SiteSettings } from "@/lib/site-settings";

// Reflects data practices and retention information confirmed by VenMax.

export function buildSections(settings: SiteSettings): LegalSection[] {
  const address = settings.contact_address;
  const contact = contactInfo(settings);
  return [
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
        <p>
          This policy is intended to align with Zimbabwe's Cyber and Data Protection Act
          [Chapter 12:07] and applicable data protection requirements.
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
              <strong>Rental verification information</strong> — for rental verification, VenMax
              may collect the information and documents listed above, including your ID or passport,
              driver's licence, proof of residence or employment, and next-of-kin details.
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
            "To verify your identity and eligibility for self-drive hire, prevent fraud or vehicle theft, and fulfil the rental agreement.",
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
              <strong>Google Maps</strong> — only if you tap "Show map" on the Contact page, the
              map is loaded from Google under its own{" "}
              <LegalLink href="https://policies.google.com/privacy" external>
                privacy policy
              </LegalLink>
              .
            </>,
            <>
              <strong>Payment providers</strong> — where you choose a payment method such as
              Mukuru, Western Union, WorldRemit, a bank, EcoCash or InnBucks, the relevant provider
              processes your payment under its own terms. The website itself does not process online
              payments.
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
          For an active rental, VenMax may keep relevant information for the duration of the rental
          and for up to 30 days afterwards for traffic fines, tolls or damage matters.
        </p>
        <p>
          After the rental, VenMax intends to securely delete the information within 90 days,
          unless a longer period is required for an accident, insurance claim, dispute, legal
          obligation or another applicable requirement.
        </p>
        <p>
          If an application is cancelled or withdrawn, you may request deletion of information
          that VenMax is not required to retain. Deletion requests are subject to applicable legal,
          contractual, insurance, dispute or security requirements.
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
        <p>
          If you believe your data-protection rights have been violated, you may also lodge a
          complaint with the Zimbabwe Data Protection Authority (POTRAZ).
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
          cookies. The optional Google map on the Contact page only loads if you tap "Show map".
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
              {settings.contact_whatsapp}
            </span>
          </a>
          <a
            href={`mailto:${settings.contact_email_sales}`}
            className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-secondary"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">Email</span>
              <span className="break-words">{settings.contact_email_sales}</span>
            </span>
          </a>
          <div className="flex items-start gap-3 rounded-xl border border-border p-4">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block font-semibold text-foreground">Phone</span>
              {contact.phones.join(" · ")}
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
}
