"use server";

import { bookingSchema } from "./booking-schema";

export type BookingResult = { ok: true } | { ok: false; error: string };

export async function submitBooking(input: unknown): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Some details are missing or invalid. Check each step and try again." };
  // ponytail: nothing is delivered from here yet. The client hands the booking to the visitor's email app
  // (mailto brand.email, via /contact/thanks/) so no request is lost. Send parsed.data to the CRM or email provider here when one is chosen.
  return { ok: true };
}
