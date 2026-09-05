import { supabase } from "./supabase";

export type DbVehicle = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price_label: string;
  deposit: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type DbTour = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type DbBooking = {
  id: string;
  reference: string;
  service_type: string;
  vehicle_slug: string | null;
  tour_slug: string | null;
  start_date: string;
  end_date: string;
  full_name: string;
  email: string;
  phone: string;
  pickup_location: string;
  notes: string | null;
  status: string;
  created_at: string;
};

export type DbInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
};

export type DbSiteContent = {
  key: string;
  value: string;
};

// ---------- Vehicles ----------
export async function listVehicles() {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as DbVehicle[];
}

export async function upsertVehicle(vehicle: Partial<DbVehicle> & { slug: string }) {
  const { data, error } = await supabase.from("vehicles").upsert(vehicle).select().single();
  if (error) throw error;
  return data as DbVehicle;
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Tours ----------
export async function listTours() {
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as DbTour[];
}

export async function upsertTour(tour: Partial<DbTour> & { slug: string }) {
  const { data, error } = await supabase.from("tours").upsert(tour).select().single();
  if (error) throw error;
  return data as DbTour;
}

export async function deleteTour(id: string) {
  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Bookings ----------
export async function listBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbBooking[];
}

export async function updateBookingStatus(id: string, status: string) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

// ---------- Inquiries ----------
export async function listInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbInquiry[];
}

export async function updateInquiryStatus(id: string, status: string) {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) throw error;
}

// ---------- Site content ----------
export async function listSiteContent() {
  const { data, error } = await supabase.from("site_content").select("*").order("key");
  if (error) throw error;
  return data as DbSiteContent[];
}

export async function setSiteContent(key: string, value: string) {
  const { error } = await supabase.from("site_content").upsert({ key, value });
  if (error) throw error;
}

// ---------- Media upload ----------
export async function uploadMedia(file: File, pathPrefix: string) {
  const ext = file.name.split(".").pop();
  const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("venmax-media").upload(path, file, {
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("venmax-media").getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Staff / roles ----------
// Note: role-based access is enforced server-side via Postgres RLS policies
// (has_role / has_min_role) — these calls are gated by the database, not
// just by hiding UI. See migration admin_list_staff_function.
export type AppRole = "admin" | "manager" | "staff";

export type StaffMember = {
  user_id: string;
  email: string;
  role: AppRole;
  assigned_at: string;
  last_sign_in_at: string | null;
  created_at: string;
};

export async function listStaff() {
  const { data, error } = await supabase.rpc("admin_list_staff");
  if (error) throw error;
  return data as StaffMember[];
}

export async function inviteStaff(email: string, role: AppRole) {
  const { data, error } = await supabase.functions.invoke("admin-invite-staff", {
    body: { email, role },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as { success: true; user_id: string; email: string; role: AppRole };
}

export async function updateStaffRole(userId: string, role: AppRole) {
  const { error } = await supabase.from("user_roles").update({ role }).eq("user_id", userId);
  if (error) throw error;
}

// Removing the user_roles row immediately revokes all admin-panel access —
// has_role()/has_min_role() both check this table, so this takes effect on
// their very next request, not just on their next login.
export async function removeStaffAccess(userId: string) {
  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
  if (error) throw error;
}
