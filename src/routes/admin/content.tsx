import { createFileRoute } from "@tanstack/react-router";
import {
  SETTING_DEFAULTS,
  TEXT_TOKENS,
  policies,
  refreshSiteSettings,
  useSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Star, ExternalLink } from "lucide-react";
import { PAGE_DEFAULTS, legalKeys, type LegalSlug } from "@/lib/page-content";
import { sectionsToText } from "@/lib/legal-text";
import { useVehicles } from "@/lib/live-content";
import { buildSections as buildTermsSections } from "@/components/site/legal-sections/terms";
import { buildSections as buildPrivacySections } from "@/components/site/legal-sections/privacy";
import { buildSections as buildCookieSections } from "@/components/site/legal-sections/cookie";
import { can, useAdminRole } from "@/lib/admin-permissions";
import {
  listSiteContent,
  setSiteContent,
  listServices,
  upsertService,
  deleteService,
  listFaqs,
  upsertFaq,
  deleteFaq,
  listTestimonials,
  upsertTestimonial,
  deleteTestimonial,
  type DbSiteContent,
  type DbService,
  type DbFaq,
  type DbTestimonial,
  type ServiceIcon,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});


type Tab = "general" | "rates" | "pages" | "services" | "faq" | "testimonials";

function AdminContent() {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Website Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the public site's hero text, contact details, rates and policies, page text (About,
        Diaspora, Terms, Privacy, Cookies), services, FAQ and testimonials. Changes here update the live website.
      </p>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rates">Rates &amp; Policies</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {tab === "general" && <GeneralSection />}
        {tab === "rates" && <RatesSection />}
        {tab === "pages" && <PagesSection />}
        {tab === "services" && <ServicesSection />}
        {tab === "faq" && <FaqSection />}
        {tab === "testimonials" && <TestimonialsSection />}
      </div>
    </div>
  );
}

// ---------------- Settings forms (General, Rates & Policies) ----------------
type SettingField = {
  key: string;
  label: string;
  help?: string;
  kind?: "text" | "textarea" | "number";
  rows?: number;
  prefix?: string;
  suffix?: string;
};
type SettingGroup = { title: string; description?: string; fields: SettingField[] };

function defaultFor(key: string, extra?: Record<string, string>): string {
  return extra?.[key] ?? (SETTING_DEFAULTS as Record<string, string>)[key] ?? "";
}

function SettingsForm({
  groups,
  preview,
  defaults,
}: {
  groups: SettingGroup[];
  preview?: (values: Record<string, string>) => ReactNode;
  /** Extra built-in wording for keys that aren't in SETTING_DEFAULTS (page text). */
  defaults?: Record<string, string>;
}) {
  const keys = groups.flatMap((g) => g.fields.map((f) => f.key));
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const rows = await listSiteContent();
      const map: Record<string, string> = {};
      for (const k of keys) map[k] = rows.find((r) => r.key === k)?.value ?? "";
      setSaved(map);
      setValues(map);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = keys.filter((k) => (values[k] ?? "") !== (saved[k] ?? ""));

  async function handleSave() {
    setSaving(true);
    try {
      for (const k of dirty) await setSiteContent(k, (values[k] ?? "").trim());
      setSaved({ ...values });
      refreshSiteSettings();
      toast.success(`Saved ${dirty.length} change${dirty.length === 1 ? "" : "s"} — the website now uses them`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  // Blank fields fall back to the built-in default on the website.
  const effective: Record<string, string> = {};
  for (const k of keys) effective[k] = (values[k] ?? "").trim() || defaultFor(k, defaults);

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.title} className="rounded-lg border border-border bg-background p-5">
            <h2 className="text-base font-semibold text-foreground">{group.title}</h2>
            {group.description && (
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => {
                const def = defaultFor(field.key, defaults);
                const value = values[field.key] ?? "";
                const wide = field.kind === "textarea" || (!field.prefix && !field.suffix && field.kind !== "number");
                return (
                  <div key={field.key} className={wide ? "sm:col-span-2" : undefined}>
                    <Label htmlFor={`set-${field.key}`}>{field.label}</Label>
                    <div className="mt-1.5 flex items-center gap-2">
                      {field.prefix && <span className="text-sm text-muted-foreground">{field.prefix}</span>}
                      {field.kind === "textarea" ? (
                        <Textarea
                          id={`set-${field.key}`}
                          rows={field.rows ?? 6}
                          value={value}
                          placeholder={def}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        />
                      ) : (
                        <Input
                          id={`set-${field.key}`}
                          inputMode={field.kind === "number" ? "decimal" : undefined}
                          value={value}
                          placeholder={def}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              [field.key]:
                                field.kind === "number" ? e.target.value.replace(/[^0-9.]/g, "") : e.target.value,
                            }))
                          }
                        />
                      )}
                      {field.suffix && <span className="shrink-0 text-sm text-muted-foreground">{field.suffix}</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {field.help ? `${field.help} ` : ""}
                      {def ? (
                        value.trim() ? (
                          value.trim() !== def ? (
                            <button
                              type="button"
                              className="underline underline-offset-2 hover:text-foreground"
                              onClick={() => setValues((v) => ({ ...v, [field.key]: "" }))}
                            >
                              Reset to default
                            </button>
                          ) : null
                        ) : (
                          <>
                            Blank — the website uses the text shown.{" "}
                            <button
                              type="button"
                              className="underline underline-offset-2 hover:text-foreground"
                              onClick={() => setValues((v) => ({ ...v, [field.key]: def }))}
                            >
                              Edit this text
                            </button>
                          </>
                        )
                      ) : null}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-lg border border-border bg-background/95 p-4 backdrop-blur">
          <p className="text-sm text-muted-foreground">
            {dirty.length ? `${dirty.length} unsaved change${dirty.length === 1 ? "" : "s"}` : "All changes saved"}
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" disabled={!dirty.length || saving} onClick={() => setValues({ ...saved })}>
              Discard
            </Button>
            <Button disabled={!dirty.length || saving} onClick={handleSave}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
      {preview && (
        <aside className="h-fit rounded-lg border border-border bg-muted/40 p-5 lg:sticky lg:top-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            How the website will read
          </p>
          <div className="mt-3 space-y-3 text-sm text-foreground">{preview(effective)}</div>
        </aside>
      )}
    </div>
  );
}

const generalGroups: SettingGroup[] = [
  {
    title: "Homepage hero",
    description: "The first thing visitors see at the top of the homepage.",
    fields: [
      { key: "hero_tagline", label: "Small line above the heading" },
      { key: "hero_headline", label: "Main heading" },
      { key: "hero_subtitle", label: "Text under the heading", kind: "textarea" },
      {
        key: "hero_trust_rating",
        label: "Rating line (under the buttons)",
        help: "Also shown above the customer reviews. e.g. Rated 4.9 by 100+ Google reviewers",
      },
      { key: "hero_trust_delivery", label: "Delivery line (under the buttons)" },
    ],
  },
  {
    title: "Contact details",
    description: "Shown in the footer, Contact page, legal pages and call buttons.",
    fields: [
      { key: "contact_address", label: "Office address" },
      { key: "contact_phone_primary", label: "Primary phone" },
      { key: "contact_phone_secondary", label: "Secondary phone (optional)" },
      {
        key: "contact_whatsapp",
        label: "WhatsApp number",
        help: "Every “Book on WhatsApp” button uses this number. Include the country code.",
      },
      { key: "contact_email_sales", label: "Main email" },
      { key: "contact_email_bookings", label: "Second email (optional)" },
      { key: "contact_hours", label: "Opening hours" },
    ],
  },
  {
    title: "Homepage stats",
    fields: [
      { key: "stat_google_rating", label: "Google rating", kind: "number", suffix: "★" },
      { key: "stat_happy_clients", label: "Happy clients", help: "e.g. 1000+" },
      { key: "vehicle_models_display", label: "Vehicle models", help: "e.g. 40+. Also shown on the Fleet page." },
    ],
  },
  {
    title: "Social posts",
    description: "Instagram, TikTok or Facebook links shown in “See VenMax in action”.",
    fields: [
      { key: "social_showcase_1", label: "Featured post #1" },
      { key: "social_showcase_2", label: "Featured post #2" },
      { key: "social_showcase_3", label: "Featured post #3" },
      { key: "social_showcase_4", label: "Featured post #4" },
    ],
  },
];

function GeneralSection() {
  return <SettingsForm groups={generalGroups} />;
}

const ratesGroups: SettingGroup[] = [
  {
    title: "Chauffeur hire",
    fields: [
      { key: "chauffeur_fee_per_day", label: "Chauffeur fee", kind: "number", prefix: "US$", suffix: "per day" },
      { key: "chauffeur_client_covers", label: "Extra note", help: "Shown after the fee." },
    ],
  },
  {
    title: "Airport & delivery",
    fields: [
      { key: "airport_shuttle_fee", label: "Airport shuttle", kind: "number", prefix: "US$", suffix: "per trip" },
      { key: "delivery_note", label: "Delivery sentence" },
    ],
  },
  {
    title: "Mileage",
    fields: [
      { key: "mileage_free_km_per_day", label: "Free mileage", kind: "number", suffix: "km per day" },
      { key: "mileage_excess_per_km", label: "Excess mileage", kind: "number", prefix: "US$", suffix: "per km" },
      {
        key: "mileage_unlimited_from",
        label: "Unlimited mileage from",
        help: "Completes “For rentals of … or more, unlimited mileage is available.”",
      },
    ],
  },
  {
    title: "Cancellation, requirements & travel",
    fields: [
      { key: "cancellation_refund_days", label: "Refund time", kind: "number", suffix: "business working days" },
      { key: "min_driver_age", label: "Minimum self-drive age", kind: "number", suffix: "years" },
      { key: "licence_years", label: "Licence held for at least", kind: "number", suffix: "years" },
      { key: "cross_border", label: "Cross-border travel sentence" },
    ],
  },
  {
    title: "Payment methods",
    description: "One per line, in the order they should appear.",
    fields: [{ key: "payment_methods", label: "Accepted payment methods", kind: "textarea" }],
  },
];

function RatesSection() {
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-sm text-muted-foreground">
        These values feed the homepage, the chauffeur and self-drive pages, the rental requirements
        cards and the Rental Terms &amp; Conditions. FAQ answers are written text: use the
        placeholders listed in the FAQ tab (e.g. {"{chauffeur_fee}"}) so they update too.
      </p>
      <SettingsForm
        groups={ratesGroups}
        preview={(v) => {
          const p = policies(v as SiteSettings);
          return (
            <>
              <p>{p.chauffeurFeeNote}</p>
              <p>Harare airport shuttle: {p.shuttlePerTrip}.</p>
              <p>{p.deliveryNote}</p>
              <p>{p.standardMileage}</p>
              <p>{p.unlimitedSentence}</p>
              <p>No cancellation fee. {p.refundSentence}</p>
              <p>
                Self-drive: {p.minAge}+ years, licence held for at least {p.licenceYears} years.
              </p>
              <p>{p.crossBorder}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.paymentMethods.map((m) => (
                  <span key={m} className="rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                    {m}
                  </span>
                ))}
              </div>
            </>
          );
        }}
      />
    </div>
  );
}

// ---------------- Pages (About, Diaspora, legal pages) ----------------
type PageId = "about" | "diaspora" | "terms" | "privacy" | "cookie";

const pageOptions: { id: PageId; label: string; href: string }[] = [
  { id: "about", label: "About", href: "/about" },
  { id: "diaspora", label: "For Diaspora", href: "/diaspora" },
  { id: "terms", label: "Rental Terms & Conditions", href: "/terms-of-service" },
  { id: "privacy", label: "Privacy Policy", href: "/privacy-policy" },
  { id: "cookie", label: "Cookie Policy", href: "/cookie-policy" },
];

const aboutGroups: SettingGroup[] = [
  {
    title: "Page heading",
    fields: [
      { key: "about_hero_title", label: "Heading" },
      { key: "about_hero_description", label: "Text under the heading", kind: "textarea", rows: 3 },
    ],
  },
  {
    title: "About VenMax",
    description: "Also shown on the homepage.",
    fields: [
      {
        key: "about_story",
        label: "Our story",
        kind: "textarea",
        rows: 14,
        help: "Leave a blank line between paragraphs.",
      },
      { key: "about_target_market", label: "Target market" },
      { key: "about_brand_quote", label: "Brand quote", kind: "textarea", rows: 3 },
    ],
  },
  {
    title: "Mission & vision",
    fields: [
      { key: "about_vision", label: "Our vision", kind: "textarea", rows: 3 },
      { key: "about_mission", label: "Our mission", kind: "textarea", rows: 8 },
    ],
  },
  {
    title: "Core values",
    fields: [
      {
        key: "about_core_values",
        label: "Core values",
        kind: "textarea",
        rows: 10,
        help: "One per line, written as Title: description.",
      },
    ],
  },
  {
    title: "What we offer & leadership",
    fields: [
      {
        key: "about_offer",
        label: "What we offer",
        kind: "textarea",
        rows: 6,
        help: "One per line.",
      },
      { key: "about_leadership", label: "Our leadership", kind: "textarea", rows: 5 },
    ],
  },
];

const diasporaGroups: SettingGroup[] = [
  {
    title: "Page heading",
    fields: [
      { key: "diaspora_hero_title", label: "Heading" },
      { key: "diaspora_hero_description", label: "Text under the heading", kind: "textarea", rows: 4 },
    ],
  },
  {
    title: "Diaspora section",
    description: "Also shown on the homepage.",
    fields: [
      { key: "diaspora_heading", label: "Section heading" },
      { key: "diaspora_description", label: "Section text", kind: "textarea", rows: 4 },
    ],
  },
];

function PagesSection() {
  const [page, setPage] = useState<PageId>("about");
  const current = pageOptions.find((p) => p.id === page)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 sm:max-w-sm">
          <Label>Page to edit</Label>
          <Select value={page} onValueChange={(v) => setPage(v as PageId)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageOptions.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild variant="outline">
          <a href={current.href} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            View page
          </a>
        </Button>
      </div>

      {page === "about" && (
        <SettingsForm key="about" groups={aboutGroups} defaults={PAGE_DEFAULTS as Record<string, string>} />
      )}
      {page === "diaspora" && (
        <SettingsForm key="diaspora" groups={diasporaGroups} defaults={PAGE_DEFAULTS as Record<string, string>} />
      )}
      {page === "terms" && <LegalEditor key="terms" slug="terms" label="Rental Terms & Conditions" />}
      {page === "privacy" && <LegalEditor key="privacy" slug="privacy" label="Privacy Policy" />}
      {page === "cookie" && <LegalEditor key="cookie" slug="cookie" label="Cookie Policy" />}
    </div>
  );
}

function LegalEditor({ slug, label }: { slug: LegalSlug; label: string }) {
  const keys = legalKeys(slug);
  const settings = useSiteSettings();
  const vehicles = useVehicles();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedText, setSavedText] = useState("");
  const [savedUpdated, setSavedUpdated] = useState("");
  const [text, setText] = useState("");
  const [updated, setUpdated] = useState("");
  const [touched, setTouched] = useState(false);

  // The wording the website shows when no custom text has been saved.
  const builtIn = useMemo(() => {
    const p = policies(settings);
    const sections =
      slug === "terms"
        ? buildTermsSections(vehicles, p)
        : slug === "privacy"
          ? buildPrivacySections(settings)
          : buildCookieSections(settings);
    return sectionsToText(sections);
  }, [slug, settings, vehicles]);

  async function refresh() {
    setLoading(true);
    try {
      const rows = await listSiteContent();
      const t = rows.find((r) => r.key === keys.text)?.value ?? "";
      const u = rows.find((r) => r.key === keys.updated)?.value ?? "";
      setSavedText(t);
      setSavedUpdated(u);
      setText(t);
      setUpdated(u);
      setTouched(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load page text");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usingCustom = savedText.trim().length > 0;
  const shown = touched || usingCustom ? text : builtIn;
  const dirty = touched
    ? text.trim() !== (usingCustom ? savedText.trim() : builtIn.trim()) || updated.trim() !== savedUpdated.trim()
    : false;

  async function handleSave() {
    if (!/^##\s+\S/m.test(text)) {
      toast.error("Start each section with a heading line, like: ## Section title");
      return;
    }
    setSaving(true);
    try {
      await setSiteContent(keys.text, text.trim());
      await setSiteContent(keys.updated, updated.trim());
      refreshSiteSettings();
      toast.success(`${label} saved — the website now shows your text`);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleRevert() {
    setSaving(true);
    try {
      await setSiteContent(keys.text, "");
      await setSiteContent(keys.updated, "");
      refreshSiteSettings();
      toast.success(`${label} is back to the original text`);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-background p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">{label}</h2>
          <Badge variant={usingCustom ? "default" : "outline"}>
            {usingCustom ? "Using your text" : "Using the original text"}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          This is the text on the page. Edit it and save to update the website. The “at a glance”
          box, the intro and the closing note stay automatic.
        </p>
        <details className="mt-3 text-xs text-muted-foreground">
          <summary className="cursor-pointer">How to format the text</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Start each section with a heading line: <code className="rounded bg-muted px-1">## Section title</code>.
              Leave the <code className="rounded bg-muted px-1">{"{#…}"}</code> at the end of existing headings as it is — it keeps links to that section working.
            </li>
            <li>Leave a blank line between paragraphs.</li>
            <li>
              Start a bullet point with <code className="rounded bg-muted px-1">- </code>
            </li>
            <li>
              Links: <code className="rounded bg-muted px-1">[text](https://…)</code> · Bold:{" "}
              <code className="rounded bg-muted px-1">**text**</code>
            </li>
            <li>
              Placeholders such as <code className="rounded bg-muted px-1">{"{chauffeur_fee}"}</code> follow Rates
              &amp; Policies (see the FAQ tab for the full list).
            </li>
          </ul>
        </details>

        <div className="mt-4">
          <Label htmlFor={`legal-${slug}-updated`}>Last updated (shown on the page)</Label>
          <Input
            id={`legal-${slug}-updated`}
            className="mt-1.5 sm:max-w-xs"
            value={updated}
            placeholder="September 2026"
            onChange={(e) => {
              if (!touched) {
                setTouched(true);
                if (!usingCustom) setText(builtIn);
              }
              setUpdated(e.target.value);
            }}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor={`legal-${slug}-text`}>Page text</Label>
          <Textarea
            id={`legal-${slug}-text`}
            className="mt-1.5 min-h-[28rem] font-mono text-xs leading-relaxed"
            value={shown}
            onChange={(e) => {
              setTouched(true);
              setText(e.target.value);
            }}
          />
        </div>
      </section>

      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background/95 p-4 backdrop-blur">
        <p className="text-sm text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</p>
        <div className="flex flex-wrap gap-2">
          {usingCustom && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={saving}>
                  Back to original text
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Go back to the original text?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your edited version of the {label} is removed and the website shows the original wording again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRevert}>Go back</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant="ghost" disabled={!dirty || saving} onClick={refresh}>
            Discard
          </Button>
          <Button disabled={!dirty || saving} onClick={handleSave}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Services ----------------
const iconOptions: ServiceIcon[] = ["key", "user", "plane", "users"];

function ServicesSection() {
  // Deleting is Owner-only in the database; Manager/Developer can add, edit and hide.
  const canDelete = can.deleteSiteItems(useAdminRole());
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbService>>({
    slug: "",
    name: "",
    description: "",
    icon: "key",
    whatsapp_message: "",
    sort_order: 0,
    is_active: true,
  });

  async function refresh() {
    setLoading(true);
    try {
      setServices(await listServices());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ slug: "", name: "", description: "", icon: "key", whatsapp_message: "", sort_order: services.length, is_active: true });
    setFormOpen(true);
  }
  function openEdit(s: DbService) {
    setEditingId(s.id);
    setForm(s);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.name?.trim() || !form.slug?.trim() || !form.description?.trim()) {
      toast.error("Name, slug, and description are required");
      return;
    }
    setSaving(true);
    try {
      await upsertService({
        ...(editingId ? { id: editingId } : {}),
        slug: form.slug.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        icon: (form.icon as ServiceIcon) || "key",
        whatsapp_message: form.whatsapp_message?.trim() || null,
        sort_order: form.sort_order ?? 0,
        is_active: form.is_active ?? true,
      });
      toast.success(editingId ? "Service updated" : "Service added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(s: DbService, active: boolean) {
    try {
      await upsertService({ id: s.id, slug: s.slug, name: s.name, description: s.description, is_active: active });
      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: active } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function handleDelete(s: DbService) {
    try {
      await deleteService(s.id);
      toast.success("Service deleted");
      setServices((prev) => prev.filter((x) => x.id !== s.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit service" : "Add service"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <Label>Slug (unique)</Label>
                <Input value={form.slug ?? ""} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="e.g. self-drive" />
              </div>
              <div>
                <Label>Icon</Label>
                <Select value={form.icon ?? "key"} onValueChange={(v) => setForm((f) => ({ ...f, icon: v as ServiceIcon }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Name</Label>
                <Input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label>WhatsApp enquiry message</Label>
                <Input value={form.whatsapp_message ?? ""} onChange={(e) => setForm((f) => ({ ...f, whatsapp_message: e.target.value }))} />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save service"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && services.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{s.name}</p>
                <Badge variant="outline">{s.icon}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={s.is_active} onCheckedChange={(v) => handleToggle(s, v)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{s.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This removes it from the public site.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(s)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- FAQ ----------------
function FaqSection() {
  // Deleting is Owner-only in the database; Manager/Developer can add, edit and hide.
  const canDelete = can.deleteSiteItems(useAdminRole());
  const [faqs, setFaqs] = useState<DbFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbFaq>>({ question: "", answer: "", sort_order: 0, is_active: true });

  async function refresh() {
    setLoading(true);
    try {
      setFaqs(await listFaqs());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load FAQ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ question: "", answer: "", sort_order: faqs.length, is_active: true });
    setFormOpen(true);
  }
  function openEdit(f: DbFaq) {
    setEditingId(f.id);
    setForm(f);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.question?.trim() || !form.answer?.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    setSaving(true);
    try {
      await upsertFaq({
        ...(editingId ? { id: editingId } : {}),
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: form.sort_order ?? 0,
        is_active: form.is_active ?? true,
      });
      toast.success(editingId ? "FAQ updated" : "FAQ added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(f: DbFaq, active: boolean) {
    try {
      await upsertFaq({ id: f.id, question: f.question, answer: f.answer, is_active: active });
      setFaqs((prev) => prev.map((x) => (x.id === f.id ? { ...x, is_active: active } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function handleDelete(f: DbFaq) {
    try {
      await deleteFaq(f.id);
      toast.success("FAQ deleted");
      setFaqs((prev) => prev.filter((x) => x.id !== f.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Question</Label>
                <Input value={form.question ?? ""} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea value={form.answer ?? ""} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
                <details className="mt-2 text-xs text-muted-foreground">
                  <summary className="cursor-pointer">Placeholders that follow Rates &amp; Policies</summary>
                  <ul className="mt-2 space-y-1">
                    {TEXT_TOKENS.map((t) => (
                      <li key={t.token}>
                        <code className="rounded bg-muted px-1">{t.token}</code> — {t.describe}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Label>Order</Label>
                  <Input type="number" className="w-24" value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && faqs.length === 0 && <p className="text-sm text-muted-foreground">No FAQs yet.</p>}
        {faqs.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-4">
            <div>
              <p className="font-medium text-foreground">{f.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Switch checked={f.is_active} onCheckedChange={(v) => handleToggle(f, v)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this question?</AlertDialogTitle>
                      <AlertDialogDescription>This removes it from the public FAQ section.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(f)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Testimonials ----------------
function TestimonialsSection() {
  // Deleting is Owner-only in the database; Manager/Developer can add, edit and hide.
  const canDelete = can.deleteSiteItems(useAdminRole());
  const [items, setItems] = useState<DbTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbTestimonial>>({ customer_name: "", rating: 5, quote: "", sort_order: 0, is_active: true });

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listTestimonials());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ customer_name: "", rating: 5, quote: "", sort_order: items.length, is_active: true });
    setFormOpen(true);
  }
  function openEdit(t: DbTestimonial) {
    setEditingId(t.id);
    setForm(t);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.customer_name?.trim() || !form.quote?.trim()) {
      toast.error("Name and quote are required");
      return;
    }
    setSaving(true);
    try {
      await upsertTestimonial({
        ...(editingId ? { id: editingId } : {}),
        customer_name: form.customer_name.trim(),
        rating: form.rating ?? 5,
        quote: form.quote.trim(),
        sort_order: form.sort_order ?? 0,
        is_active: form.is_active ?? true,
      });
      toast.success(editingId ? "Testimonial updated" : "Testimonial added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(t: DbTestimonial, active: boolean) {
    try {
      await upsertTestimonial({ id: t.id, customer_name: t.customer_name, rating: t.rating, quote: t.quote, is_active: active });
      setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, is_active: active } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function handleDelete(t: DbTestimonial) {
    try {
      await deleteTestimonial(t.id);
      toast.success("Testimonial deleted");
      setItems((prev) => prev.filter((x) => x.id !== t.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Customer name</Label>
                <Input value={form.customer_name ?? ""} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} />
              </div>
              <div>
                <Label>Rating (1–5)</Label>
                <Select value={String(form.rating ?? 5)} onValueChange={(v) => setForm((f) => ({ ...f, rating: parseInt(v) }))}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((r) => <SelectItem key={r} value={String(r)}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quote</Label>
                <Textarea value={form.quote ?? ""} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-sm text-muted-foreground">No testimonials yet.</p>}
        {items.map((t) => (
          <div key={t.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{t.customer_name}</p>
                <span className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.quote}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Switch checked={t.is_active} onCheckedChange={(v) => handleToggle(t, v)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
                      <AlertDialogDescription>This removes it from the public site.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(t)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
