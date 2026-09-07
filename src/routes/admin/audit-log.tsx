import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Search, ChevronDown, ChevronRight, History } from "lucide-react";
import { listAuditLog, type DbAuditLogEntry, type AuditAction } from "@/lib/admin-data";

const moduleLabel: Record<string, string> = {
  bookings: "Bookings",
  customers: "Customers",
  drivers: "Drivers",
  vehicles: "Fleet",
  payments: "Payments",
  pricing_rules: "Pricing",
  user_roles: "Staff / roles",
};

function actionVariant(action: AuditAction): "default" | "secondary" | "destructive" {
  if (action === "created") return "default";
  if (action === "deleted") return "destructive";
  return "secondary";
}

// Diffs old vs new for an "updated" entry — only the fields that actually
// changed, so staff aren't scanning an entire unchanged record.
function diffFields(oldVal: Record<string, unknown> | null, newVal: Record<string, unknown> | null) {
  if (!oldVal || !newVal) return [];
  const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
  const changes: { field: string; from: unknown; to: unknown }[] = [];
  for (const key of keys) {
    if (key === "updated_at" || key === "created_at") continue;
    const a = oldVal[key];
    const b = newVal[key];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changes.push({ field: key, from: a, to: b });
    }
  }
  return changes;
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

export const Route = createFileRoute("/admin/audit-log")({
  component: AdminAuditLog,
});

function AdminAuditLog() {
  const [entries, setEntries] = useState<DbAuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  async function refresh() {
    setLoading(true);
    try {
      setEntries(await listAuditLog());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      if (moduleFilter !== "all" && e.module !== moduleFilter) return false;
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (
        q &&
        !(e.record_label ?? "").toLowerCase().includes(q) &&
        !(e.actor_email ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [entries, search, moduleFilter, actionFilter]);

  const availableModules = Array.from(new Set(entries.map((e) => e.module)));

  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
        <History className="h-5 w-5" />
        Audit Log
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A permanent, system-generated record of every change to bookings, customers, drivers,
        fleet, payments, pricing, and staff access. This log cannot be edited or deleted by
        anyone through the app — including admins — so it stays trustworthy.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search record or staff email…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modules</SelectItem>
            {availableModules.map((m) => (
              <SelectItem key={m} value={m}>
                {moduleLabel[m] ?? m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="updated">Updated</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>When</TableHead>
              <TableHead>Staff member</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Record</TableHead>
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
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {entries.length === 0
                    ? "No activity recorded yet — changes will appear here as they happen."
                    : "No entries match your filters."}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((e) => {
              const changes = e.action === "updated" ? diffFields(e.old_value, e.new_value) : [];
              const isOpen = expanded.has(e.id);
              const canExpand = e.action === "updated" ? changes.length > 0 : !!(e.old_value || e.new_value);
              return (
                <Fragment key={e.id}>
                  <TableRow
                    className={canExpand ? "cursor-pointer" : ""}
                    onClick={() => canExpand && toggleExpanded(e.id)}
                  >
                    <TableCell>
                      {canExpand &&
                        (isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        ))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {format(parseISO(e.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-sm">{e.actor_email ?? "System"}</TableCell>
                    <TableCell>
                      <Badge variant={actionVariant(e.action)} className="capitalize">
                        {e.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{moduleLabel[e.module] ?? e.module}</TableCell>
                    <TableCell className="text-sm font-medium">{e.record_label || "—"}</TableCell>
                  </TableRow>
                  {isOpen && canExpand && (
                    <TableRow key={`${e.id}-detail`}>
                      <TableCell colSpan={6} className="bg-muted/30">
                        {e.action === "updated" ? (
                          <div className="space-y-1 py-2 text-xs">
                            {changes.map((c) => (
                              <div key={c.field} className="flex flex-wrap gap-2">
                                <span className="font-mono text-muted-foreground">{c.field}:</span>
                                <span className="text-destructive line-through">
                                  {formatValue(c.from)}
                                </span>
                                <span>→</span>
                                <span className="font-medium text-emerald-600">
                                  {formatValue(c.to)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <pre className="max-h-48 overflow-y-auto py-2 text-xs text-muted-foreground">
                            {JSON.stringify(e.new_value ?? e.old_value, null, 2)}
                          </pre>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
