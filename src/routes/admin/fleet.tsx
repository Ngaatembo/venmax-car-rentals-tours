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
import {
  listVehicles,
  upsertVehicle,
  deleteVehicle,
  uploadMedia,
  type DbVehicle,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/fleet")({
  component: AdminFleet,
});

type FormState = Partial<DbVehicle>;

const emptyForm: FormState = {
  slug: "",
  name: "",
  category: "",
  price_label: "",
  deposit: "",
  description: "",
  image_url: null,
  sort_order: 0,
  is_active: true,
};

function AdminFleet() {
  const [vehicles, setVehicles] = useState<DbVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setVehicles(await listVehicles());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load fleet");
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

  function openEdit(vehicle: DbVehicle) {
    setForm(vehicle);
    setOpen(true);
  }

  async function handleSave() {
    if (!form.slug || !form.name || !form.category || !form.price_label || !form.deposit || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      await upsertVehicle(form as Partial<DbVehicle> & { slug: string });
      toast.success("Vehicle saved");
      setOpen(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save vehicle");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(vehicle: DbVehicle) {
    if (!confirm(`Delete ${vehicle.name}? This can't be undone.`)) return;
    try {
      await deleteVehicle(vehicle.id);
      toast.success("Vehicle deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete vehicle");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadMedia(file, "vehicles");
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
          <h1 className="text-2xl font-semibold text-foreground">Fleet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage vehicles shown on the public site.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="mr-1 h-4 w-4" /> Add vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit vehicle" : "Add vehicle"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Slug (unique, e.g. toyota-fortuner)</Label>
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input
                    value={form.category ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
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
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Price label</Label>
                  <Input
                    value={form.price_label ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, price_label: e.target.value }))}
                    placeholder="From $150/day"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Deposit</Label>
                  <Input
                    value={form.deposit ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, deposit: e.target.value }))}
                    placeholder="$300 deposit"
                  />
                </div>
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
                <Label>Photo</Label>
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
                {saving ? "Saving…" : "Save vehicle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!loading && vehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No vehicles yet.
                </TableCell>
              </TableRow>
            )}
            {vehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell>{v.category}</TableCell>
                <TableCell>{v.price_label}</TableCell>
                <TableCell>{v.is_active ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(v)}>
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
