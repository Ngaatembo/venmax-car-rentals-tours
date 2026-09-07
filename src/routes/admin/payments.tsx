import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { eachDayOfInterval, format, parseISO, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Trash2, Pencil, DollarSign, Clock, AlertCircle } from "lucide-react";
import {
  listPayments,
  recordPayment,
  deletePayment,
  listBookings,
  type DbPayment,
  type DbBooking,
  type PaymentStatus,
} from "@/lib/admin-data";
import { useAdminSession, useMyRole } from "@/lib/admin-auth";

const paymentMethods = ["Cash", "EcoCash", "Bank Transfer", "Card", "Other"];

const statusLabel: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

function statusVariant(status: PaymentStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "paid") return "default";
  if (status === "failed" || status === "refunded") return "destructive";
  return "outline";
}

const emptyForm: Partial<DbPayment> = {
  booking_id: "",
  method: "Cash",
  reference: "",
  payment_date: format(new Date(), "yyyy-MM-dd"),
  status: "paid",
  notes: "",
};

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

function AdminPayments() {
  const session = useAdminSession();
  const role = useMyRole(session);
  const canManage = role === "manager" || role === "admin";

  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [bookings, setBookings] = useState<DbBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<DbPayment>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const [p, b] = await Promise.all([listPayments(), listBookings()]);
      setPayments(p);
      setBookings(b);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const bookingLabel = (id: string | null) => {
    if (!id) return "—";
    const b = bookings.find((x) => x.id === id);
    return b ? `${b.reference} · ${b.full_name}` : "Unknown booking";
  };

  const paidPayments = payments.filter((p) => p.status === "paid");
  const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const thisMonthRevenue = paidPayments
    .filter((p) => p.payment_date.startsWith(format(new Date(), "yyyy-MM")))
    .reduce((sum, p) => sum + p.amount, 0);
  const failedOrRefunded = payments.filter(
    (p) => p.status === "failed" || p.status === "refunded"
  ).length;

  // Revenue over the last 30 days (paid payments only)
  const revenueByDay = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const total = paidPayments
        .filter((p) => p.payment_date === dayStr)
        .reduce((sum, p) => sum + p.amount, 0);
      return { date: format(day, "MMM d"), revenue: total };
    });
  }, [paidPayments]);

  const statusChartData = (Object.keys(statusLabel) as PaymentStatus[]).map((status) => ({
    status: statusLabel[status],
    count: payments.filter((p) => p.status === status).length,
  }));

  const methodChartData = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const p of paidPayments) {
      totals[p.method] = (totals[p.method] ?? 0) + p.amount;
    }
    return Object.entries(totals).map(([method, amount]) => ({ method, amount }));
  }, [paidPayments]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(p: DbPayment) {
    setEditingId(p.id);
    setForm(p);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.amount || form.amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!form.method) {
      toast.error("Select a payment method");
      return;
    }
    setSaving(true);
    try {
      const booking = bookings.find((b) => b.id === form.booking_id);
      await recordPayment({
        ...(editingId ? { id: editingId } : {}),
        booking_id: form.booking_id || null,
        customer_id: booking?.customer_id ?? null,
        amount: Number(form.amount),
        method: form.method,
        reference: form.reference?.trim() || null,
        payment_date: form.payment_date || format(new Date(), "yyyy-MM-dd"),
        status: (form.status as PaymentStatus) || "paid",
        notes: form.notes?.trim() || null,
      });
      toast.success(editingId ? "Payment updated" : "Payment recorded");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save payment");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: DbPayment) {
    try {
      await deletePayment(p.id);
      toast.success("Payment deleted");
      setPayments((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete payment");
    }
  }

  const statCards = [
    { label: "Total revenue (paid)", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
    { label: "This month", value: `$${thisMonthRevenue.toFixed(2)}`, icon: DollarSign },
    { label: "Pending amount", value: `$${pendingAmount.toFixed(2)}`, icon: Clock },
    { label: "Failed / refunded", value: failedOrRefunded, icon: AlertCircle },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record and track payments against bookings.
          </p>
        </div>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Record payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit payment" : "Record payment"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="col-span-2">
                <Label>Booking</Label>
                <Select
                  value={form.booking_id || "none"}
                  onValueChange={(v) => setForm((f) => ({ ...f, booking_id: v === "none" ? "" : v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a booking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No booking (general payment)</SelectItem>
                    {bookings.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.reference} · {b.full_name}
                        {b.total_amount ? ` · $${b.total_amount}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Method</Label>
                <Select
                  value={form.method ?? "Cash"}
                  onValueChange={(v) => setForm((f) => ({ ...f, method: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment_date">Date</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={form.payment_date ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, payment_date: e.target.value }))}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status ?? "paid"}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as PaymentStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusLabel) as PaymentStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabel[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="reference">Transaction reference</Label>
                <Input
                  id="reference"
                  value={form.reference ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                  placeholder="e.g. EcoCash confirmation code"
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
                {saving ? "Saving…" : "Save payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">
                {loading ? "…" : card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue — last 30 days</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading…
              </div>
            ) : paidPayments.length === 0 ? (
              <EmptyChartState message="No paid payments yet — revenue will chart here once recorded." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    width={40}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(142 71% 45%)"
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
            <CardTitle className="text-base">Payments by status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading…
              </div>
            ) : payments.length === 0 ? (
              <EmptyChartState message="No payments recorded yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={24} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="hsl(346 77% 50%)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue by payment method</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading…
              </div>
            ) : methodChartData.length === 0 ? (
              <EmptyChartState message="No paid payments to break down yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={methodChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                  <YAxis dataKey="method" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]} fill="hsl(221 83% 53%)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payments table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Booking</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!loading && payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No payments recorded yet.
                </TableCell>
              </TableRow>
            )}
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {format(parseISO(p.payment_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-sm">{bookingLabel(p.booking_id)}</TableCell>
                <TableCell className="font-medium">${p.amount.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.method}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {p.reference || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(p.status)}>{statusLabel[p.status]}</Badge>
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this payment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the payment record and recalculates the linked booking's
                            paid amount.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!canManage && (
        <p className="mt-2 text-xs text-muted-foreground">
          Editing and deleting payments is restricted to managers and admins.
        </p>
      )}
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
