/**
 * Booking submission boundary.
 *
 * The public site talks to this module only. Requests are inserted directly
 * into Supabase (`bookings` / `inquiries` tables), which the admin panel
 * reads from and manages.
 */

import { z } from "zod";
import { supabase } from "./supabase";

export const serviceTypes = [
  { value: "self-drive", label: "Self-Drive Car Rental" },
  { value: "chauffeur", label: "Chauffeur Service" },
  { value: "airport-transfer", label: "Airport Transfer" },
  { value: "shuttle", label: "Shuttle Service" },
  { value: "tour", label: "Tour / Travel Package" },
] as const;

export const bookingSchema = z.object({
  serviceType: z.string().min(1, "Select a service"),
  vehicleSlug: z.string().optional(),
  tourSlug: z.string().optional(),
  startDate: z.string().min(1, "Select a start date"),
  endDate: z.string().min(1, "Select an end date"),
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a contact number"),
  pickupLocation: z.string().min(2, "Where should we deliver the vehicle?"),
  notes: z.string().optional(),
});

export type BookingRequest = z.infer<typeof bookingSchema>;

export type BookingResult = {
  reference: string;
  status: "pending";
};

export async function submitBookingRequest(
  data: BookingRequest,
): Promise<BookingResult> {
  const parsed = bookingSchema.parse(data);
  const reference = `VM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { error } = await supabase.from("bookings").insert({
    reference,
    service_type: parsed.serviceType,
    vehicle_slug: parsed.vehicleSlug || null,
    tour_slug: parsed.tourSlug || null,
    start_date: parsed.startDate,
    end_date: parsed.endDate,
    full_name: parsed.fullName,
    email: parsed.email,
    phone: parsed.phone,
    pickup_location: parsed.pickupLocation,
    notes: parsed.notes || null,
    status: "pending",
  });
  if (error) throw error;

  return { reference, status: "pending" };
}

export const inquirySchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a contact number"),
  message: z.string().min(5, "Write a short message"),
});

export type InquiryRequest = z.infer<typeof inquirySchema>;

export async function submitInquiry(data: InquiryRequest): Promise<void> {
  const parsed = inquirySchema.parse(data);
  const { error } = await supabase.from("inquiries").insert({
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    message: parsed.message,
    status: "new",
  });
  if (error) throw error;
}
