import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addBusinessDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBooking, type DbBooking, type DbVehicle, type DepositStatus } from "@/lib/admin-data";
import { policies, useSiteSettings } from "@/lib/site-settings";

const FUEL_LEVELS = ["Full", "3/4", "1/2", "1/4", "Empty"] as const;
const DEPOSIT_STATUSES: { value: DepositStatus; label: string }[] = [
  { value: "not_taken", label: "Not taken yet" },
  { value: "held", label: "Held" },
  { value: "refunded", label: "Refunded in full" },
  { value: "partially_refunded", label: "Refunded less deductions" },
];
// Rentals of this many days or more count as "one month or more" (unlimited mileage).
const UNLIMITED_FROM_DAYS = 30;

function dollars(label: string | null | undefined): number | null {
  if (!label) return null;
  const m = label.replace(/,/g, "").match(/\$\s?(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

function num(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const money = (n: number) => `$${n.toFixed(2)}`;

type Form = {
  daily_rate: string;
  chauffeur: boolean;
  deposit_amount: string;
  deposit_status: DepositStatus;
  deposit_deduction: string;
  deposit_deduction_reason: string;
  deposit_refunded_on: string;
  mileage_out: string;
  mileage_in: string;
  fuel_out: string;
  fuel_in: string;
  cancelled_on: string;
  refund_amount: string;
  refund_due_on: string;
  refund_paid_on: string;
  total_amount: string;
  admin_notes: string;
};

const str = (v: number | string | null | undefined) => (v === null || v === undefined ? "" : String(v));

export function BookingDetailsDialog({
  booking,
  vehicles,
  onClose,
  onSaved,
}: {
  booking: DbBooking | null;
  vehicles: DbVehicle[];
  onClose: () => void;
  onSaved: (updated: DbBooking) => void;
}) {
  const p = policies(useSiteSettings());
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  const vehicle = useMemo(
    () => (booking ? vehicles.find((v) => v.id === booking.vehicle_id || v.slug === booking.vehicle_slug) : undefined),
    [booking, vehicles],
  );

  useEffect(() => {
    if (!booking) {
      setForm(null);
      return;
    }
    setForm({
      daily_rate: str(booking.daily_rate ?? dollars(vehicle?.price_label)),
      chauffeur: booking.chauffeur ?? booking.service_type === "chauffeur",
      deposit_amount: str(booking.deposit_amount ?? dollars(vehicle?.deposit)),
      deposit_status: booking.deposit_status ?? "not_taken",
      deposit_deduction: str(booking.deposit_deduction),
      deposit_deduction_reason: booking.deposit_deduction_reason ?? "",
      deposit_refunded_on: booking.deposit_refunded_on ?? "",
      mileage_out: str(booking.mileage_out),
      mileage_in: str(booking.mileage_in),
      fuel_out: booking.fuel_out ?? "",
      fuel_in: booking.fuel_in ?? "",
      cancelled_on: booking.cancelled_on ?? "",
      refund_amount: str(booking.refund_amount ?? booking.amount_paid),
      refund_due_on: booking.refund_due_on ?? "",
      refund_paid_on: booking.refund_paid_on ?? "",
      total_amount: str(booking.total_amount),
      admin_notes: booking.admin_notes ?? "",
    });
  }, [booking, vehicle]);

  if (!booking || !form) return null;

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  // ---- Calculations (from Rates & Policies) ----
  const days = Math.max(
    1,
    differenceInCalendarDays(parseISO(booking.end_date), parseISO(booking.start_date)) || 1,
  );
  const rate = num(form.daily_rate) ?? 0;
  const rental = rate * days;
  const chauffeurFee = form.chauffeur ? Number(p.chauffeurFeeAmount) * days : 0;
  const out = num(form.mileage_out);
  const back = num(form.mileage_in);
  const driven = out !== null && back !== null ? back - out : null;
  const unlimited = days >= UNLIMITED_FROM_DAYS;
  const allowance = Number(p.freeKmAmount) * days;
  const excessKm = driven !== null && !unlimited ? Math.max(0, driven - allowance) : 0;
  const excessCharge = excessKm * Number(p.excessRateAmount);
  const suggestedTotal = rental + chauffeurFee + excessCharge;
  const fuelShort =
    form.fuel_out && form.fuel_in && FUEL_LEVELS.indexOf(form.fuel_in as never) > FUEL_LEVELS.indexOf(form.fuel_out as never);
  const deposit = num(form.deposit_amount) ?? 0;
  const deduction = num(form.deposit_deduction) ?? 0;
  const suggestedRefundDue = form.cancelled_on
    ? format(addBusinessDays(parseISO(form.cancelled_on), Number(p.refundDays)), "yyyy-MM-dd")
    : "";

  async function save() {
    if (!form || !booking) return;
    setSaving(true);
    const updates: Partial<DbBooking> = {
      daily_rate: num(form.daily_rate),
      chauffeur: form.chauffeur,
      deposit_amount: num(form.deposit_amount),
      deposit_status: form.deposit_status,
      deposit_deduction: num(form.deposit_deduction),
      deposit_deduction_reason: form.deposit_deduction_reason.trim() || null,
      deposit_refunded_on: form.deposit_refunded_on || null,
      mileage_out: num(form.mileage_out),
      mileage_in: num(form.mileage_in),
      fuel_out: form.fuel_out || null,
      fuel_in: form.fuel_in || null,
      cancelled_on: form.cancelled_on || null,
      refund_amount: num(form.refund_amount),
      refund_due_on: form.refund_due_on || null,
      refund_paid_on: form.refund_paid_on || null,
      total_amount: num(form.total_amount),
      admin_notes: form.admin_notes.trim() || null,
    };
    try {
      await updateBooking(booking.id, updates);
      toast.success("Rental details saved");
      onSaved({ ...booking, ...updates });
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const field = (label: string, k: keyof Form, type: "number" | "date" | "text" = "number", placeholder?: string) => (
    <div>
      <Label htmlFor={`bk-${k}`}>{label}</Label>
      <Input
        id={`bk-${k}`}
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        placeholder={placeholder}
        value={form[k] as string}
        onChange={(e) => set(k, e.target.value as never)}
      />
    </div>
  );

  const fuelSelect = (label: string, k: "fuel_out" | "fuel_in") => (
    <div>
      <Label>{label}</Label>
      <Select value={form[k] || "unset"} onValueChange={(v) => set(k, v === "unset" ? "" : v)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unset">Not recorded</SelectItem>
          {FUEL_LEVELS.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Rental details · <span className="font-mono text-base">{booking.reference}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {booking.full_name} · {vehicle?.name ?? booking.vehicle_slug ?? booking.service_type} ·{" "}
            {booking.start_date} → {booking.end_date} ({days} day{days === 1 ? "" : "s"})
          </p>
        </DialogHeader>

        <div className="space-y-5">
          <section className="rounded-md border border-border p-4">
            <h3 className="text-sm font-semibold">Charges</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {field("Daily rate (US$)", "daily_rate", "number", dollars(vehicle?.price_label)?.toString())}
              <div className="flex items-end gap-2 pb-2 sm:col-span-2">
                <Switch id="bk-chauffeur" checked={form.chauffeur} onCheckedChange={(v) => set("chauffeur", v)} />
                <Label htmlFor="bk-chauffeur">
                  Chauffeur ({p.chauffeurFee}){p.chauffeurClientCovers ? ` — ${p.chauffeurClientCovers}` : ""}
                </Label>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-border p-4">
            <h3 className="text-sm font-semibold">Mileage &amp; fuel</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              {field("Odometer out (km)", "mileage_out")}
              {field("Odometer back (km)", "mileage_in")}
              {fuelSelect("Fuel out", "fuel_out")}
              {fuelSelect("Fuel back", "fuel_in")}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {unlimited
                ? `Unlimited mileage — rentals of ${p.unlimitedFrom} or more.`
                : `Allowance: ${p.freeKm} × ${days} day${days === 1 ? "" : "s"} = ${allowance} km. Excess charged at ${p.excessRate}/km.`}
              {driven !== null && ` Driven: ${driven} km.`}
              {excessKm > 0 && ` Excess: ${excessKm} km = ${money(excessCharge)}.`}
            </p>
            {fuelShort && (
              <p className="mt-1 text-xs font-medium text-amber-600">
                Returned with less fuel than it went out with — the customer should cover the difference.
              </p>
            )}
          </section>

          <section className="rounded-md border border-border p-4">
            <h3 className="text-sm font-semibold">Refundable deposit</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {field("Deposit (US$)", "deposit_amount", "number", dollars(vehicle?.deposit)?.toString())}
              <div>
                <Label>Status</Label>
                <Select value={form.deposit_status} onValueChange={(v) => set("deposit_status", v as DepositStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPOSIT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {field("Refunded on", "deposit_refunded_on", "date")}
              {field("Deduction (US$)", "deposit_deduction")}
              <div className="sm:col-span-2">
                {field("Reason for deduction", "deposit_deduction_reason", "text", "e.g. minor damage, excess mileage")}
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Refund to customer: {money(Math.max(0, deposit - deduction))} — paid when the vehicle is returned, by
              the payment method agreed with them.
            </p>
          </section>

          <section className="rounded-md border border-border p-4">
            <h3 className="text-sm font-semibold">Cancellation</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              {field("Cancelled on", "cancelled_on", "date")}
              {field("Refund amount (US$)", "refund_amount")}
              <div>
                {field("Refund due by", "refund_due_on", "date")}
                {suggestedRefundDue && form.refund_due_on !== suggestedRefundDue && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-primary underline underline-offset-2"
                    onClick={() => set("refund_due_on", suggestedRefundDue)}
                  >
                    Use {format(parseISO(suggestedRefundDue), "d MMM")} ({p.refundDays} business days)
                  </button>
                )}
              </div>
              {field("Refund paid on", "refund_paid_on", "date")}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              No cancellation fee: the full amount paid is refunded within {p.refundDays} business working days.
              Weekends are skipped; public holidays are not.
            </p>
          </section>

          <section className="rounded-md border border-border p-4">
            <h3 className="text-sm font-semibold">Total &amp; notes</h3>
            <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
              <span>
                Rental: {money(rate)} × {days} = {money(rental)}
              </span>
              {chauffeurFee > 0 && <span>Chauffeur: {money(chauffeurFee)}</span>}
              {excessCharge > 0 && <span>Excess mileage: {money(excessCharge)}</span>}
              <span className="font-medium text-foreground">Suggested total: {money(suggestedTotal)}</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                {field("Total charged (US$)", "total_amount")}
                {suggestedTotal > 0 && num(form.total_amount) !== Number(suggestedTotal.toFixed(2)) && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-primary underline underline-offset-2"
                    onClick={() => set("total_amount", suggestedTotal.toFixed(2))}
                  >
                    Use suggested total
                  </button>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="bk-notes">Staff notes</Label>
                <Textarea
                  id="bk-notes"
                  rows={2}
                  value={form.admin_notes}
                  onChange={(e) => set("admin_notes", e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save rental details"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
