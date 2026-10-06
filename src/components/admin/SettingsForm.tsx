import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SETTING_DEFAULTS, refreshSiteSettings } from "@/lib/site-settings";
import { listSiteContent, setSiteContent } from "@/lib/admin-data";

// ---------------- Settings forms (General, Rates & Policies) ----------------
export type SettingField = {
  key: string;
  label: string;
  help?: string;
  kind?: "text" | "textarea" | "number";
  rows?: number;
  prefix?: string;
  suffix?: string;
};
export type SettingGroup = { title: string; description?: string; fields: SettingField[] };

function defaultFor(key: string, extra?: Record<string, string>): string {
  return extra?.[key] ?? (SETTING_DEFAULTS as Record<string, string>)[key] ?? "";
}

export function SettingsForm({
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

