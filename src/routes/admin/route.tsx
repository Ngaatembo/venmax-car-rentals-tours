import { createFileRoute, Link, Navigate, Outlet, useMatches, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Car,
  MapPin,
  CalendarCheck,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  Users,
  Contact,
  IdCard,
  Wallet,
  Percent,
  History,
  FolderOpen,
  FileBarChart,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { useAdminSession, useMyRole, signOutAdmin, updateOwnPassword, MIN_PASSWORD_LENGTH } from "@/lib/admin-auth";
import { PasswordInput } from "@/components/ui/password-input";
import {
  AdminRoleContext,
  allowedRolesForPath,
  can,
  canAccessPath,
  homePathForRole,
  roleLabel,
} from "@/lib/admin-permissions";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { supabase } from "@/lib/supabase";
import { playNotificationChime } from "@/lib/notification-sound";
import logo from "@/assets/logo.jpg";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

// Each menu item is shown only to the roles listed for its section in
// admin-permissions.ts (explicit lists, not a rank). The same list guards the
// page itself, and RLS enforces it again in the database.
const navItems: { to: string; label: string; icon: typeof LayoutDashboard }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/fleet", label: "Fleet", icon: Car },
  { to: "/admin/tours", label: "Tours", icon: MapPin },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/customers", label: "Customers", icon: Contact },
  { to: "/admin/drivers", label: "Drivers", icon: IdCard },
  { to: "/admin/payments", label: "Payments", icon: Wallet },
  { to: "/admin/pricing", label: "Pricing", icon: Percent },
  { to: "/admin/documents", label: "Documents", icon: FolderOpen },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/content", label: "Site Content", icon: FileText },
  { to: "/admin/audit-log", label: "Audit Log", icon: History },
  { to: "/admin/staff", label: "Staff", icon: Users },
];

function NoAccess({ homePath }: { homePath: string }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-border bg-background p-8 text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
      <h1 className="mt-3 text-xl font-semibold text-foreground">No access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your role doesn't include this section. Ask the Owner if you need access.
      </p>
      <Link to={homePath} className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-2">
        Go back
      </Link>
    </div>
  );
}

function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setSaving(true);
    try {
      await updateOwnPassword(password);
      toast.success("Password updated");
      setOpen(false);
      setPassword("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
          <KeyRound className="h-4 w-4" />
          Change password
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="new-password">New password</Label>
            <PasswordInput
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <PasswordInput
              id="confirm-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Update password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminLayout() {
  const session = useAdminSession();
  const role = useMyRole(session);
  const navigate = useNavigate();
  const location = useLocation();
  // The page actually rendered by <Outlet />. During a navigation the address
  // changes before the next page has loaded, so access is checked against what's
  // on screen (and against the address) — an unauthorised page never mounts,
  // not even for a moment.
  const renderedPath = useMatches({ select: (matches) => matches[matches.length - 1]?.pathname });
  const onLoginPage = location.pathname === "/admin/login";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // New-booking notification: plays a chime + toast whenever a booking is
  // inserted while any admin page is open. Only subscribes for roles that can
  // read bookings (Owner/Manager/Staff) — matches the RLS read policy on
  // `bookings`; never for the Developer or a logged-out visitor.
  useEffect(() => {
    if (!can.receiveBookingAlerts(role)) return;
    const channel = supabase
      .channel("admin-new-bookings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          playNotificationChime();
          const name = (payload.new as { full_name?: string }).full_name ?? "A customer";
          const service = (payload.new as { service_type?: string }).service_type ?? "booking";
          toast.success(`New order from ${name}`, {
            description: service.replace("-", " "),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  // The login page renders itself, with no sidebar and no auth requirement.
  if (onLoginPage) {
    return <Outlet />;
  }

  // Still checking session
  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  // Not logged in — send to login
  if (session === null) {
    navigate({ to: "/admin/login" });
    return null;
  }

  // Logged in, but still checking whether this account actually holds a
  // role (a valid session alone — including anonymous sign-ins — is not
  // sufficient).
  if (role === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking permissions…
      </div>
    );
  }

  // Logged in, but no role assigned — do not render the dashboard. This is
  // also what happens immediately after an admin removes someone's access.
  if (role === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <p className="text-sm font-medium text-foreground">
          This account doesn't have admin panel access.
        </p>
        <button
          onClick={async () => {
            await signOutAdmin();
            navigate({ to: "/admin/login" });
          }}
          className="text-sm font-medium text-primary underline underline-offset-2"
        >
          Sign out
        </button>
      </div>
    );
  }

  const homePath = homePathForRole(role);

  // The Developer has no dashboard: send them to Fleet.
  if (location.pathname.replace(/\/+$/, "") === "/admin" && homePath !== "/admin") {
    return <Navigate to={homePath} replace />;
  }

  const allowedHere =
    canAccessPath(role, location.pathname) && canAccessPath(role, renderedPath ?? location.pathname);
  const visibleNavItems = navItems.filter((item) => allowedRolesForPath(item.to).includes(role));

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <nav className="flex-1 space-y-1 p-3">
        {visibleNavItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/admin" }}
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
            activeProps={{ className: "active" }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-border p-3 space-y-1">
        <ChangePasswordDialog />
        <button
          onClick={async () => {
            await signOutAdmin();
            navigate({ to: "/admin/login" });
          }}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
      <div className="border-t border-border px-4 py-3">
        <p className="text-[10px] leading-relaxed text-muted-foreground/70">
          Custom admin system built exclusively for
          <br />
          <span className="font-semibold text-muted-foreground">VenMax Car Rental & Tours</span>
          <br />
          Developed by WebAura
        </p>
      </div>
    </>
  );

  const currentLabel = visibleNavItems.find((item) =>
    item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to)
  )?.label;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <img src={logo} alt="VenMax Car Rental & Tours" className="h-7 w-auto" />
          {currentLabel && (
            <span className="text-sm font-medium text-muted-foreground">{currentLabel}</span>
          )}
        </div>
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          {/* Scrolls on short phone screens so Change password / Sign out are always reachable. */}
          <SheetContent side="right" className="flex w-64 flex-col overflow-y-auto p-0">
            <div className="border-b border-border px-5 py-4">
              <img src={logo} alt="VenMax Car Rental & Tours" className="h-8 w-auto" />
              <p className="mt-2 text-xs text-muted-foreground">{session.user.email}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {roleLabel(role)}
                </span>
                <button
                  onClick={async () => {
                    setMobileNavOpen(false);
                    await signOutAdmin();
                    navigate({ to: "/admin/login" });
                  }}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
            <NavLinks onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden w-60 flex-col border-r border-border bg-background md:flex">
          <div className="border-b border-border px-5 py-4">
            <img src={logo} alt="VenMax Car Rental & Tours" className="h-8 w-auto" />
            <p className="mt-2 text-xs text-muted-foreground">{session.user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {roleLabel(role)}
            </span>
          </div>
          <NavLinks />
        </aside>
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          {/* Unauthorised pages never mount, so they never request their data. */}
          <AdminRoleContext.Provider value={role}>
            {allowedHere ? <Outlet /> : <NoAccess homePath={homePath} />}
          </AdminRoleContext.Provider>
        </main>
      </div>
    </div>
  );
}
