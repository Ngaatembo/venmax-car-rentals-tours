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
  listDocumentsForCustomer,
  createDocument,
  deleteDocument,
  uploadDocumentFile,
  getDocumentSignedUrl,
  CUSTOMER_DOCUMENT_CATEGORIES,
  type DbCustomer,
  type DbBooking,
  type DbDocument,
  type DocumentCategory,
} from "@/lib/admin-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { policies, useSiteSettings, type Policies } from "@/lib/site-settings";
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
  passport_number: "",
  next_of_kin_name: "",
  next_of_kin_phone: "",
  next_of_kin_relationship: "",
  checks: {},
};

// Staff tick-offs against the rental requirements (age and licence years follow
// Website Content → Rates & Policies).
function customerChecks(p: Policies) {
  return [
    { key: "age", label: `Aged ${p.minAge}+ (for self-drive)` },
    { key: "licence", label: `Licence held ${p.licenceYears}+ years` },
    { key: "id", label: "ID document seen" },
    { key: "passport", label: "Passport seen" },
    { key: "proof", label: "Proof of residence / employment seen" },
  ];
}

function hasNextOfKin(c: Partial<DbCustomer>) {
  return Boolean(c.next_of_kin_name?.trim() && c.next_of_kin_phone?.trim());
}

function readiness(c: Partial<DbCustomer>, p: Policies) {
  const checks = customerChecks(p);
  const done = checks.filter((k) => c.checks?.[k.key]).length + (hasNextOfKin(c) ? 1 : 0);
  return { done, total: checks.length + 1 };
}

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
  const policy = policies(useSiteSettings());

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
        passport_number: form.passport_number?.trim() || null,
        next_of_kin_name: form.next_of_kin_name?.trim() || null,
        next_of_kin_phone: form.next_of_kin_phone?.trim() || null,
        next_of_kin_relationship: form.next_of_kin_relationship?.trim() || null,
        checks: form.checks ?? {},
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
          <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
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
              <div>
                <Label htmlFor="id_number">National ID number</Label>
                <Input
                  id="id_number"
                  value={form.id_number ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, id_number: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="passport_number">Passport number</Label>
                <Input
                  id="passport_number"
                  value={form.passport_number ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, passport_number: e.target.value }))}
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
              <div className="col-span-2 rounded-md border border-border p-3">
                <p className="text-sm font-medium text-foreground">Next of kin (emergency contact)</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="kin_name">Name</Label>
                    <Input
                      id="kin_name"
                      value={form.next_of_kin_name ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, next_of_kin_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kin_phone">Phone</Label>
                    <Input
                      id="kin_phone"
                      value={form.next_of_kin_phone ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, next_of_kin_phone: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="kin_rel">Relationship</Label>
                    <Input
                      id="kin_rel"
                      placeholder="e.g. Sister"
                      value={form.next_of_kin_relationship ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, next_of_kin_relationship: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-2 rounded-md border border-border p-3">
                <p className="text-sm font-medium text-foreground">Rental requirements checked</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {customerChecks(policy).map((k) => (
                    <label key={k.key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={Boolean(form.checks?.[k.key])}
                        onCheckedChange={(v) =>
                          setForm((f) => ({ ...f, checks: { ...(f.checks ?? {}), [k.key]: v === true } }))
                        }
                      />
                      {k.label}
                    </label>
                  ))}
                </div>
              </div>
              {editingId && (
                <div className="col-span-2">
                  <CustomerDocuments customerId={editingId} canDelete={canDelete} />
                </div>
              )}
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
              <TableHead>Requirements</TableHead>
              <TableHead>Added</TableHead>
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
            {!loading && filtered.length === 0 && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No customers yet — add your first customer to get started.
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.length === 0 && customers.length > 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                <TableCell>
                  {(() => {
                    const r = readiness(c, policy);
                    return r.done === r.total ? (
                      <Badge>Ready</Badge>
                    ) : (
                      <Badge variant="outline">
                        {r.done}/{r.total} done
                      </Badge>
                    );
                  })()}
                </TableCell>
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
                {profileCustomer.passport_number && <p>Passport: {profileCustomer.passport_number}</p>}
                {hasNextOfKin(profileCustomer) ? (
                  <p>
                    Next of kin: {profileCustomer.next_of_kin_name}
                    {profileCustomer.next_of_kin_relationship && ` (${profileCustomer.next_of_kin_relationship})`} ·{" "}
                    {profileCustomer.next_of_kin_phone}
                  </p>
                ) : (
                  <p className="text-amber-600">Next of kin not recorded yet</p>
                )}
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {customerChecks(policy).map((k) => (
                    <li key={k.key}>
                      <Badge variant={profileCustomer.checks?.[k.key] ? "default" : "outline"}>
                        {profileCustomer.checks?.[k.key] ? "✓ " : ""}
                        {k.label}
                      </Badge>
                    </li>
                  ))}
                </ul>
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

function CustomerDocuments({ customerId, canDelete }: { customerId: string; canDelete: boolean }) {
  const [docs, setDocs] = useState<DbDocument[] | null>(null);
  const [category, setCategory] = useState<DocumentCategory>("customer_id");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    try {
      setDocs(await listDocumentsForCustomer(customerId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load documents");
      setDocs([]);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const label = (c: DocumentCategory) => CUSTOMER_DOCUMENT_CATEGORIES.find((x) => x.value === c)?.label ?? c;

  async function upload() {
    if (!file) {
      toast.error("Choose a file first");
      return;
    }
    setUploading(true);
    try {
      const path = await uploadDocumentFile(file);
      await createDocument({ category, customer_id: customerId, title: label(category), file_url: path, file_name: file.name });
      toast.success("Document uploaded");
      setFile(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function view(doc: DbDocument) {
    try {
      window.open(await getDocumentSignedUrl(doc.file_url), "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open document");
    }
  }

  async function remove(doc: DbDocument) {
    if (!confirm(`Delete ${doc.title}?`)) return;
    try {
      await deleteDocument(doc.id);
      setDocs((d) => (d ?? []).filter((x) => x.id !== doc.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-sm font-medium text-foreground">Documents (private — staff only)</p>
      {docs === null ? (
        <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
      ) : docs.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No documents uploaded yet.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-2 rounded border border-border px-2 py-1.5 text-sm">
              <span className="min-w-0 truncate">
                <span className="font-medium">{d.title}</span>
                {d.file_name && <span className="text-muted-foreground"> · {d.file_name}</span>}
              </span>
              <span className="flex shrink-0 gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => view(d)}>
                  View
                </Button>
                {canDelete && (
                  <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => remove(d)}>
                    Delete
                  </Button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
          <SelectTrigger className="sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CUSTOMER_DOCUMENT_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Button type="button" variant="secondary" onClick={upload} disabled={uploading || !file}>
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
    </div>
  );
}
