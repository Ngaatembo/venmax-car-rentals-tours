/**
 * Admin-editable website settings (the `site_content` key/value table, edited in
 * /admin/content). Every value has a default equal to the confirmed wording, so the
 * site renders correctly before the database answers, if it can't be reached, or if
 * a field is left blank in the admin.
 *
 * One shared store: the table is fetched once per page load and every component that
 * calls useSiteSettings() re-renders when it arrives.
 */
import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

export const SETTING_DEFAULTS = {
  // Homepage hero
  hero_tagline: "Affordable car rental in Zimbabwe · Easy WhatsApp booking",
  hero_headline: "Reliable Car Rental in Zimbabwe, Made Simple.",
  hero_subtitle:
    "Choose your vehicle, send us a WhatsApp message and let our team help arrange your rental — whether you're in Zimbabwe or planning your trip from abroad.",

  // Contact details
  contact_address: "27 Lawson Avenue, Milton Park, Harare, Zimbabwe",
  contact_phone_primary: "+263 71 422 5314",
  contact_phone_secondary: "+263 78 047 5535",
  contact_whatsapp: "+263 71 422 5314",
  contact_email_sales: "sales@venmax.co.zw",
  contact_email_bookings: "",
  contact_hours: "Office hours 8am–5pm — WhatsApp messages answered anytime",

  // Stats shown on the homepage
  stat_google_rating: "4.9",
  stat_happy_clients: "1000+",
  vehicle_models_display: "40+",

  // Rates & policies
  chauffeur_fee_per_day: "20",
  chauffeur_client_covers: "The client covers the driver's food and accommodation.",
  airport_shuttle_fee: "30",
  mileage_free_km_per_day: "200",
  mileage_excess_per_km: "0.60",
  mileage_unlimited_from: "one month",
  delivery_note: "Free vehicle delivery within all Harare areas.",
  cancellation_refund_days: "3",
  payment_methods:
    "Cash\nMukuru\nWestern Union\nWorldRemit\nBank transfer\nEcoCash\nInnBucks\nOther applicable local payment arrangements",
  min_driver_age: "25",
  licence_years: "2",
  cross_border: "Cross-border travel is currently not offered.",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type SiteSettings = Record<SettingKey, string>;

type State = { settings: SiteSettings; raw: Record<string, string>; loaded: boolean };

const initialState: State = { settings: { ...SETTING_DEFAULTS }, raw: {}, loaded: false };
let state: State = initialState;
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function load() {
  if (inflight || typeof window === "undefined") return;
  inflight = (async () => {
    try {
      const { data, error } = await supabase.from("site_content").select("key, value");
      if (error || !data) return;
      const raw: Record<string, string> = {};
      for (const row of data as { key: string; value: string | null }[]) raw[row.key] = row.value ?? "";
      const settings = { ...SETTING_DEFAULTS } as SiteSettings;
      for (const key of Object.keys(SETTING_DEFAULTS) as SettingKey[]) {
        const value = raw[key]?.trim();
        if (value) settings[key] = value;
      }
      state = { settings, raw, loaded: true };
      listeners.forEach((l) => l());
    } catch {
      // Keep the defaults — the site still renders correctly.
    }
  })();
}

/** Re-fetch after the admin saves, so the admin's own preview reflects the change. */
export function refreshSiteSettings() {
  inflight = null;
  load();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
  return () => {
    listeners.delete(listener);
  };
}

function useSettingsState(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initialState,
  );
}

export function useSiteSettings(): SiteSettings {
  return useSettingsState().settings;
}

/** Raw key/value map (for keys that aren't typed settings, e.g. social_showcase_1). */
export function useRawSiteContent(): Record<string, string> {
  return useSettingsState().raw;
}

/** Current settings outside React (e.g. whatsappLink). Defaults until loaded. */
export function getSiteSettings(): SiteSettings {
  return state.settings;
}

// ---------- Formatting helpers ----------

function numeric(value: string): number | null {
  const n = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** "20" → "20", "0.6" → "0.60", "12.5" → "12.50". Non-numbers are returned unchanged. */
export function formatMoney(value: string): string {
  const n = numeric(value);
  if (n === null) return value;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function whole(value: string, fallback: string): string {
  const n = numeric(value);
  return n === null ? fallback : String(Math.round(n));
}

export function whatsappNumber(s: SiteSettings): string {
  return s.contact_whatsapp.replace(/\D/g, "") || SETTING_DEFAULTS.contact_whatsapp.replace(/\D/g, "");
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/** Confirmed rental policies, phrased once so every page says the same thing. */
export function policies(s: SiteSettings) {
  const fee = formatMoney(s.chauffeur_fee_per_day);
  const shuttle = formatMoney(s.airport_shuttle_fee);
  const km = whole(s.mileage_free_km_per_day, "200");
  const excess = formatMoney(s.mileage_excess_per_km);
  const refundDays = whole(s.cancellation_refund_days, "3");
  const minAge = whole(s.min_driver_age, "25");
  const licenceYears = whole(s.licence_years, "2");
  const clientCovers = s.chauffeur_client_covers.trim();

  return {
    chauffeurFeeAmount: fee,
    chauffeurFee: `US$${fee}/day`,
    chauffeurClientCovers: clientCovers,
    chauffeurFeeNote: `Chauffeur service is available on any vehicle for an additional US$${fee}/day.${
      clientCovers ? ` ${clientCovers}` : ""
    }`,
    shuttleFeeAmount: shuttle,
    shuttlePerTrip: `$${shuttle} per trip`,
    freeKmAmount: km,
    freeKm: `${km} km`,
    excessRateAmount: excess,
    excessRate: `$${excess}`,
    standardMileage: `Standard rentals: ${km} km free mileage per day. Excess mileage: $${excess} per km.`,
    unlimitedFrom: s.mileage_unlimited_from,
    unlimitedSentence: `For rentals of ${s.mileage_unlimited_from} or more, unlimited mileage is available.`,
    deliveryNote: s.delivery_note,
    refundDays,
    refundSentence: `The full amount paid is refunded within ${refundDays} business working days.`,
    paymentMethods: s.payment_methods
      .split(/\r?\n|,/)
      .map((m) => m.trim())
      .filter(Boolean),
    minAge,
    licenceYears,
    crossBorder: s.cross_border,
  };
}

export type Policies = ReturnType<typeof policies>;

/**
 * Tokens that can be used inside FAQ answers (and other admin-written text) so the
 * wording follows the Rates & Policies settings automatically.
 */
export const TEXT_TOKENS: { token: string; describe: string; value: (p: Policies) => string }[] = [
  { token: "{chauffeur_fee}", describe: "Chauffeur fee, e.g. US$20/day", value: (p) => p.chauffeurFee },
  { token: "{shuttle_fee}", describe: "Airport shuttle price, e.g. $30", value: (p) => `$${p.shuttleFeeAmount}` },
  { token: "{free_km}", describe: "Free mileage per day, e.g. 200 km", value: (p) => p.freeKm },
  { token: "{excess_rate}", describe: "Excess mileage rate, e.g. $0.60", value: (p) => p.excessRate },
  { token: "{unlimited_from}", describe: "Unlimited mileage from, e.g. one month", value: (p) => p.unlimitedFrom },
  { token: "{refund_days}", describe: "Refund time in business days, e.g. 3", value: (p) => p.refundDays },
  { token: "{min_age}", describe: "Minimum self-drive age, e.g. 25", value: (p) => p.minAge },
  { token: "{licence_years}", describe: "Years licence must be held, e.g. 2", value: (p) => p.licenceYears },
  {
    token: "{payment_methods}",
    describe: "Payment methods list, e.g. Cash, Mukuru … and InnBucks",
    value: (p) =>
      p.paymentMethods.length > 1
        ? `${p.paymentMethods.slice(0, -1).join(", ")} and ${p.paymentMethods[p.paymentMethods.length - 1]}`
        : (p.paymentMethods[0] ?? ""),
  },
  { token: "{cross_border}", describe: "Cross-border travel sentence", value: (p) => p.crossBorder },
];

export function fillTokens(text: string, p: Policies): string {
  return TEXT_TOKENS.reduce((out, t) => out.split(t.token).join(t.value(p)), text);
}

/** Contact details as lists (blank fields are skipped). */
export function contactInfo(s: SiteSettings) {
  return {
    address: s.contact_address,
    phones: [s.contact_phone_primary, s.contact_phone_secondary].map((v) => v.trim()).filter(Boolean),
    emails: [s.contact_email_sales, s.contact_email_bookings].map((v) => v.trim()).filter(Boolean),
    hours: s.contact_hours,
  };
}
