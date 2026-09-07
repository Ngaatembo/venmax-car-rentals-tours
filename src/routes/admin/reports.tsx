import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  endOfDay,
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileBarChart } from "lucide-react";
import {
  listBookings,
  listPayments,
  listCustomers,
  listDrivers,
  listVehicles,
  type DbBooking,
  type DbPayment,
  type DbCustomer,
  type DbDriver,
  type DbVehicle,
} from "@/lib/admin-data";

type ReportKey =
  | "bookings"
  | "revenue"
  | "customers"
  | "drivers"
  | "fleet_utilization"
  | "cancellations";

const reportLabel: Record<ReportKey, string> = {
  bookings: "Bookings",
  revenue: "Revenue (payments)",
  customers: "Customers",
  drivers: "Driver performance",
  fleet_utilization: "Fleet utilization",
  cancellations: "Cancellations",
};

type RangeKey = "today" | "week" | "month" | "last_month" | "year" | "all";

const rangeLabel: Record<RangeKey, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  last_month: "Last month",
  year: "This year",
  all: "All time",
};

function getRange(key: RangeKey): { start: Date; end: Date } | null {
  const now = new Date();
  switch (key) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "week":
      return { start: startOfWeek(now), end: endOfDay(now) };
    case "month":
      return { start: startOfMonth(now), end: endOfDay(now) };
    case "last_month": {
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    }
    case "year":
      return { start: startOfYear(now), end: endOfDay(now) };
    case "all":
      return null;
  }
}

function inRange(dateStr: string, range: { start: Date; end: Date } | null) {
  if (!range) return true;
  try {
    return isWithinInterval(parseISO(dateStr), range);
  } catch {
    return true;
  }
}

type Row = Record<string, string | number>;

function toCsv(columns: string[], rows: Row[]): string {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.join(",")];
  for (const row of rows) {
    lines.push(columns.map((c) => escape(row[c] ?? "")).join(","));
  }
  return lines.join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

function AdminReports() {
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [customers, setCustomers] = useState<DbCustomer[]>([]);
  const [drivers, setDrivers] = useState<DbDriver[]>([]);
  const [vehicles, setVehicles] = useState<DbVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] = useState<ReportKey>("bookings");
  const [range, setRange] = useState<RangeKey>("month");

  useEffect(() => {
    (async () => {
      try {
        const [b, p, c, d, v] = await Promise.all([
          listBookings(),
          listPayments(),
          listCustomers(),
          listDrivers(),
          listVehicles(),
        ]);
        setBookings(b);
        setPayments(p);
        setCustomers(c);
        setDrivers(d);
        setVehicles(v);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load report data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeRange = useMemo(() => getRange(range), [range]);

  const { columns, rows } = useMemo((): { columns: string[]; rows: Row[] } => {
    switch (reportType) {
      case "bookings": {
        const columns = [
          "Reference",
          "Customer",
          "Service",
          "Start",
          "End",
          "Status",
          "Total",
          "Paid",
          "Payment status",
        ];
        const rows = bookings
          .filter((b) => inRange(b.created_at, activeRange))
          .map((b) => ({
            Reference: b.reference,
            Customer: b.full_name,
            Service: b.service_type,
            Start: b.start_date,
            End: b.end_date,
            Status: b.status,
            Total: b.total_amount ?? 0,
            Paid: b.amount_paid ?? 0,
            "Payment status": b.payment_status ?? "",
          }));
        return { columns, rows };
      }
      case "revenue": {
        const columns = ["Date", "Booking", "Amount", "Method", "Reference", "Status"];
        const rows = payments
          .filter((p) => inRange(p.payment_date, activeRange))
          .map((p) => {
            const booking = bookings.find((b) => b.id === p.booking_id);
            return {
              Date: p.payment_date,
              Booking: booking?.reference ?? "—",
              Amount: p.amount,
              Method: p.method,
              Reference: p.reference ?? "",
              Status: p.status,
            };
          });
        return { columns, rows };
      }
      case "customers": {
        const columns = ["Name", "Phone", "Email", "Bookings", "Total paid", "Joined"];
        const rows = customers
          .filter((c) => inRange(c.created_at, activeRange))
          .map((c) => {
            const theirBookings = bookings.filter((b) => b.customer_id === c.id);
            const totalPaid = theirBookings.reduce((sum, b) => sum + (b.amount_paid ?? 0), 0);
            return {
              Name: c.full_name,
              Phone: c.phone,
              Email: c.email ?? "",
              Bookings: theirBookings.length,
              "Total paid": totalPaid,
              Joined: format(parseISO(c.created_at), "yyyy-MM-dd"),
            };
          });
        return { columns, rows };
      }
      case "drivers": {
        const columns = ["Driver", "Status", "Trips", "Completed", "License expiry"];
        const rows = drivers.map((d) => {
          const trips = bookings.filter((b) => b.driver_id === d.id);
          const completed = trips.filter((b) => b.status === "completed").length;
          return {
            Driver: d.full_name,
            Status: d.status,
            Trips: trips.length,
            Completed: completed,
            "License expiry": d.license_expiry ?? "",
          };
        });
        return { columns, rows };
      }
      case "fleet_utilization": {
        const columns = ["Vehicle", "Category", "Active", "Bookings"];
        const rows = vehicles.map((v) => {
          const count = bookings.filter((b) => b.vehicle_slug === v.slug).length;
          return {
            Vehicle: v.name,
            Category: v.category,
            Active: v.is_active ? "Yes" : "No",
            Bookings: count,
          };
        });
        return { columns, rows };
      }
      case "cancellations": {
        const columns = ["Reference", "Customer", "Service", "Cancelled around", "Would-have total"];
        const rows = bookings
          .filter((b) => b.status === "cancelled" && inRange(b.created_at, activeRange))
          .map((b) => ({
            Reference: b.reference,
            Customer: b.full_name,
            Service: b.service_type,
            "Cancelled around": format(parseISO(b.created_at), "yyyy-MM-dd"),
            "Would-have total": b.total_amount ?? 0,
          }));
        return { columns, rows };
      }
    }
  }, [reportType, activeRange, bookings, payments, customers, drivers, vehicles]);

  function handleExport() {
    if (rows.length === 0) {
      toast.error("No data to export for this report and date range");
      return;
    }
    const csv = toCsv(columns, rows);
    const filename = `venmax-${reportType}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    downloadCsv(filename, csv);
    toast.success("CSV downloaded");
  }

  const showRangeFilter = reportType !== "drivers" && reportType !== "fleet_utilization";

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
        <FileBarChart className="h-5 w-5" />
        Reports
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Generate a report and export it as a CSV file to open in Excel or Google Sheets.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <Select value={reportType} onValueChange={(v) => setReportType(v as ReportKey)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(reportLabel) as ReportKey[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {reportLabel[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showRangeFilter && (
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(rangeLabel) as RangeKey[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {rangeLabel[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button onClick={handleExport} disabled={loading}>
          <Download className="mr-1.5 h-4 w-4" />
          Export CSV
        </Button>
        <span className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} row${rows.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c}>{c}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  No data for this report and date range.
                </TableCell>
              </TableRow>
            )}
            {rows.slice(0, 100).map((row, i) => (
              <TableRow key={i}>
                {columns.map((c) => (
                  <TableCell key={c} className="text-sm">
                    {row[c]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length > 100 && (
          <p className="border-t border-border p-3 text-center text-xs text-muted-foreground">
            Showing first 100 of {rows.length} rows — export the CSV to see all of them.
          </p>
        )}
      </div>
    </div>
  );
}
