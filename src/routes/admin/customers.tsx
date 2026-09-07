import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
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
import { Plus, Pencil, Trash2, Search, User as UserIcon } from "lucide-react";
import {
  listCustomers,
  upsertCustomer,
  deleteCustomer,
  listBookingsForCustomer,
  type DbCustomer,
  type DbBooking,
} from "@/lib/admin-data";
import { useMyRole } from "@/lib/admin-auth";
import { useAdminSession } from "@/lib/admin-auth";

const emptyForm: Partial<DbCustomer> = {
  full_name: "",
  phone: "",
  email: "",
  license_number: "",
  license_expiry: "",
  id_number: "",
  address: "",
  notes: "",
};

function bookingStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed" || status === "active") return "default";
  if (status === "cancelled") return "destructive";
  if (status === "completed") return "secondary";
  return "outline";
}

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const session = useAdminSession();
  const role = useMyRole(session);
  const canDelete = role === "manager" || role === "admin";

  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<DbCustomer>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [profileCustomer, setProfileCustomer] = useState<DbCustomer | null>(null);
  const [profileBookings, setProfileBookings] = useState<DbBooking[] | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setCustomers(await listCustomers());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(c: DbCustomer) {
    setEditingId(c.id);
    setForm(c);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.full_name?.trim() || !form.phone?.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    setSaving(true);
    try {
      await upsertCustomer({
        ...(editingId ? { id: editingId } : {}),
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || null,
        license_number: form.license_number?.trim() || null,
        license_expiry: form.license_expiry || null,
        id_number: form.id_number?.trim() || null,
        address: form.address?.trim() || null,
        notes: form.notes?.trim() || null,
      });
      toast.success(editingId ? "Customer updated" : "Customer added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save customer");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: DbCustomer) {
    try {
      await deleteCustomer(c.id);
      toast.success(`${c.full_name} deleted`);
      setCustomers((prev) => prev.filter((x) => x.id !== c.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete customer");
    }
  }

  async function openProfile(c: DbCustomer) {
    setProfileCustomer(c);
    setProfileBookings(null);
    setProfileLoading(true);
    try {
      setProfileBookings(await listBookingsForCustomer(c.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load bookings");
      setProfileBookings([]);
    } finally {
      setProfileLoading(false);
    }
  }

  const totalSpent = (bookings: DbBooking[]) =>
    bookings.reduce((sum, b) => sum + (b.amount_paid ?? 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage customer records. Click a row to view their booking history.
          </p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit customer" : "Add customer"}</DialogTitle>
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
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
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
                {saving ? "Saving…" : "Save customer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, phone, or email…"
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
              <TableHead>Email</TableHead>
              <TableHead>Added</TableHead>
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
            {!loading && filtered.length === 0 && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No customers yet — add your first customer to get started.
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && customers.length > 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No customers match your search.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer"
                onClick={() => openProfile(c)}
              >
                <TableCell className="font-medium">
                  <span className="inline-flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    {c.full_name}
                  </span>
                </TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell className="text-muted-foreground">{c.email || "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(parseISO(c.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
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
                          <AlertDialogTitle>Delete {c.full_name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the customer record. Their past bookings will remain but
                            will no longer be linked to a customer profile.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(c)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Customer profile */}
      <Dialog open={!!profileCustomer} onOpenChange={(open) => !open && setProfileCustomer(null)}>
        <DialogContent className="max-w-lg">
          {profileCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>{profileCustomer.full_name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{profileCustomer.phone}</p>
                {profileCustomer.email && <p>{profileCustomer.email}</p>}
                {profileCustomer.address && <p>{profileCustomer.address}</p>}
                {profileCustomer.license_number && (
                  <p>
                    License: {profileCustomer.license_number}
                    {profileCustomer.license_expiry &&
                      ` (expires ${format(parseISO(profileCustomer.license_expiry), "MMM d, yyyy")})`}
                  </p>
                )}
                {profileCustomer.notes && (
                  <p className="pt-1 italic text-foreground/80">"{profileCustomer.notes}"</p>
                )}
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Booking history</h3>
                  {profileBookings && profileBookings.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {profileBookings.length} booking{profileBookings.length === 1 ? "" : "s"} ·
                      total paid ${totalSpent(profileBookings).toFixed(2)}
                    </span>
                  )}
                </div>

                {profileLoading && (
                  <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
                )}
                {!profileLoading && profileBookings?.length === 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No bookings linked to this customer yet.
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
