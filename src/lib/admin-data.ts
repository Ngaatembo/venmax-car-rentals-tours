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
  customer_id: string | null;
  driver_id: string | null;
  total_amount: number | null;
  amount_paid: number | null;
  payment_status: string | null;
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

// ---------- Customers ----------
export type DbCustomer = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  license_number: string | null;
  license_expiry: string | null;
  id_number: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function listCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbCustomer[];
}

export async function upsertCustomer(customer: Partial<DbCustomer> & { full_name: string; phone: string }) {
  const { data, error } = await supabase.from("customers").upsert(customer).select().single();
  if (error) throw error;
  return data as DbCustomer;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}

// Bookings linked to a specific customer (via bookings.customer_id), most
// recent first. Used on the customer detail view.
export async function listBookingsForCustomer(customerId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbBooking[];
}

// ---------- Drivers ----------
export type DriverStatus = "available" | "assigned" | "on_trip" | "off_duty" | "suspended";

export type DbDriver = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  photo_url: string | null;
  license_number: string | null;
  license_expiry: string | null;
  id_number: string | null;
  assigned_vehicle_id: string | null;
  status: DriverStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function listDrivers() {
  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbDriver[];
}

export async function upsertDriver(driver: Partial<DbDriver> & { full_name: string; phone: string }) {
  const { data, error } = await supabase.from("drivers").upsert(driver).select().single();
  if (error) throw error;
  return data as DbDriver;
}

export async function deleteDriver(id: string) {
  const { error } = await supabase.from("drivers").delete().eq("id", id);
  if (error) throw error;
}

// Bookings currently assigned to a driver, most recent first — used on the
// driver profile to show current + past trips.
export async function listBookingsForDriver(driverId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("driver_id", driverId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbBooking[];
}

export async function assignDriverToBooking(bookingId: string, driverId: string | null) {
  const { error } = await supabase.from("bookings").update({ driver_id: driverId }).eq("id", bookingId);
  if (error) throw error;
}

// ---------- Payments ----------
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type DbPayment = {
  id: string;
  booking_id: string | null;
  customer_id: string | null;
  amount: number;
  method: string;
  reference: string | null;
  payment_date: string;
  status: PaymentStatus;
  notes: string | null;
  created_at: string;
};

export async function listPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("payment_date", { ascending: false });
  if (error) throw error;
  return data as DbPayment[];
}

export async function recordPayment(
  payment: Partial<DbPayment> & { amount: number; method: string }
) {
  const { data, error } = await supabase.from("payments").upsert(payment).select().single();
  if (error) throw error;
  return data as DbPayment;
}

export async function deletePayment(id: string) {
  const { error } = await supabase.from("payments").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Pricing rules ----------
export type PricingServiceType =
  | "all"
  | "self-drive"
  | "chauffeur"
  | "airport-transfer"
  | "shuttle"
  | "tour";

export type PricingChargeType = "flat" | "percentage" | "discount_flat" | "discount_percentage";

export type DbPricingRule = {
  id: string;
  name: string;
  service_type: PricingServiceType;
  charge_type: PricingChargeType;
  amount: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function listPricingRules() {
  const { data, error } = await supabase
    .from("pricing_rules")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as DbPricingRule[];
}

export async function upsertPricingRule(
  rule: Partial<DbPricingRule> & { name: string; charge_type: PricingChargeType; amount: number }
) {
  const { data, error } = await supabase.from("pricing_rules").upsert(rule).select().single();
  if (error) throw error;
  return data as DbPricingRule;
}

export async function deletePricingRule(id: string) {
  const { error } = await supabase.from("pricing_rules").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Audit log ----------
export type AuditAction = "created" | "updated" | "deleted";

export type DbAuditLogEntry = {
  id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  action: AuditAction;
  module: string;
  record_id: string | null;
  record_label: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
};

export async function listAuditLog(limit = 200) {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as DbAuditLogEntry[];
}

// ---------- Documents ----------
export type DocumentCategory =
  | "driver_license"
  | "vehicle_insurance"
  | "vehicle_registration"
  | "vehicle_other"
  | "company";

export type DbDocument = {
  id: string;
  category: DocumentCategory;
  driver_id: string | null;
  vehicle_id: string | null;
  title: string;
  file_url: string;
  file_name: string | null;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function listDocuments() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbDocument[];
}

export async function createDocument(
  doc: Partial<DbDocument> & { category: DocumentCategory; title: string; file_url: string }
) {
  const { data, error } = await supabase.from("documents").insert(doc).select().single();
  if (error) throw error;
  return data as DbDocument;
}

export async function updateDocument(id: string, updates: Partial<DbDocument>) {
  const { error } = await supabase.from("documents").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadDocumentFile(file: File) {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("venmax-documents").upload(path, file);
  if (error) throw error;
  return path; // stored path, not a public URL — this bucket is private
}

export async function getDocumentSignedUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("venmax-documents")
    .createSignedUrl(path, 60 * 5); // valid for 5 minutes
  if (error) throw error;
  return data.signedUrl;
}

// ---------- Website content: Services, FAQs, Testimonials ----------
export type ServiceIcon = "key" | "user" | "plane" | "users";

export type DbService = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: ServiceIcon;
  whatsapp_message: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function listServices() {
  const { data, error } = await supabase.from("services").select("*").order("sort_order");
  if (error) throw error;
  return data as DbService[];
}
export async function upsertService(s: Partial<DbService> & { slug: string; name: string }) {
  const { data, error } = await supabase.from("services").upsert(s).select().single();
  if (error) throw error;
  return data as DbService;
}
export async function deleteService(id: string) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export type DbFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

export async function listFaqs() {
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
  if (error) throw error;
  return data as DbFaq[];
}
export async function upsertFaq(f: Partial<DbFaq> & { question: string; answer: string }) {
  const { data, error } = await supabase.from("faqs").upsert(f).select().single();
  if (error) throw error;
  return data as DbFaq;
}
export async function deleteFaq(id: string) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

export type DbTestimonial = {
  id: string;
  customer_name: string;
  rating: number;
  quote: string;
  sort_order: number;
  is_active: boolean;
};

export async function listTestimonials() {
  const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
  if (error) throw error;
  return data as DbTestimonial[];
}
export async function upsertTestimonial(
  t: Partial<DbTestimonial> & { customer_name: string; rating: number; quote: string }
) {
  const { data, error } = await supabase.from("testimonials").upsert(t).select().single();
  if (error) throw error;
  return data as DbTestimonial;
}
export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
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

export async function inviteStaff(email: string, role: AppRole, mode: "password" | "email_invite" = "password") {
  const { data, error } = await supabase.functions.invoke("admin-invite-staff", {
    body: { email, role, mode },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as { success: true; user_id: string; email: string; role: AppRole; temp_password: string | null };
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
