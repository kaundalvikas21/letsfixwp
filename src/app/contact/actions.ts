"use server";

import { bookingSchema, type BookingField } from "./booking-schema";

export type BookingResult = { ok: true; ref: string } | { ok: false; error: string; fieldErrors: Partial<Record<BookingField, string>> };

/** A short human reference the visitor can quote. Not a database id: nothing is stored yet. */
const makeRef = () => `LFW-${Date.now().toString(36).toUpperCase().slice(-6)}`;

/**
 * A Server Action is a public endpoint, so the whole payload is validated here with the same schema the client
 * uses. Field errors come back so the form can point at the field instead of showing one vague message.
 */
export async function submitBooking(input: unknown): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<BookingField, string>> = {};
    for (const issue of parsed.error.issues) {
      const f = issue.path[0] as BookingField;
      if (f && !fieldErrors[f]) fieldErrors[f] = issue.message;
    }
    return { ok: false, error: "Some details need a second look before this can be sent.", fieldErrors };
  }
  // ponytail: nothing is delivered from here yet. The confirm screen hands the ticket to the visitor's email app
  // (src/lib/booking.ts) so no request is lost. Send parsed.data to the CRM, inbox or provider here when one exists.
  return { ok: true, ref: makeRef() };
}
