import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Car,
  MapPin,
  CalendarCheck,
  MessageSquare,
  FileText,
  LogOut,
} from "lucide-react";
import { useAdminSession, useIsAdmin, signOutAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/fleet", label: "Fleet", icon: Car },
  { to: "/admin/tours", label: "Tours", icon: MapPin },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/content", label: "Site Content", icon: FileText },
] as const;

function AdminLayout() {
  const session = useAdminSession();
  const isAdmin = useIsAdmin(session);
  const navigate = useNavigate();
  const location = useLocation();
  const onLoginPage = location.pathname === "/admin/login";

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

  // Logged in, but still checking whether this account actually holds the
  // admin role (a valid session alone — including anonymous sign-ins — is
  // not sufficient).
  if (isAdmin === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking permissions…
      </div>
    );
  }

  // Logged in, but not an admin — do not render the dashboard.
  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <p className="text-sm font-medium text-foreground">
          This account doesn't have admin access.
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

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 flex-col border-r border-border bg-background md:flex">
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold text-foreground">VenMax Admin</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/admin" }}
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
        </aside>
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
