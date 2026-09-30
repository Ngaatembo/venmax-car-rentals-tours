import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const ALLOWED_ROLES = ["admin", "manager", "staff", "developer"];
const MIN_PASSWORD_LENGTH = 8;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function generateTempPassword(): string {
  // Readable-ish random password: e.g. "kx7m-qp2r-9vwz" — easy to read aloud
  // or type from a WhatsApp message, still high entropy (12 random alnum chars).
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/O/1/l/i to avoid confusion
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let raw = "";
  for (const b of bytes) raw += chars[b % chars.length];
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !userData?.user) return json({ error: "Not authenticated" }, 401);

    // Only admins may add staff (developers, managers and staff cannot).
    const { data: isAdmin, error: roleErr } = await callerClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (roleErr || !isAdmin) return json({ error: "Only admins can add staff" }, 403);

    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const role = String(body.role ?? "");
    const mode = String(body.mode ?? "password"); // "password" (default) or "email_invite"
    const suppliedPassword = typeof body.password === "string" ? body.password : "";

    if (!email || !email.includes("@")) return json({ error: "A valid email is required" }, 400);
    if (!ALLOWED_ROLES.includes(role)) return json({ error: "Invalid role" }, 400);
    if (mode !== "password" && mode !== "email_invite") return json({ error: "Invalid mode" }, 400);
    if (suppliedPassword && suppliedPassword.length < MIN_PASSWORD_LENGTH) {
      return json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    let newUserId: string;
    // Only returned when WE generated the password. A password the admin
    // typed themselves is never echoed back.
    let generatedPassword: string | null = null;

    if (mode === "email_invite") {
      const { data: inviteData, error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(email);
      if (inviteErr) return json({ error: inviteErr.message }, 400);
      newUserId = inviteData.user.id;
    } else {
      const password = suppliedPassword || (generatedPassword = generateTempPassword());
      const { data: createData, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createErr) return json({ error: createErr.message }, 400);
      newUserId = createData.user.id;
    }

    const { error: roleInsertErr } = await adminClient
      .from("user_roles")
      .insert({ user_id: newUserId, role });
    if (roleInsertErr) {
      // Don't leave an orphaned login with no role behind.
      await adminClient.auth.admin.deleteUser(newUserId);
      return json({ error: roleInsertErr.message }, 400);
    }

    return json({ success: true, user_id: newUserId, email, role, temp_password: generatedPassword });
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
