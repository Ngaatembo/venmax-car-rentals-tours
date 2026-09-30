/**
 * Admin panel permissions — one place for what each role may see and do in the UI.
 *
 * The database is the real gatekeeper: every table and storage bucket has RLS
 * policies that enforce the same model (see the `four_role_model_*` migrations).
 * This file only decides what the panel shows, so the UI never offers an action the
 * database will refuse, and so unauthorised pages never mount (and never load data).
 *
 * Internal role values never change: `admin` is shown to people as "Owner".
 */
import { createContext, useContext } from "react";
import type { AppRole } from "./admin-auth";

export const ALL_ROLES: AppRole[] = ["admin", "manager", "staff", "developer"];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Owner",
  manager: "Manager",
  staff: "Staff",
  developer: "Developer",
};

export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  admin: "Owner — full control, including staff and roles",
  manager: "Manager — bookings, customers, payments, documents, fleet, tours and website",
  staff: "Staff — bookings, customers, drivers and inquiries",
  developer: "Developer — fleet, tours and website content only (no customer or business data)",
};

export function roleLabel(role: AppRole | null | undefined): string {
  return role ? (ROLE_LABELS[role] ?? role) : "";
}

export function isKnownRole(role: unknown): role is AppRole {
  return typeof role === "string" && (ALL_ROLES as string[]).includes(role);
}

const OPERATIONS: AppRole[] = ["admin", "manager", "staff"];
const MANAGEMENT: AppRole[] = ["admin", "manager"];
const SITE: AppRole[] = ["admin", "manager", "developer"];
const OWNER: AppRole[] = ["admin"];

/** Which roles may open each admin section. Mirrors the RLS policies. */
export const ADMIN_SECTION_ACCESS: Record<string, AppRole[]> = {
  "/admin": OPERATIONS,
  "/admin/bookings": OPERATIONS,
  "/admin/customers": OPERATIONS,
  "/admin/drivers": OPERATIONS,
  "/admin/inquiries": OPERATIONS,
  "/admin/payments": MANAGEMENT,
  "/admin/pricing": MANAGEMENT,
  "/admin/documents": MANAGEMENT,
  "/admin/reports": MANAGEMENT,
  // Staff can look at the fleet and tours (read-only); editing is site management.
  "/admin/fleet": [...SITE, "staff"],
  "/admin/tours": [...SITE, "staff"],
  "/admin/content": SITE,
  "/admin/audit-log": OWNER,
  "/admin/staff": OWNER,
};

/** Roles allowed on a path, by longest matching section. Unknown admin paths: Owner only. */
export function allowedRolesForPath(pathname: string): AppRole[] {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/admin") return OPERATIONS;
  const match = Object.keys(ADMIN_SECTION_ACCESS)
    .filter((key) => key !== "/admin" && (path === key || path.startsWith(`${key}/`)))
    .sort((a, b) => b.length - a.length)[0];
  return (match && ADMIN_SECTION_ACCESS[match]) || OWNER;
}

export function canAccessPath(role: AppRole, pathname: string): boolean {
  return allowedRolesForPath(pathname).includes(role);
}

/** Where each role lands after signing in (Developer has no dashboard). */
export function homePathForRole(role: AppRole): string {
  return role === "developer" ? "/admin/fleet" : "/admin";
}

/** Action-level permissions, matching what RLS allows. */
export const can = {
  /** Add/edit vehicles, tours, site content, FAQs, services, reviews; upload website media. */
  manageSite: (role: AppRole | null | undefined) => !!role && SITE.includes(role),
  /** Delete vehicles, tours, FAQs, services, reviews (RLS: Owner only). */
  deleteSiteItems: (role: AppRole | null | undefined) => role === "admin",
  /** See/edit customer passport and national ID numbers and private documents. */
  seeCustomerIdentity: (role: AppRole | null | undefined) => !!role && MANAGEMENT.includes(role),
  /** View and record payments. */
  managePayments: (role: AppRole | null | undefined) => !!role && MANAGEMENT.includes(role),
  /** Delete customers, drivers and documents. */
  deleteOperationalRecords: (role: AppRole | null | undefined) => !!role && MANAGEMENT.includes(role),
  /** Add staff, change roles, remove access. */
  manageStaff: (role: AppRole | null | undefined) => role === "admin",
  /** Receive the live "new booking" alert (needs booking read access). */
  receiveBookingAlerts: (role: AppRole | null | undefined) => !!role && OPERATIONS.includes(role),
};

/** The signed-in person's role, provided by the admin layout once it has loaded. */
export const AdminRoleContext = createContext<AppRole | null>(null);

export function useAdminRole(): AppRole | null {
  return useContext(AdminRoleContext);
}
