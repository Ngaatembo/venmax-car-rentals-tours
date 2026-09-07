import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, Search, AlertTriangle, IdCard } from "lucide-react";
import {
  listDrivers,
  upsertDriver,
  deleteDriver,
  listVehicles,
  listBookingsForDriver,
  type DbDriver,
  type DbVehicle,
  type DbBooking,
  type DriverStatus,
} from "@/lib/admin-data";
import { useAdminSession, useMyRole } from "@/lib/admin-auth";

const statusLabel: Record<DriverStatus, string> = {
  available: "Available",
  assigned: "Assigned",
  on_trip: "On Trip",
  off_duty: "Off Duty",
  suspended: "Suspended",
};

function statusVariant(status: DriverStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "available") return "default";
  if (status === "on_trip" || status === "assigned") return "secondary";
  if (status === "suspended") return "destructive";
  return "outline";
}

function licenseWarning(expiry: string | null): { level: "expired" | "soon" | null; days: number } {
  if (!expiry) return { level: null, days: 0 };
  const days = differenceInCalendarDays(parseISO(expiry), new Date());
  if (days < 0) return { level: "expired", days };
  if (days <= 30) return { level: "soon", days };
  return { level: null, days };
}

const emptyForm: Partial<DbDriver> = {
  full_name: "",
  phone: "",
  email: "",
  license_number: "",
  license_expiry: "",
  id_number: "",
  assigned_vehicle_id: null,
  status: "available",
  notes: "",
};

function bookingStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed" || status === "active") return "default";
  if (status === "cancelled") return "destructive";
  if (status === "completed") return "secondary";
  return "outline";
}

export const Route = createFileRoute("/admin/drivers")({
  component: AdminDrivers,
});

function AdminDrivers() {
  const session = useAdminSession();
  const role = useMyRole(session);
  const canDelete = role === "manager" || role === "admin";

  const [drivers, setDrivers] = useState<DbDriver[]>([]);
  const [vehicles, setVehicles] = useState<DbVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<DbDriver>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [profileDriver, setProfileDriver] = useState<DbDriver | null>(null);
  const [profileBookings, setProfileBookings] = useState<DbBooking[] | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [d, v] = await Promise.all([listDrivers(), listVehicles()]);
      setDrivers(d);
      setVehicles(v);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const vehicleName = (id: string | null) =>
    id ? vehicles.find((v) => v.id === id)?.name ?? "Unknown vehicle" : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return drivers;
    return drivers.filter(
      (d) => d.full_name.toLowerCase().includes(q) || d.phone.toLowerCase().includes(q)
    );
  }, [drivers, search]);

  const expiringSoon = drivers.filter((d) => licenseWarning(d.license_expiry).level).length;

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(d: DbDriver) {
    setEditingId(d.id);
    setForm(d);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.full_name?.trim() || !form.phone?.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    setSaving(true);
    try {
      await upsertDriver({
        ...(editingId ? { id: editingId } : {}),
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || null,
        license_number: form.license_number?.trim() || null,
        license_expiry: form.license_expiry || null,
        id_number: form.id_number?.trim() || null,
        assigned_vehicle_id: form.assigned_vehicle_id || null,
        status: (form.status as DriverStatus) || "available",
        notes: form.notes?.trim() || null,
      });
      toast.success(editingId ? "Driver updated" : "Driver added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save driver");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(d: DbDriver) {
    try {
      await deleteDriver(d.id);
      toast.success(`${d.full_name} deleted`);
      setDrivers((prev) => prev.filter((x) => x.id !== d.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete driver");
    }
  }

  async function handleQuickStatus(d: DbDriver, status: DriverStatus) {
    try {
      await upsertDriver({ id: d.id, full_name: d.full_name, phone: d.phone, status });
      setDrivers((prev) => prev.map((x) => (x.id === d.id ? { ...x, status } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function openProfile(d: DbDriver) {
    setProfileDriver(d);
    setProfileBookings(null);
    setProfileLoading(true);
    try {
      setProfileBookings(await listBookingsForDriver(d.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load trips");
      setProfileBookings([]);
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Drivers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage driver records, availability, and vehicle assignments.
            {expiringSoon > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                {expiringSoon} license{expiringSoon === 1 ? "" : "s"} expiring/expired
              </span>
            )}
          </p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit driver" : "Add driver"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="col-span-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  value={form.full_name ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="license_number">License number</Label>
                <Input
                  id="license_number"
                  value={form.license_number ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="license_expiry">License expiry</Label>
                <Input
                  id="license_expiry"
                  type="date"
                  value={form.license_expiry ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, license_expiry: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="id_number">ID / passport number</Label>
                <Input
                  id="id_number"
                  value={form.id_number ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, id_number: e.target.value }))}
                />
              </div>
              <div>
                <Label>Assigned vehicle</Label>
                <Select
                  value={form.assigned_vehicle_id ?? "none"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, assigned_vehicle_id: v === "none" ? null : v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status ?? "available"}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as DriverStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusLabel) as DriverStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabel[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save driver"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name or phone…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && drivers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No drivers yet — add your first driver to get started.
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && drivers.length > 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No drivers match your search.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((d) => {
              const warning = licenseWarning(d.license_expiry);
              return (
                <TableRow key={d.id} className="cursor-pointer" onClick={() => openProfile(d)}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      {d.full_name}
                    </span>
                  </TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>
                    {d.license_expiry ? (
                      <span
                        className={
                          warning.level === "expired"
                            ? "font-medium text-destructive"
                            : warning.level === "soon"
                              ? "font-medium text-amber-600"
                              : "text-muted-foreground"
                        }
                      >
                        {format(parseISO(d.license_expiry), "MMM d, yyyy")}
                        {warning.level === "expired" && " (expired)"}
                        {warning.level === "soon" && ` (${warning.days}d left)`}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {vehicleName(d.assigned_vehicle_id) ?? "—"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={d.status}
                      onValueChange={(v) => handleQuickStatus(d, v as DriverStatus)}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue>
                          <Badge variant={statusVariant(d.status)}>{statusLabel[d.status]}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(statusLabel) as DriverStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusLabel[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(d)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {d.full_name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes the driver record. Bookings previously assigned to them
                              will be unassigned, not deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(d)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Driver profile */}
      <Dialog open={!!profileDriver} onOpenChange={(open) => !open && setProfileDriver(null)}>
        <DialogContent className="max-w-lg">
          {profileDriver && (
            <>
              <DialogHeader>
                <DialogTitle>{profileDriver.full_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{profileDriver.phone}</p>
                {profileDriver.email && <p>{profileDriver.email}</p>}
                {profileDriver.license_number && (
                  <p>
                    License: {profileDriver.license_number}
                    {profileDriver.license_expiry &&
                      ` (expires ${format(parseISO(profileDriver.license_expiry), "MMM d, yyyy")})`}
                  </p>
                )}
                {vehicleName(profileDriver.assigned_vehicle_id) && (
                  <p>Assigned vehicle: {vehicleName(profileDriver.assigned_vehicle_id)}</p>
                )}
                {profileDriver.notes && (
                  <p className="pt-1 italic text-foreground/80">"{profileDriver.notes}"</p>
                )}
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <h3 className="text-sm font-medium text-foreground">Trip history</h3>
                {profileLoading && <p className="mt-2 text-sm text-muted-foreground">Loading…</p>}
                {!profileLoading && profileBookings?.length === 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No trips assigned to this driver yet.
                  </p>
                )}
                {!profileLoading && profileBookings && profileBookings.length > 0 && (
                  <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                    {profileBookings.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border p-2 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{b.reference}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {b.service_type} · {format(parseISO(b.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                        <Badge variant={bookingStatusVariant(b.status)}>{b.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
