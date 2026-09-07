import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus, ShieldOff, Copy, Check } from "lucide-react";
import {
  listStaff,
  inviteStaff,
  updateStaffRole,
  removeStaffAccess,
  type AppRole,
  type StaffMember,
} from "@/lib/admin-data";
import { useAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/staff")({
  component: AdminStaff,
});

const roleLabel: Record<AppRole, string> = {
  admin: "Admin (full access)",
  manager: "Manager",
  staff: "Staff",
};

function roleBadgeVariant(role: AppRole): "default" | "secondary" | "outline" {
  if (role === "admin") return "default";
  if (role === "manager") return "secondary";
  return "outline";
}

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AdminStaff() {
  const session = useAdminSession();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("staff");
  const [mode, setMode] = useState<"password" | "email_invite">("password");

  // Result of the most recent "password" mode add — shown once in a
  // dedicated dialog so the admin can copy it and share it with the person.
  const [resultOpen, setResultOpen] = useState(false);
  const [resultEmail, setResultEmail] = useState("");
  const [resultPassword, setResultPassword] = useState("");
  const [copied, setCopied] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setStaff(await listStaff());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleInvite() {
    if (!email.trim()) {
      toast.error("Enter an email address");
      return;
    }
    setInviting(true);
    try {
      const result = await inviteStaff(email.trim(), role, mode);
      if (mode === "password" && result.temp_password) {
        setResultEmail(result.email);
        setResultPassword(result.temp_password);
        setCopied(false);
        setResultOpen(true);
      } else {
        toast.success(`Invitation email sent to ${email.trim()}`);
      }
      setOpen(false);
      setEmail("");
      setRole("staff");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add staff member");
    } finally {
      setInviting(false);
    }
  }

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(resultPassword);
      setCopied(true);
      toast.success("Password copied");
    } catch {
      toast.error("Couldn't copy — select and copy it manually");
    }
  }

  async function handleRoleChange(userId: string, newRole: AppRole) {
    try {
      await updateStaffRole(userId, newRole);
      setStaff((prev) => prev.map((s) => (s.user_id === userId ? { ...s, role: newRole } : s)));
      toast.success("Role updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  }

  async function handleRemove(member: StaffMember) {
    try {
      await removeStaffAccess(member.user_id);
      setStaff((prev) => prev.filter((s) => s.user_id !== member.user_id));
      toast.success(`${member.email} no longer has admin panel access`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove access");
    }
  }

  const myUserId = session?.user.id;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl">Staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control who can access the admin panel and what they can do. Removing someone here
            blocks their access immediately — enforced by the database, not just hidden buttons.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-1.5 h-4 w-4" />
              Invite Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a staff member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>How should they get access?</Label>
                <Select value={mode} onValueChange={(v) => setMode(v as "password" | "email_invite")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="password">
                      Set a password now — share it with them yourself
                    </SelectItem>
                    <SelectItem value="email_invite">
                      Send them an email to set their own password
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-muted-foreground">
                  {mode === "password"
                    ? "No email needs to be sent — you'll get a one-time password to share with them directly (WhatsApp, in person, etc.)."
                    : "Requires email delivery to work — if invites aren't arriving, use the password option instead."}
                </p>
              </div>
              <div>
                <Label htmlFor="staff-email">Email address</Label>
                <Input
                  id="staff-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff — bookings, customers, inquiries</SelectItem>
                    <SelectItem value="manager">
                      Manager — staff access + fleet, tours, site content
                    </SelectItem>
                    <SelectItem value="admin">Admin — full access, including staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={inviting}>
                {inviting ? "Adding…" : mode === "password" ? "Create Account" : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* One-time display of a generated password (mode: "password") */}
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account created</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <p>
              Share these sign-in details with <span className="font-medium">{resultEmail}</span> — send
              them however you'd like (WhatsApp, in person, etc.). This password is shown only once.
            </p>
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-mono text-sm">{resultEmail}</p>
              <p className="mt-2 text-xs text-muted-foreground">Temporary password</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 font-mono text-lg font-semibold tracking-wide">{resultPassword}</p>
                <Button variant="outline" size="icon" onClick={copyPassword}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              They can sign in at venmax.co.zw/admin with this email and password right away, and should
              change it after their first login.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setResultOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Added</TableHead>
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
            {!loading && staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No staff yet.
                </TableCell>
              </TableRow>
            )}
            {staff.map((member) => {
              const isSelf = member.user_id === myUserId;
              return (
                <TableRow key={member.user_id}>
                  <TableCell className="font-medium">
                    {member.email}
                    {isSelf && (
                      <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isSelf ? (
                      <Badge variant={roleBadgeVariant(member.role)}>
                        {roleLabel[member.role]}
                      </Badge>
                    ) : (
                      <Select
                        value={member.role}
                        onValueChange={(v) => handleRoleChange(member.user_id, v as AppRole)}
                      >
                        <SelectTrigger className="h-8 w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(member.last_sign_in_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(member.assigned_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {!isSelf && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ShieldOff className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove {member.email}'s access?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will immediately prevent them from accessing the VenMax admin
                              panel. They can be re-invited later if needed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemove(member)}>
                              Remove Access
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
