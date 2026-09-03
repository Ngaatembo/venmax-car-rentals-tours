import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { company, whatsappLink } from "@/data/venmax";
import { submitInquiry } from "@/lib/bookings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact VenMax | Harare, Zimbabwe" },
      {
        name: "description",
        content:
          "Message VenMax on WhatsApp, call or email us. B2, 20 Bradford Drive, Milton Park, Harare — free airport pickup available.",
      },
      { property: "og:title", content: "Contact VenMax | Harare, Zimbabwe" },
      {
        property: "og:description",
        content: "Message VenMax on WhatsApp, call or email us in Harare.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      await submitInquiry({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setSent(true);
      toast.success("Inquiry sent — VenMax will get back to you shortly.");
    } catch {
      toast.error("Please check the form and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Message us anytime"
        description="WhatsApp, call, email or visit us in Milton Park, Harare."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base">Visit us</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {company.addressLines.join(", ")}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base">Call or WhatsApp</h3>
                {company.phones.map((phone) => (
                  <p key={phone} className="mt-1 text-sm text-muted-foreground">
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                      {phone}
                    </a>
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base">Email</h3>
                {company.emails.map((email) => (
                  <p key={email} className="mt-1 text-sm text-muted-foreground">
                    <a href={`mailto:${email}`} className="hover:text-foreground">
                      {email}
                    </a>
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base">Opening hours</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {company.hours} — full hours to be confirmed by VenMax.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Instagram className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base">Follow us</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  <a href={company.social.instagram} target="_blank" rel="noreferrer" className="hover:text-foreground">
                    Instagram
                  </a>{" "}
                  ·{" "}
                  <a href={company.social.facebook} target="_blank" rel="noreferrer" className="hover:text-foreground">
                    Facebook
                  </a>{" "}
                  ·{" "}
                  <a href={company.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-foreground">
                    TikTok
                  </a>
                </p>
              </div>
            </div>

            <a
              href={whatsappLink("Hello VenMax, I'd like to get in touch.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              Message us on WhatsApp
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <h2 className="text-xl">Send an inquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {sent
                ? "Thanks — your inquiry has been noted and VenMax will respond shortly."
                : "Fill in the form and the VenMax team will get back to you."}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                Name
                <input
                  name="name"
                  required
                  className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="grid gap-1.5 text-sm sm:col-span-2">
                Phone / WhatsApp
                <input
                  name="phone"
                  required
                  className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="grid gap-1.5 text-sm sm:col-span-2">
                Message
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={pending || sent}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Sending…" : sent ? "Inquiry sent" : "Send inquiry"}
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}
