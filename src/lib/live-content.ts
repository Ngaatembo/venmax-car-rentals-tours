import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  vehicles as staticVehicles,
  tours as staticTours,
  services as staticServices,
  faqs as staticFaqs,
  testimonials as staticTestimonials,
  type Vehicle,
  type Tour,
  type Service,
} from "@/data/venmax";

const staticVehicleImages = new Map(staticVehicles.map((v) => [v.slug, v.image]));
const staticTourImages = new Map(staticTours.map((t) => [t.slug, t.image]));

type FleetState = { vehicles: Vehicle[]; loaded: boolean };

/**
 * Live fleet from the vehicles table (single source of truth — vehicles added in
 * the admin panel appear automatically). The code-defined list is only an offline
 * fallback until the database responds. `loaded` is true once the DB answered with rows.
 */
export function useFleet(): FleetState {
  const [state, setState] = useState<FleetState>({ vehicles: staticVehicles, loaded: false });

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("vehicles")
      .select("*")
      .eq("is_active", true)
      .neq("status", "inactive")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        setState({
          loaded: true,
          vehicles: data.map((v) => {
            const fallback = staticVehicles.find((sv) => sv.slug === v.slug);
            const features: string[] = v.features ?? [];
            return {
              // Code-only extras (bags/badge) for the original vehicles; DB values win below.
              ...(fallback ?? {}),
              slug: v.slug,
              name: v.name,
              category: v.category,
              priceLabel: v.price_label,
              deposit: v.deposit,
              description: v.description,
              image: v.image_url || fallback?.image || staticVehicles[0]!.image,
              seats: v.seats ?? fallback?.seats,
              transmission: v.transmission ?? fallback?.transmission,
              fuelType: v.fuel_type ?? undefined,
              ac: features.some((f) => /^(a\/c|air ?con)/i.test(f)) || fallback?.ac,
              features: features.filter((f) => !/^(a\/c|air ?con)/i.test(f)),
              status: v.status,
              isFeatured: Boolean(v.is_featured),
            } satisfies Vehicle;
          }),
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function useVehicles(): Vehicle[] {
  return useFleet().vehicles;
}

export function useTours(): Tour[] {
  const [tours, setTours] = useState<Tour[]>(staticTours);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("tours")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        setTours(
          data.map((t) => ({
            slug: t.slug,
            name: t.name,
            description: t.description,
            image: t.image_url || staticTourImages.get(t.slug) || staticTours[0]!.image,
          })),
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return tours;
}

// Site content is a simple admin-editable key/value store (see /admin/content).
// Returns a map of key -> value; missing keys are simply absent (callers should
// treat an absent or empty-string value as "not configured yet").
export function useSiteContent(): Record<string, string> {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_content")
      .select("key, value")
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const map: Record<string, string> = {};
        for (const row of data) map[row.key] = row.value ?? "";
        setContent(map);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}

export function useServices(): Service[] {
  const [services, setServices] = useState<Service[]>(staticServices);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        setServices(
          data.map((s) => ({
            slug: s.slug,
            name: s.name,
            description: s.description,
            icon: s.icon,
            whatsapp: s.whatsapp_message || "",
          })),
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return services;
}

export function useFaqs(): { question: string; answer: string }[] {
  const [faqs, setFaqs] = useState(staticFaqs);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("faqs")
      .select("question, answer")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        setFaqs(data);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return faqs;
}

export function useTestimonials(): { name: string; rating: number; quote: string }[] {
  const [testimonials, setTestimonials] = useState(staticTestimonials);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("testimonials")
      .select("customer_name, rating, quote")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data || data.length === 0) return;
        setTestimonials(data.map((t) => ({ name: t.customer_name, rating: t.rating, quote: t.quote })));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return testimonials;
}
