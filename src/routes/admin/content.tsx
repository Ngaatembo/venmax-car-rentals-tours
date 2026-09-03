import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { listSiteContent, setSiteContent, type DbSiteContent } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

const fieldLabels: Record<string, string> = {
  hero_tagline: "Hero tagline",
  hero_subtitle: "Hero subtitle",
  contact_address: "Contact address",
  contact_phone_primary: "Primary phone",
  contact_phone_secondary: "Secondary phone",
  contact_email_sales: "Sales email",
  contact_email_bookings: "Bookings email",
};

function AdminContent() {
  const [items, setItems] = useState<DbSiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listSiteContent());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function updateLocal(key: string, value: string) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, value } : i)));
  }

  async function handleSave(key: string, value: string) {
    setSavingKey(key);
    try {
      await setSiteContent(key, value);
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Site content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit the text shown on the public site's hero section and contact details.
      </p>

      <div className="mt-6 max-w-xl space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading &&
          items.map((item) => (
            <div key={item.key} className="rounded-lg border border-border bg-background p-4">
              <Label>{fieldLabels[item.key] ?? item.key}</Label>
              <div className="mt-2 flex gap-2">
                <Input value={item.value} onChange={(e) => updateLocal(item.key, e.target.value)} />
                <Button
                  variant="secondary"
                  onClick={() => handleSave(item.key, item.value)}
                  disabled={savingKey === item.key}
                >
                  {savingKey === item.key ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
