import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { listTours, upsertTour, deleteTour, uploadMedia, type DbTour } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/tours")({
  component: AdminTours,
});

type FormState = Partial<DbTour>;

const emptyForm: FormState = {
  slug: "",
  name: "",
  description: "",
  image_url: null,
  sort_order: 0,
  is_active: true,
};

function AdminTours() {
  const [tours, setTours] = useState<DbTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setTours(await listTours());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load tours");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openNew() {
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(tour: DbTour) {
    setForm(tour);
    setOpen(true);
  }

  async function handleSave() {
    if (!form.slug || !form.name || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      await upsertTour(form as Partial<DbTour> & { slug: string });
      toast.success("Destination saved");
      setOpen(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save destination");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(tour: DbTour) {
    if (!confirm(`Delete ${tour.name}? This can't be undone.`)) return;
    try {
      await deleteTour(tour.id);
      toast.success("Destination deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete destination");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file, "tours");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tour destinations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the destination cards shown on the public site.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="mr-1 h-4 w-4" /> Add destination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit destination" : "Add destination"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Slug (unique, e.g. victoria-falls)</Label>
                <Input
                  value={form.slug ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  disabled={!!form.id}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={form.name ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Photo (should show the actual destination, not a vehicle)</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="mt-2 h-32 w-full rounded-md object-cover"
                  />
                )}
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="active">Active (visible on site)</Label>
                <Switch
                  id="active"
                  checked={form.is_active ?? true}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={saving || uploading}>
                {saving ? "Saving…" : "Save destination"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destination</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!loading && tours.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No destinations yet.
                </TableCell>
              </TableRow>
            )}
            {tours.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>{t.is_active ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(t)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
