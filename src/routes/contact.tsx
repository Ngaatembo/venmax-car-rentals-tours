import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { company, whatsappLink } from "@/data/venmax";
import { submitInquiry } from "@/lib/bookings";
import receptionImage from "@/assets/venmax-reception.jpg";
import { FormPrivacyNotice } from "@/components/site/LegalPage";
import { OfficeMap } from "@/components/site/OfficeMap";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact VenMax | Car Rental Harare Airport & City" },
      {
        name: "description",
        content:
          "Message VenMax on WhatsApp, call or email us. 27 Lawson Avenue, Milton Park, Harare — free airport vehicle pickup with a hired vehicle.",
      },
      { property: "og:title", content: "Contact VenMax | Car Rental Harare Airport & City" },
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
  const [confirmLink, setConfirmLink] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const message = String(form.get("message") ?? "");
    setPending(true);
    try {
      await submitInquiry({ name, email, phone, message });
      const link = whatsappLink(
        `Hi VenMax, I just sent an inquiry via the website.\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`,
      );
      setConfirmLink(link);
      setSent(true);
      toast.success("Inquiry sent — VenMax will get back to you shortly.");
      // Same reasoning as the booking form: WhatsApp is the channel VenMax
      // actually watches, so open it with the inquiry pre-filled rather than
      // relying solely on someone checking the admin panel.
      window.open(link, "_blank", "noreferrer");
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
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    company.addressLines.join(", ")
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  {company.addressLines.join(", ")}
                </a>
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
                <p className="mt-1 text-sm text-muted-foreground">{company.hours}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Facebook className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base">Follow VenMax</h3>
                <p className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  {company.social.instagram && (
                    <>
                      <a
                        href={company.social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground"
                      >
                        Instagram
                      </a>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <a
                    href={company.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    Facebook
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={company.social.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    TikTok
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={company.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    LinkedIn
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
                ? "Thanks — we've opened WhatsApp with your message pre-filled. Send it so VenMax sees it right away."
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
            {confirmLink && (
              <a
                href={confirmLink}
                target="_blank"
                rel="noreferrer"
                className="ml-3 mt-6 inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary"
              >
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp again
              </a>
            )}
            <FormPrivacyNotice opensWhatsApp className="mt-4" />
          </form>
        </div>

        <div id="find-us" className="mt-14 scroll-mt-28">
          <h2 className="text-xl sm:text-2xl">Find our office</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {company.addressLines.join(", ")} · {company.hours}
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <OfficeMap />
            <figure className="overflow-hidden rounded-2xl border border-border">
              <img
                src={receptionImage}
                alt="The VenMax Car Rental reception, with the company sign and a desk banner showing fleet vehicles"
                loading="lazy"
                width={800}
                height={1000}
                className="aspect-[4/5] w-full object-cover lg:aspect-[5/4]"
              />
              <figcaption className="bg-card px-4 py-3 text-xs text-muted-foreground">
                VenMax Car Rental reception
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>
    </>
  );
}
