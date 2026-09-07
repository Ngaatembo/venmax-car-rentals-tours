import { createFileRoute } from "@tanstack/react-router";
import { company } from "@/data/venmax";

export const Route = createFileRoute("/cookie-policy")({
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Cookie Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <div className="prose prose-sm mt-8 max-w-none text-foreground/90 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mt-3 [&_p]:leading-relaxed [&_li]:mt-1">
        <p>
          This policy explains how {company.name} uses cookies and similar storage technology on
          this website.
        </p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small pieces of data stored in your browser when you visit a website. They
          help the site remember information about your visit.
        </p>

        <h2>What we use cookies for</h2>
        <p>
          Our public website does not use advertising or third-party tracking cookies. We use:
        </p>
        <ul>
          <li>
            <strong>Essential/functional storage</strong> — used only within the VenMax admin
            panel to keep staff securely signed in between page visits. This is not set for
            regular visitors browsing the public site.
          </li>
        </ul>
        <p>
          We do not currently use Google Analytics, advertising pixels, or any other third-party
          tracking or marketing cookies on this website. If that changes in the future, this
          policy will be updated and, where required, we will ask for your consent first.
        </p>

        <h2>Managing cookies</h2>
        <p>
          Since we don't use tracking or advertising cookies, there's nothing to opt out of on
          the public site. If you'd prefer not to have the admin panel keep you signed in, you
          can clear your browser's site data or use a private/incognito window.
        </p>

        <h2>Questions</h2>
        <p>
          Contact us at{" "}
          <a href={`mailto:${company.emails[0]}`} className="text-primary underline underline-offset-2">
            {company.emails[0]}
          </a>{" "}
          if you have any questions about this policy.
        </p>
      </div>
    </div>
  );
}
