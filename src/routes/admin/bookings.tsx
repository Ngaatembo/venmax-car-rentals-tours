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
import { listBookings, updateBookingStatus, type DbBooking } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const statuses = ["pending", "confirmed", "completed", "cancelled"];

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed") return "default";
  if (status === "cancelled") return "destructive";
  if (status === "completed") return "secondary";
  return "outline";
}

function AdminBookings() {
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setBookings(await listBookings());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleStatusChange(booking: DbBooking, status: string) {
    try {
      await updateBookingStatus(booking.id, status);
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status } : b)));
      toast.success("Status updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Requests submitted through the site's booking form.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
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
            {!loading && bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No bookings yet.
                </TableCell>
              </TableRow>
            )}
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.reference}</TableCell>
                <TableCell>
                  <div className="font-medium">{b.full_name}</div>
                  <div className="text-xs text-muted-foreground">{b.pickup_location}</div>
                </TableCell>
                <TableCell className="capitalize">{b.service_type.replace("-", " ")}</TableCell>
                <TableCell className="whitespace-nowrap text-xs">
                  {b.start_date} → {b.end_date}
                </TableCell>
                <TableCell className="text-xs">
                  <div>{b.email}</div>
                  <div>{b.phone}</div>
                </TableCell>
                <TableCell>
                  <Select value={b.status} onValueChange={(v) => handleStatusChange(b, v)}>
                    <SelectTrigger className="h-8 w-36">
                      <SelectValue>
                        <Badge variant={statusVariant(b.status)} className="capitalize">
                          {b.status}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
