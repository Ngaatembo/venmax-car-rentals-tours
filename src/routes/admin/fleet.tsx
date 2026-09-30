import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Car as CarIcon } from "lucide-react";
import { can, useAdminRole } from "@/lib/admin-permissions";
import {
  listVehicles,
  upsertVehicle,
  deleteVehicle,
  uploadMedia,
  type DbVehicle,
} from "@/lib/admin-data";

type SortKey = "name" | "price";

function parsePrice(label: string): number {
  const match = label.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : Number.POSITIVE_INFINITY;
}

function VehicleThumb({ url, name }: { url?: string | null; name: string }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="h-10 w-14 flex-shrink-0 rounded-md border border-border object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
      <CarIcon className="h-4 w-4" />
    </div>
  );
}

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
  seats: null,
  transmission: null,
  fuel_type: null,
  features: [],
  status: "available",
  is_featured: false,
  badge: null,
  bags: null,
  image_position: null,
  gallery_urls: [],
};

// Where the photo is anchored inside the card's crop.
const photoFocusOptions = [
  { value: "center", label: "Centre (default)", css: null },
  { value: "top", label: "Top", css: "50% 20%" },
  { value: "upper", label: "Slightly high", css: "50% 38%" },
  { value: "lower", label: "Slightly low", css: "50% 60%" },
  { value: "bottom", label: "Bottom", css: "50% 80%" },
] as const;

function focusValue(css: string | null | undefined) {
  if (!css) return "center";
  return photoFocusOptions.find((o) => o.css === css)?.value ?? "custom";
}

function AdminFleet() {
  // Owner/Manager/Developer can add and edit; only the Owner can delete (RLS).
  // Staff see the fleet read-only.
  const role = useAdminRole();
  const canEdit = can.manageSite(role);
  const canDelete = can.deleteSiteItems(role);
  const [vehicles, setVehicles] = useState<DbVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.category).filter(Boolean))).sort(),
    [vehicles]
  );

  const filteredVehicles = useMemo(() => {
    let list = vehicles;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((v) => v.name.toLowerCase().includes(q));
    }
    if (categoryFilter !== "all") {
      list = list.filter((v) => v.category === categoryFilter);
    }
    return [...list].sort((a, b) =>
      sortKey === "price"
        ? parsePrice(a.price_label) - parsePrice(b.price_label)
        : a.name.localeCompare(b.name)
    );
  }, [vehicles, search, categoryFilter, sortKey]);

  async function toggleActive(vehicle: DbVehicle) {
    setTogglingId(vehicle.id);
    try {
      await upsertVehicle({ ...vehicle, is_active: !vehicle.is_active });
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, is_active: !v.is_active } : v))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  }

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
    if (
      !form.slug ||
      !form.name ||
      !form.category ||
      !form.price_label ||
      !form.deposit ||
      !form.description
    ) {
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

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await uploadMedia(file, "vehicles"));
      setForm((f) => ({ ...f, gallery_urls: [...(f.gallery_urls ?? []), ...urls] }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Fleet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {canEdit
              ? "Manage vehicles shown on the public site."
              : "Vehicles shown on the public site (view only)."}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          {canEdit && (
            <DialogTrigger asChild>
              <Button onClick={openNew}>
                <Plus className="mr-1 h-4 w-4" /> Add vehicle
              </Button>
            </DialogTrigger>
          )}
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
                    placeholder="$150/day"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Deposit</Label>
                  <Input
                    value={form.deposit ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, deposit: e.target.value }))}
                    placeholder="$300 refundable deposit"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Seats</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.seats ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, seats: e.target.value ? Number(e.target.value) : null }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Transmission</Label>
                  <Input
                    value={form.transmission ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value || null }))}
                    placeholder="Auto"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Fuel type</Label>
                  <Input
                    value={form.fuel_type ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, fuel_type: e.target.value || null }))}
                    placeholder="Hybrid"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Card label (optional)</Label>
                  <Input
                    value={form.badge ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value || null }))}
                    placeholder="e.g. Family Pick"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Luggage (bags)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.bags ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bags: e.target.value ? Number(e.target.value) : null }))
                    }
                    placeholder="e.g. 4"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status ?? "available"}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved (shows "Availability on request")</SelectItem>
                    <SelectItem value="rented">Rented (shows "Availability on request")</SelectItem>
                    <SelectItem value="maintenance">Maintenance (shows "Availability on request")</SelectItem>
                    <SelectItem value="inactive">Inactive (hidden from site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="ac">Air conditioning</Label>
                <Switch
                  id="ac"
                  checked={(form.features ?? []).includes("A/C")}
                  onCheckedChange={(checked) =>
                    setForm((f) => {
                      const rest = (f.features ?? []).filter((x) => x !== "A/C");
                      return { ...f, features: checked ? [...rest, "A/C"] : rest };
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <Label htmlFor="featured">Featured on homepage (max 8 shown)</Label>
                <Switch
                  id="featured"
                  checked={form.is_featured ?? false}
                  onCheckedChange={(checked) => setForm((f) => ({ ...f, is_featured: checked }))}
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
                <Label>Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    style={form.image_position ? { objectPosition: form.image_position } : undefined}
                    className="mt-2 aspect-[4/3] w-full rounded-md object-cover"
                  />
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Photo focus</Label>
                <Select
                  value={focusValue(form.image_position)}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      image_position:
                        v === "custom" ? f.image_position ?? null : (photoFocusOptions.find((o) => o.value === v)?.css ?? null),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {photoFocusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                    {focusValue(form.image_position) === "custom" && (
                      <SelectItem value="custom">Custom ({form.image_position})</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Moves the crop if the car is cut off on the card. The preview above updates.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Extra photos (shown in “View details”)</Label>
                <Input type="file" accept="image/*" multiple onChange={handleGalleryChange} disabled={uploading} />
                {(form.gallery_urls ?? []).length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(form.gallery_urls ?? []).map((url, i) => (
                      <div key={url} className="group relative">
                        <img src={url} alt={`Extra photo ${i + 1}`} className="aspect-[4/3] w-full rounded-md object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({ ...f, gallery_urls: (f.gallery_urls ?? []).filter((u) => u !== url) }))
                          }
                          className="absolute right-1 top-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium text-destructive shadow"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
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

      {/* Search, filter, sort controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicles…"
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => setSortKey((k) => (k === "name" ? "price" : "name"))}
        >
          <ArrowUpDown className="mr-1 h-4 w-4" />
          Sort: {sortKey === "name" ? "Name" : "Price"}
        </Button>
      </div>

      {loading && (
        <p className="mt-6 text-center text-sm text-muted-foreground">Loading…</p>
      )}
      {!loading && filteredVehicles.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {vehicles.length === 0 ? "No vehicles yet." : "No vehicles match your search."}
        </p>
      )}

      {!loading && filteredVehicles.length > 0 && (
        <>
          {/* Table view (md and up) */}
          <div className="mt-6 hidden rounded-lg border border-border bg-background md:block">
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
                {filteredVehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <VehicleThumb url={v.image_url} name={v.name} />
                        {v.name}
                      </div>
                    </TableCell>
                    <TableCell>{v.category}</TableCell>
                    <TableCell>{v.price_label}</TableCell>
                    <TableCell>
                      <Switch
                        checked={v.is_active}
                        disabled={!canEdit || togglingId === v.id}
                        onCheckedChange={() => toggleActive(v)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {canEdit && (
                        <Button variant="ghost" size="icon" aria-label={`Edit ${v.name}`} onClick={() => openEdit(v)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button variant="ghost" size="icon" aria-label={`Delete ${v.name}`} onClick={() => handleDelete(v)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card view (mobile) */}
          <div className="mt-6 space-y-3 md:hidden">
            {filteredVehicles.map((v) => (
              <div
                key={v.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
              >
                <VehicleThumb url={v.image_url} name={v.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{v.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {v.category} · {v.price_label}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <Switch
                    checked={v.is_active}
                    disabled={!canEdit || togglingId === v.id}
                    onCheckedChange={() => toggleActive(v)}
                  />
                  {canEdit && (
                    <Button variant="ghost" size="icon" aria-label={`Edit ${v.name}`} onClick={() => openEdit(v)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="icon" aria-label={`Delete ${v.name}`} onClick={() => handleDelete(v)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
