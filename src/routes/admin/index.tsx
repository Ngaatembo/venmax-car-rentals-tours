import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listVehicles,
  listTours,
  listBookings,
  listInquiries,
  listPayments,
  type DbBooking,
  type DbInquiry,
  type DbPayment,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type RangeKey = "today" | "week" | "month" | "last_month" | "year" | "all";

const rangeLabels: Record<RangeKey, string> = {
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

const bookingStatusOrder = ["pending", "confirmed", "completed", "cancelled"] as const;
const bookingStatusColor: Record<string, string> = {
  pending: "hsl(38 92% 50%)",
  confirmed: "hsl(221 83% 53%)",
  completed: "hsl(142 71% 45%)",
  cancelled: "hsl(0 72% 51%)",
};

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "confirmed") return "default";
  if (status === "cancelled") return "destructive";
  if (status === "completed") return "secondary";
  return "outline";
}

function inquiryBadgeVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "new") return "default";
  if (status === "closed") return "secondary";
  return "outline";
}

function AdminDashboard() {
  const [vehicles, setVehicles] = useState<Awaited<ReturnType<typeof listVehicles>>>([]);
  const [tours, setTours] = useState<Awaited<ReturnType<typeof listTours>>>([]);
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [inquiries, setInquiries] = useState<DbInquiry[]>([]);
  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>("month");

  useEffect(() => {
    (async () => {
      const [v, t, b, i, p] = await Promise.all([
        listVehicles(),
        listTours(),
        listBookings(),
        listInquiries(),
        listPayments(),
      ]);
      setVehicles(v);
      setTours(t);
      setBookings(b);
      setInquiries(i);
      setPayments(p);
      setLoading(false);
    })();
  }, []);

  const activeRange = useMemo(() => getRange(range), [range]);

  const filteredBookings = useMemo(
    () => bookings.filter((b) => inRange(b.created_at, activeRange)),
    [bookings, activeRange]
  );
  const filteredInquiries = useMemo(
    () => inquiries.filter((i) => inRange(i.created_at, activeRange)),
    [inquiries, activeRange]
  );
  const filteredRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.status === "paid" && inRange(p.payment_date, activeRange))
        .reduce((sum, p) => sum + p.amount, 0),
    [payments, activeRange]
  );

  const bookingCounts = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const b of filteredBookings) {
      counts[b.status] = (counts[b.status] ?? 0) + 1;
    }
    return counts;
  }, [filteredBookings]);

  const inquiryCounts = useMemo(() => {
    const counts: Record<string, number> = { new: 0, replied: 0, closed: 0 };
    for (const i of filteredInquiries) {
      counts[i.status] = (counts[i.status] ?? 0) + 1;
    }
    return counts;
  }, [filteredInquiries]);

  const activeVehicles = vehicles.filter((v) => v.is_active).length;
  const activeTours = tours.filter((t) => t.is_active).length;

  // Bookings-over-time — last 30 days, independent of the range filter above
  // (a 30-day trend is more useful here than one that collapses to a single
  // point when "Today" is selected).
  const last30 = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const count = bookings.filter((b) => b.created_at.startsWith(dayStr)).length;
      return { date: format(day, "MMM d"), bookings: count };
    });
  }, [bookings]);

  const statusChartData = bookingStatusOrder.map((status) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count: bookingCounts[status] ?? 0,
    fill: bookingStatusColor[status],
  }));

  const recentBookings = [...bookings]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);
  const recentInquiries = [...inquiries]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const statCards = [
    { label: "Bookings", value: filteredBookings.length, to: "/admin/bookings" },
    { label: "Pending", value: bookingCounts["pending"], to: "/admin/bookings" },
    { label: "Confirmed", value: bookingCounts["confirmed"], to: "/admin/bookings" },
    { label: "Completed", value: bookingCounts["completed"], to: "/admin/bookings" },
    { label: "Cancelled", value: bookingCounts["cancelled"], to: "/admin/bookings" },
    { label: "Revenue", value: `$${filteredRevenue.toFixed(2)}`, to: "/admin/payments" },
    { label: "Fleet vehicles", value: `${activeVehicles}/${vehicles.length} active`, to: "/admin/fleet" },
    { label: "Tour destinations", value: `${activeTours}/${tours.length} active`, to: "/admin/tours" },
    { label: "New inquiries", value: inquiryCounts["new"], to: "/admin/inquiries" },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of VenMax bookings, fleet, and customer activity.
          </p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(rangeLabels) as RangeKey[]).map((key) => (
              <SelectItem key={key} value={key}>
                {rangeLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stat cards — reflect the selected date range */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} to={card.to}>
            <Card className="transition-colors hover:border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">
                  {loading ? "…" : card.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings — last 30 days</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading…
              </div>
            ) : bookings.length === 0 ? (
              <EmptyChartState message="No bookings yet — new bookings will show up here." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="hsl(346 77% 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Booking status — {rangeLabels[range].toLowerCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading…
              </div>
            ) : filteredBookings.length === 0 ? (
              <EmptyChartState message="No bookings in this period." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentBookings.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {b.full_name || b.email}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {b.reference} · {b.service_type} · {format(parseISO(b.created_at), "MMM d, HH:mm")}
                      </p>
                    </div>
                    <Badge variant={statusBadgeVariant(b.status)}>{b.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/admin/bookings"
              className="mt-4 inline-block text-xs font-medium text-primary underline underline-offset-2"
            >
              View all bookings
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : recentInquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No inquiries yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentInquiries.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{i.name || i.email}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {format(parseISO(i.created_at), "MMM d, HH:mm")}
                      </p>
                    </div>
                    <Badge variant={inquiryBadgeVariant(i.status)}>{i.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/admin/inquiries"
              className="mt-4 inline-block text-xs font-medium text-primary underline underline-offset-2"
            >
              View all inquiries
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
