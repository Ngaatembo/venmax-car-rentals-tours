import { createFileRoute } from "@tanstack/react-router";
import { Bullets, LegalLink, LegalPage, type LegalSection } from "@/components/site/LegalPage";
import { company } from "@/data/venmax";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
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

const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies?",
    content: (
      <p>
        Cookies, and similar browser storage, are small pieces of data saved in your browser when
        you visit a website. They help the site remember information about your visit.
      </p>
    ),
  },
  {
    id: "what-we-use",
    title: "What This Website Uses",
    content: (
      <>
        <p>Only essential storage that the website needs to work:</p>
        <Bullets
          items={[
            <>
              <strong>Cookie notice choice</strong> — once you close the cookie notice, your
              browser remembers it so the notice doesn't appear on every page.
            </>,
            <>
              <strong>Staff sign-in</strong> — used only in the VenMax admin area to keep staff
              signed in between pages. It is not set for visitors browsing the public site.
            </>,
          ]}
        />
        <p>
          <strong>Google Maps, only if you choose:</strong> the map on the Contact page loads only
          when you tap "Show map". Google may then set its own cookies, under Google's{" "}
          <LegalLink href="https://policies.google.com/privacy" external>
            privacy policy
          </LegalLink>
          .
        </p>
      </>
    ),
  },
  {
    id: "what-we-dont-use",
    title: "What We Don't Use",
    content: (
      <p>
        This website does not use Google Analytics, advertising pixels, or any other third-party
        tracking or marketing cookies. If that changes, this policy will be updated and, where
        required, we will ask for your consent first.
      </p>
    ),
  },
  {
    id: "managing-cookies",
    title: "Managing Cookies",
    content: (
      <p>
        As there are no tracking or advertising cookies, there's nothing to opt out of. You can
        clear this site's data in your browser settings at any time, or use a private/incognito
        window.
      </p>
    ),
  },
  {
    id: "questions",
    title: "Questions",
    content: (
      <p>
        Contact us at{" "}
        <LegalLink href={`mailto:${company.emails[0]}`}>{company.emails[0]}</LegalLink> or on
        WhatsApp. How we handle personal information is explained in our{" "}
        <LegalLink href="/privacy-policy">Privacy Policy</LegalLink>.
      </p>
    ),
  },
];

function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="How this website uses cookies and similar browser storage."
      updated="September 2026"
      currentHref="/cookie-policy"
      sections={sections}
      whatsappMessage="Hello VenMax, I have a question about your Cookie Policy."
    />
  );
}
