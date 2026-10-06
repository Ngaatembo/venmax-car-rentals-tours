import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { SettingsForm, type SettingGroup } from "@/components/admin/SettingsForm";
import { PAGE_DEFAULTS, legalKeys, type LegalSlug } from "@/lib/page-content";
import { sectionsToText } from "@/lib/legal-text";
import { useVehicles } from "@/lib/live-content";
import { policies, refreshSiteSettings, useSiteSettings } from "@/lib/site-settings";
import { listSiteContent, setSiteContent } from "@/lib/admin-data";
import { buildSections as buildTermsSections } from "@/components/site/legal-sections/terms";
import { buildSections as buildPrivacySections } from "@/components/site/legal-sections/privacy";
import { buildSections as buildCookieSections } from "@/components/site/legal-sections/cookie";

// ---------------- Pages (About, Diaspora, legal pages) ----------------
type PageId = "home" | "how" | "requirements" | "about" | "diaspora" | "terms" | "privacy" | "cookie";

const homeGroups: SettingGroup[] = [
  {
    title: "Welcome block",
    description: "The “It's Your Journey” block on the homepage.",
    fields: [
      { key: "home_welcome_title", label: "Heading" },
      { key: "home_welcome_text", label: "Text", kind: "textarea", rows: 5 },
      { key: "home_welcome_places", label: "Places line" },
    ],
  },
  {
    title: "Price highlights",
    description: "The two big cards about deposits and rates. Update these if your prices change.",
    fields: [
      { key: "home_price_title", label: "Section heading" },
      { key: "home_price_description", label: "Section text", kind: "textarea", rows: 3 },
      { key: "home_price1_heading", label: "Card 1 — title" },
      { key: "home_price1_value", label: "Card 1 — big text", help: "e.g. From $100" },
      { key: "home_price1_label", label: "Card 1 — small line" },
      { key: "home_price1_text", label: "Card 1 — sentence", kind: "textarea", rows: 2 },
      { key: "home_price2_heading", label: "Card 2 — title" },
      { key: "home_price2_value", label: "Card 2 — big text", help: "e.g. From $40/day" },
      { key: "home_price2_label", label: "Card 2 — small line" },
      { key: "home_price2_text", label: "Card 2 — sentence", kind: "textarea", rows: 2 },
    ],
  },
  {
    title: "Highlights under the hero",
    fields: [
      {
        key: "home_trust_points",
        label: "Four highlights",
        kind: "textarea",
        rows: 6,
        help: "One per line, written as Title: description.",
      },
      {
        key: "home_value_cards",
        label: "Four value cards",
        kind: "textarea",
        rows: 6,
        help: "One per line, written as Title: description.",
      },
    ],
  },
  {
    title: "Harare's most trusted car rental",
    fields: [
      { key: "home_why_title", label: "Heading" },
      { key: "home_why_description", label: "Text", kind: "textarea", rows: 4 },
      {
        key: "home_why_list",
        label: "Reasons",
        kind: "textarea",
        rows: 6,
        help: "One per line. The stats above them (rating, price, clients, models) come from the General tab in Site Content.",
      },
      { key: "home_promise_title", label: "Promise banner heading" },
    ],
  },
];

const howGroups: SettingGroup[] = [
  {
    title: "How It Works",
    fields: [
      { key: "how_title", label: "Heading" },
      { key: "how_description", label: "Text under the heading", kind: "textarea", rows: 3 },
      {
        key: "how_steps",
        label: "Steps",
        kind: "textarea",
        rows: 8,
        help: "One per line, written as Title: description. Steps are numbered automatically.",
      },
    ],
  },
];

const requirementsGroups: SettingGroup[] = [
  {
    title: "Rental Requirements",
    description: "Shown on the homepage and the self-drive page.",
    fields: [
      { key: "req_title", label: "Heading" },
      { key: "req_description", label: "Text under the heading", kind: "textarea", rows: 3 },
      {
        key: "req_cards",
        label: "Requirement cards",
        kind: "textarea",
        rows: 14,
        help: "One per line, written as Title: description. Cards are numbered automatically. Placeholders like {min_age}, {licence_years} and {cross_border} follow Rates & Policies in Site Content. The FAQ below the cards is edited in Site Content → FAQ.",
      },
    ],
  },
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

const pageOptions: { id: PageId; label: string; description: string; href: string }[] = [
  { id: "home", label: "Homepage blocks", description: "Welcome, price highlights, value cards, Why VenMax", href: "/" },
  { id: "how", label: "How It Works", description: "The four booking steps", href: "/#how-it-works" },
  { id: "requirements", label: "Rental Requirements", description: "Requirement cards and heading", href: "/#requirements" },
  { id: "about", label: "About", description: "Story, mission, vision, values", href: "/about" },
  { id: "diaspora", label: "For Diaspora", description: "Heading and intro for visitors from abroad", href: "/diaspora" },
  { id: "terms", label: "Rental Terms & Conditions", description: "Eligibility, deposits, mileage, payments", href: "/terms-of-service" },
  { id: "privacy", label: "Privacy Policy", description: "How customer information is handled", href: "/privacy-policy" },
  { id: "cookie", label: "Cookie Policy", description: "How the website uses browser storage", href: "/cookie-policy" },
];

export function PagesSection() {
  const [page, setPage] = useState<PageId>("home");
  const current = pageOptions.find((p) => p.id === page)!;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pageOptions.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPage(p.id)}
            aria-pressed={page === p.id}
            className={
              "rounded-lg border p-4 text-left transition-colors " +
              (page === p.id
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:bg-muted")
            }
          >
            <p className="font-medium text-foreground">{p.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{current.label}</h2>
        <Button asChild variant="outline">
          <a href={current.href} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            View live page
          </a>
        </Button>
      </div>

      {page === "home" && (
        <SettingsForm key="home" groups={homeGroups} defaults={PAGE_DEFAULTS as Record<string, string>} />
      )}
      {page === "how" && (
        <SettingsForm key="how" groups={howGroups} defaults={PAGE_DEFAULTS as Record<string, string>} />
      )}
      {page === "requirements" && (
        <SettingsForm key="requirements" groups={requirementsGroups} defaults={PAGE_DEFAULTS as Record<string, string>} />
      )}
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

