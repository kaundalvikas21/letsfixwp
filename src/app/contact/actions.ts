"use server";

import { buildHandoff, type Handoff } from "@/lib/booking";
import {
  ACCESS_LABEL,
  BUDGET_LABEL,
  bookingSchema,
  CONTACT_LABEL,
  TIMELINE_LABEL,
  type budgets,
  type timelines,
} from "./booking-schema";

export type BookingResult =
  | { ok: true; handoff: Handoff }
  | { ok: false; error: string; fieldErrors: Record<string, string> };

/**
 * A Server Action is a public endpoint, so it re-parses with the same schema the client used
 * (ui-ux-pro-max nextjs "Validate Server Action input"). The client never decides what is valid.
 */
export async function submitBooking(input: unknown, serviceTitle = ""): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Some details are missing or invalid. Check the screens above and try again.", fieldErrors };
  }

  const b = parsed.data;
  // ponytail: nothing is delivered from here yet. The handoff adapter in src/lib/booking.ts hands the
  // request to the visitor's email client so no request is lost. Swap the adapter for Razorpay,
  // Stripe or Cal.com once the owner has an account, and send b to the CRM here at the same time.
  return {
    ok: true,
    handoff: buildHandoff({
      type: b.type,
      service: b.service,
      serviceTitle,
      guide: b.guide,
      description: b.description,
      siteUrl: b.siteUrl,
      host: b.host,
      access: ACCESS_LABEL[b.access],
      name: b.name,
      email: b.email,
      phone: b.phone,
      contactMethod: CONTACT_LABEL[b.contactMethod],
      budget: BUDGET_LABEL[b.budget as (typeof budgets)[number]] ?? b.budget,
      timeline: TIMELINE_LABEL[b.timeline as (typeof timelines)[number]] ?? b.timeline,
    }),
  };
}
