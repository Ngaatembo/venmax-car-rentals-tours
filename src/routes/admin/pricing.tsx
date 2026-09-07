import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Pencil, Trash2, Calculator } from "lucide-react";
import {
  listPricingRules,
  upsertPricingRule,
  deletePricingRule,
  type DbPricingRule,
  type PricingServiceType,
  type PricingChargeType,
} from "@/lib/admin-data";
import { useAdminSession, useMyRole } from "@/lib/admin-auth";

const serviceTypeLabel: Record<PricingServiceType, string> = {
  all: "All services",
  "self-drive": "Self-Drive",
  chauffeur: "Chauffeur",
  "airport-transfer": "Airport Transfer",
  shuttle: "Shuttle",
  tour: "Tour",
};

const chargeTypeLabel: Record<PricingChargeType, string> = {
  flat: "Flat charge ($)",
  percentage: "Percentage charge (%)",
  discount_flat: "Flat discount ($)",
  discount_percentage: "Percentage discount (%)",
};

function formatAmount(rule: DbPricingRule) {
  if (rule.charge_type === "percentage") return `+${rule.amount}%`;
  if (rule.charge_type === "discount_percentage") return `-${rule.amount}%`;
  if (rule.charge_type === "discount_flat") return `-$${rule.amount.toFixed(2)}`;
  return `+$${rule.amount.toFixed(2)}`;
}

const emptyForm: Partial<DbPricingRule> = {
  name: "",
  service_type: "all",
  charge_type: "flat",
  description: "",
  is_active: true,
  sort_order: 0,
};

export const Route = createFileRoute("/admin/pricing")({
  component: AdminPricing,
});

function AdminPricing() {
  const session = useAdminSession();
  const role = useMyRole(session);
  const canManage = role === "manager" || role === "admin";

  const [rules, setRules] = useState<DbPricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<DbPricingRule>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculator preview state
  const [previewService, setPreviewService] = useState<PricingServiceType>("self-drive");
  const [previewBase, setPreviewBase] = useState(100);

  async function refresh() {
    setLoading(true);
    try {
      setRules(await listPricingRules());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load pricing rules");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(r: DbPricingRule) {
    setEditingId(r.id);
    setForm(r);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.name?.trim()) {
      toast.error("Enter a rule name");
      return;
    }
    if (form.amount === undefined || form.amount === null || isNaN(form.amount)) {
      toast.error("Enter a valid amount");
      return;
    }
    setSaving(true);
    try {
      await upsertPricingRule({
        ...(editingId ? { id: editingId } : {}),
        name: form.name.trim(),
        service_type: (form.service_type as PricingServiceType) || "all",
        charge_type: (form.charge_type as PricingChargeType) || "flat",
        amount: Number(form.amount),
        description: form.description?.trim() || null,
        is_active: form.is_active ?? true,
        sort_order: form.sort_order ?? 0,
      });
      toast.success(editingId ? "Rule updated" : "Rule added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save rule");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(r: DbPricingRule) {
    try {
      await deletePricingRule(r.id);
      toast.success("Rule deleted");
      setRules((prev) => prev.filter((x) => x.id !== r.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete rule");
    }
  }

  async function handleToggleActive(r: DbPricingRule, active: boolean) {
    try {
      await upsertPricingRule({ id: r.id, name: r.name, charge_type: r.charge_type, amount: r.amount, is_active: active });
      setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, is_active: active } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update rule");
    }
  }

  // Applicable rules for the calculator preview: active, and either "all"
  // services or specifically matching the selected service type.
  const applicableRules = useMemo(
    () =>
      rules.filter(
        (r) => r.is_active && (r.service_type === "all" || r.service_type === previewService)
      ),
    [rules, previewService]
  );

  const calculation = useMemo(() => {
    let running = previewBase;
    const steps: { label: string; delta: number; runningTotal: number }[] = [];
    for (const rule of applicableRules) {
      let delta = 0;
      if (rule.charge_type === "flat") delta = rule.amount;
      else if (rule.charge_type === "discount_flat") delta = -rule.amount;
      else if (rule.charge_type === "percentage") delta = (previewBase * rule.amount) / 100;
      else if (rule.charge_type === "discount_percentage") delta = -(previewBase * rule.amount) / 100;
      running += delta;
      steps.push({ label: rule.name, delta, runningTotal: running });
    }
    return { steps, total: running };
  }, [applicableRules, previewBase]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pricing Rules</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Internal charges and discounts applied on top of a base rate. Not visible to
            customers — used by staff to quote accurately and consistently.
          </p>
        </div>
        {canManage && (
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit pricing rule" : "Add pricing rule"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="col-span-2">
                  <Label htmlFor="name">Rule name</Label>
                  <Input
                    id="name"
                    value={form.name ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. After-hours delivery fee"
                  />
                </div>
                <div>
                  <Label>Applies to</Label>
                  <Select
                    value={form.service_type ?? "all"}
                    onValueChange={(v) => setForm((f) => ({ ...f, service_type: v as PricingServiceType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(serviceTypeLabel) as PricingServiceType[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {serviceTypeLabel[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={form.charge_type ?? "flat"}
                    onValueChange={(v) => setForm((f) => ({ ...f, charge_type: v as PricingChargeType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(chargeTypeLabel) as PricingChargeType[]).map((c) => (
                        <SelectItem key={c} value={c}>
                          {chargeTypeLabel[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
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
                  <Label htmlFor="sort_order">Order applied</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={form.sort_order ?? 0}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description / when it applies</Label>
                  <Textarea
                    id="description"
                    value={form.description ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="e.g. Applied when vehicle is delivered outside office hours (8am–5pm)"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Switch
                    checked={form.is_active ?? true}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : "Save rule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Calculation preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-4 w-4" />
            Price calculator preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <Label>Service type</Label>
              <Select value={previewService} onValueChange={(v) => setPreviewService(v as PricingServiceType)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(serviceTypeLabel) as PricingServiceType[])
                    .filter((s) => s !== "all")
                    .map((s) => (
                      <SelectItem key={s} value={s}>
                        {serviceTypeLabel[s]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Base rate ($)</Label>
              <Input
                type="number"
                className="w-32"
                value={previewBase}
                onChange={(e) => setPreviewBase(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Base rate</span>
              <span>${previewBase.toFixed(2)}</span>
            </div>
            {calculation.steps.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No active rules apply to this service type — total is just the base rate.
              </p>
            )}
            {calculation.steps.map((step, i) => (
              <div key={i} className="flex justify-between text-muted-foreground">
                <span>{step.label}</span>
                <span className={step.delta < 0 ? "text-emerald-600" : ""}>
                  {step.delta >= 0 ? "+" : ""}
                  {step.delta.toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
              <span>Estimated total</span>
              <span>${calculation.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rules table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Applies to</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Active</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
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
            {!loading && rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No pricing rules yet — add your first rule to get started.
                </TableCell>
              </TableRow>
            )}
            {rules.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium">{r.name}</div>
                  {r.description && (
                    <div className="text-xs text-muted-foreground">{r.description}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{serviceTypeLabel[r.service_type]}</Badge>
                </TableCell>
                <TableCell
                  className={
                    r.charge_type.startsWith("discount") ? "font-medium text-emerald-600" : "font-medium"
                  }
                >
                  {formatAmount(r)}
                </TableCell>
                <TableCell>
                  {canManage ? (
                    <Switch
                      checked={r.is_active}
                      onCheckedChange={(v) => handleToggleActive(r, v)}
                    />
                  ) : (
                    <Badge variant={r.is_active ? "default" : "outline"}>
                      {r.is_active ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
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
                          <AlertDialogTitle>Delete "{r.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This rule will no longer be applied in the price calculator.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(r)}>
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
          Adding, editing, and deleting pricing rules is restricted to managers and admins.
        </p>
      )}
    </div>
  );
}
