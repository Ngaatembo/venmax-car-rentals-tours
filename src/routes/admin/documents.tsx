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
import { Plus, Trash2, AlertTriangle, FileText, ExternalLink } from "lucide-react";
import {
  listDocuments,
  createDocument,
  deleteDocument,
  uploadDocumentFile,
  getDocumentSignedUrl,
  listDrivers,
  listVehicles,
  type DbDocument,
  type DocumentCategory,
  type DbDriver,
  type DbVehicle,
} from "@/lib/admin-data";
import { useAdminSession, useMyRole } from "@/lib/admin-auth";

const categoryLabel: Record<DocumentCategory, string> = {
  driver_license: "Driver License",
  vehicle_insurance: "Vehicle Insurance",
  vehicle_registration: "Vehicle Registration",
  vehicle_other: "Vehicle — Other",
  company: "Company Document",
};

function expiryWarning(expiry: string | null): "expired" | "soon" | null {
  if (!expiry) return null;
  const days = differenceInCalendarDays(parseISO(expiry), new Date());
  if (days < 0) return "expired";
  if (days <= 30) return "soon";
  return null;
}

const emptyForm = {
  category: "company" as DocumentCategory,
  driver_id: "",
  vehicle_id: "",
  title: "",
  expiry_date: "",
  notes: "",
};

export const Route = createFileRoute("/admin/documents")({
  component: AdminDocuments,
});

function AdminDocuments() {
  const session = useAdminSession();
  const role = useMyRole(session);
  const canDelete = role === "manager" || role === "admin";

  const [documents, setDocuments] = useState<DbDocument[]>([]);
  const [drivers, setDrivers] = useState<DbDriver[]>([]);
  const [vehicles, setVehicles] = useState<DbVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [d, dr, v] = await Promise.all([listDocuments(), listDrivers(), listVehicles()]);
      setDocuments(d);
      setDrivers(dr);
      setVehicles(v);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const driverName = (id: string | null) => drivers.find((d) => d.id === id)?.full_name;
  const vehicleName = (id: string | null) => vehicles.find((v) => v.id === id)?.name;

  const linkedLabel = (doc: DbDocument) => {
    if (doc.driver_id) return driverName(doc.driver_id) ?? "Unknown driver";
    if (doc.vehicle_id) return vehicleName(doc.vehicle_id) ?? "Unknown vehicle";
    return "—";
  };

  const filtered = useMemo(
    () => (categoryFilter === "all" ? documents : documents.filter((d) => d.category === categoryFilter)),
    [documents, categoryFilter]
  );

  const expiringCount = documents.filter((d) => expiryWarning(d.expiry_date)).length;

  function openAdd() {
    setForm(emptyForm);
    setFile(null);
    setFormOpen(true);
  }

  async function handleUpload() {
    if (!form.title.trim()) {
      toast.error("Enter a document title");
      return;
    }
    if (!file) {
      toast.error("Choose a file to upload");
      return;
    }
    setUploading(true);
    try {
      const storagePath = await uploadDocumentFile(file);
      await createDocument({
        category: form.category,
        driver_id: form.category === "driver_license" ? form.driver_id || null : null,
        vehicle_id:
          form.category === "vehicle_insurance" ||
          form.category === "vehicle_registration" ||
          form.category === "vehicle_other"
            ? form.vehicle_id || null
            : null,
        title: form.title.trim(),
        file_url: storagePath,
        file_name: file.name,
        expiry_date: form.expiry_date || null,
        notes: form.notes.trim() || null,
      });
      toast.success("Document uploaded");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload document");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(doc: DbDocument) {
    try {
      await deleteDocument(doc.id);
      toast.success("Document deleted");
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete document");
    }
  }

  async function handleView(doc: DbDocument) {
    try {
      const url = await getDocumentSignedUrl(doc.file_url);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open document");
    }
  }

  const needsDriverPicker = form.category === "driver_license";
  const needsVehiclePicker =
    form.category === "vehicle_insurance" ||
    form.category === "vehicle_registration" ||
    form.category === "vehicle_other";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Licenses, insurance, registration, and company documents in one place.
            {expiringCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" />
                {expiringCount} expiring/expired
              </span>
            )}
          </p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Upload document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload document</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="col-span-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, category: v as DocumentCategory, driver_id: "", vehicle_id: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(categoryLabel) as DocumentCategory[]).map((c) => (
                      <SelectItem key={c} value={c}>
                        {categoryLabel[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {needsDriverPicker && (
                <div className="col-span-2">
                  <Label>Driver</Label>
                  <Select
                    value={form.driver_id || "none"}
                    onValueChange={(v) => setForm((f) => ({ ...f, driver_id: v === "none" ? "" : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not linked to a driver</SelectItem>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsVehiclePicker && (
                <div className="col-span-2">
                  <Label>Vehicle</Label>
                  <Select
                    value={form.vehicle_id || "none"}
                    onValueChange={(v) => setForm((f) => ({ ...f, vehicle_id: v === "none" ? "" : v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not linked to a vehicle</SelectItem>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Blessing Ndlovu — Driver's License"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div>
                <Label htmlFor="expiry_date">Expiry date (if applicable)</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={form.expiry_date}
                  onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 max-w-xs">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(Object.keys(categoryLabel) as DocumentCategory[]).map((c) => (
              <SelectItem key={c} value={c}>
                {categoryLabel[c]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Linked to</TableHead>
              <TableHead>Expiry</TableHead>
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
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {documents.length === 0
                    ? "No documents uploaded yet."
                    : "No documents match this filter."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((doc) => {
              const warning = expiryWarning(doc.expiry_date);
              return (
                <TableRow key={doc.id}>
                  <TableCell>
                    <button
                      onClick={() => handleView(doc)}
                      className="inline-flex items-center gap-2 font-medium text-foreground hover:underline"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {doc.title}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryLabel[doc.category]}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{linkedLabel(doc)}</TableCell>
                  <TableCell>
                    {doc.expiry_date ? (
                      <span
                        className={
                          warning === "expired"
                            ? "font-medium text-destructive"
                            : warning === "soon"
                              ? "font-medium text-amber-600"
                              : "text-muted-foreground"
                        }
                      >
                        {format(parseISO(doc.expiry_date), "MMM d, yyyy")}
                        {warning === "expired" && " (expired)"}
                        {warning === "soon" && " (soon)"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{doc.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This removes the document record. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(doc)}>
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
    </div>
  );
}
