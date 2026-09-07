import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
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
} from "lucide-react";
import { useAdminSession, useMyRole, signOutAdmin, type AppRole } from "@/lib/admin-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { playNotificationChime } from "@/lib/notification-sound";
import logo from "@/assets/logo.jpg";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

// `minRole` follows the same hierarchy as the database's has_min_role():
// admin > manager > staff. A nav item with no minRole is visible to anyone
// with any role at all (i.e. staff and up). This only controls what's
// *shown* — the real enforcement is the RLS policies on each table.
const navItems: { to: string; label: string; icon: typeof LayoutDashboard; minRole?: AppRole }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/fleet", label: "Fleet", icon: Car },
  { to: "/admin/tours", label: "Tours", icon: MapPin },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/customers", label: "Customers", icon: Contact },
  { to: "/admin/drivers", label: "Drivers", icon: IdCard },
  { to: "/admin/payments", label: "Payments", icon: Wallet, minRole: "staff" },
  { to: "/admin/pricing", label: "Pricing", icon: Percent, minRole: "staff" },
  { to: "/admin/documents", label: "Documents", icon: FolderOpen, minRole: "staff" },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart, minRole: "manager" },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/content", label: "Site Content", icon: FileText, minRole: "manager" },
  { to: "/admin/audit-log", label: "Audit Log", icon: History, minRole: "admin" },
  { to: "/admin/staff", label: "Staff", icon: Users, minRole: "admin" },
];

const roleRank: Record<AppRole, number> = { staff: 0, manager: 1, admin: 2 };

function canSeeNavItem(role: AppRole, minRole?: AppRole) {
  if (!minRole) return true;
  return roleRank[role] >= roleRank[minRole];
}

function AdminLayout() {
  const session = useAdminSession();
  const role = useMyRole(session);
  const navigate = useNavigate();
  const location = useLocation();
  const onLoginPage = location.pathname === "/admin/login";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // New-booking notification: plays a chime + toast whenever a booking is
  // inserted while any admin page is open. Only subscribes once the user
  // actually holds a role (staff/manager/admin) — matches the RLS read
  // policy on `bookings`, so it never subscribes for a logged-out visitor.
  useEffect(() => {
    if (!role) return;
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

  const visibleNavItems = navItems.filter((item) => canSeeNavItem(role, item.minRole));

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
      <div className="border-t border-border p-3">
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
          <SheetContent side="right" className="flex w-64 flex-col p-0">
            <div className="border-b border-border px-5 py-4">
              <img src={logo} alt="VenMax Car Rental & Tours" className="h-8 w-auto" />
              <p className="mt-2 text-xs text-muted-foreground">{session.user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {role}
              </span>
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
              {role}
            </span>
          </div>
          <NavLinks />
        </aside>
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
