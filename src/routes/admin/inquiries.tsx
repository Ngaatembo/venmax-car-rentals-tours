import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { listInquiries, updateInquiryStatus, type DbInquiry } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

const statuses = ["new", "replied", "closed"];

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "new") return "default";
  if (status === "closed") return "secondary";
  return "outline";
}

function AdminInquiries() {
  const [inquiries, setInquiries] = useState<DbInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setInquiries(await listInquiries());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleStatusChange(inquiry: DbInquiry, status: string) {
    try {
      await updateInquiryStatus(inquiry.id, status);
      setInquiries((prev) => prev.map((i) => (i.id === inquiry.id ? { ...i, status } : i)));
      toast.success("Status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Inquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Messages submitted through the site's contact form.
      </p>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && inquiries.length === 0 && (
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
        )}
        {inquiries.map((i) => (
          <div key={i.id} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{i.name}</p>
                <p className="text-xs text-muted-foreground">
                  {i.email} · {i.phone}
                </p>
              </div>
              <Select value={i.status} onValueChange={(v) => handleStatusChange(i, v)}>
                <SelectTrigger className="h-8 w-32">
                  <SelectValue>
                    <Badge variant={statusVariant(i.status)} className="capitalize">
                      {i.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-3 text-sm text-foreground/90">{i.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
