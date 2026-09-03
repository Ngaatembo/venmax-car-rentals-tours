/**
 * Booking submission boundary.
 *
 * The public site talks to this module only. Today it validates the request
 * and returns a locally generated reference so the UX can be reviewed without
 * a backend. When Lovable Cloud is connected, replace the body of
 * `submitBookingRequest` with a server function that inserts into the
 * `bookings` table — no UI changes required.
 */

import { z } from "zod";

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
  void parsed; // forwarded to the backend once connected
  await new Promise((resolve) => setTimeout(resolve, 600));
  // TODO(lovable-cloud): insert into `bookings` table with status "pending".
  return {
    reference: `VM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: "pending",
  };
}

export const inquirySchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a contact number"),
  message: z.string().min(5, "Write a short message"),
});

export type InquiryRequest = z.infer<typeof inquirySchema>;

export async function submitInquiry(data: InquiryRequest): Promise<void> {
  inquirySchema.parse(data);
  await new Promise((resolve) => setTimeout(resolve, 400));
  // TODO(lovable-cloud): insert into `inquiries` table.
}
