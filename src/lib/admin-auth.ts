import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function useAdminSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // undefined = still loading, null = logged out, Session = logged in
  return session;
}

// A logged-in session is not enough — Supabase anonymous sign-ins also count
// as "authenticated". This checks the actual role via the has_role()
// security-definer function, so only accounts granted the admin role in
// user_roles can reach the dashboard.
export function useIsAdmin(session: Session | null | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (session === undefined) return; // still loading session
    if (session === null) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    setIsAdmin(undefined);
    supabase
      .rpc("has_role", { _user_id: session.user.id, _role: "admin" })
      .then(({ data, error }) => {
        if (cancelled) return;
        setIsAdmin(error ? false : Boolean(data));
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  // undefined = still checking, boolean = resolved
  return isAdmin;
}

export type AppRole = "admin" | "manager" | "staff" | "developer";

// Returns the signed-in user's own role (admin/manager/staff/developer), or null if
// they have no role assigned (blocked from the admin panel entirely). Used
// to gate navigation and page-level UI — the real enforcement still happens
// server-side via RLS, this only controls what's shown.
export function useMyRole(session: Session | null | undefined) {
  const [role, setRole] = useState<AppRole | null | undefined>(undefined);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      setRole(null);
      return;
    }
    let cancelled = false;
    setRole(undefined);
    supabase.rpc("my_role").then(({ data, error }) => {
      if (cancelled) return;
      setRole(error ? null : (data as AppRole | null));
    });
    return () => {
      cancelled = true;
    };
  }, [session]);

  return role;
}

export async function signInAdmin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}

export async function updateOwnPassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}
