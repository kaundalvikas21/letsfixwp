"use server";

import { getGuide, getService } from "@/content";
import { sendConfirmationEmail, startHandoff, ticketIdFor, type Handoff } from "@/lib/booking";
import { type Enquiry, enquirySchema, type Ticket, ticketSchema } from "./booking-schema";

export type FieldErrors = Partial<Record<string, string>>;
export type TicketResult =
  | { ok: true; ticketId: string; duplicate: boolean; emailed: boolean; handoff: Handoff }
  | { ok: false; fieldErrors: FieldErrors };

const toFieldErrors = (issues: { path: PropertyKey[]; message: string }[]): FieldErrors =>
  Object.fromEntries(issues.map((i) => [String(i.path[0] ?? "form"), i.message]));

const summarize = (t: Ticket) =>
  [
    `Problem: ${t.other ? "Something else" : (getGuide(t.guide)?.title ?? getService(t.service)?.title ?? t.service)}`,
    ...(t.description ? [`Details: ${t.description}`] : []),
    `Site: ${t.siteUrl}${t.host ? ` (host: ${t.host})` : ""}`,
    `Access: ${t.access}`,
    `Contact: ${t.name}, ${t.email}${t.phone ? `, ${t.phone}` : ""} (prefers ${t.method})`,
  ].join("\n");

/** Validates the whole ticket again on the server (never trust the client), then hands off. */
export async function submitTicket(input: unknown): Promise<TicketResult> {
  const parsed = ticketSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) };
  const t = parsed.data;
  if (t.company) return { ok: true, ticketId: "T-0", duplicate: false, emailed: false, handoff: { kind: "none" } }; // honeypot

  const { ticketId, duplicate } = ticketIdFor(t.requestId);
  const base = { ticketId, service: t.service, name: t.name, email: t.email, phone: t.phone };
  // ponytail: tickets are not stored or delivered yet; the success screen offers a mailto handoff so none is lost.
  // Send `summarize(t)` to the CRM or email provider here when one is chosen.
  const { sent } = duplicate ? { sent: false } : await sendConfirmationEmail({ ...base, summary: summarize(t) });
  const handoff = duplicate ? ({ kind: "none" } as const) : await startHandoff(base);
  return { ok: true, ticketId, duplicate, emailed: sent, handoff };
}

export type EnquiryResult = { ok: true; ticketId: string } | { ok: false; fieldErrors: FieldErrors };

export async function submitEnquiry(input: unknown): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: toFieldErrors(parsed.error.issues) };
  const e: Enquiry = parsed.data;
  if (e.company) return { ok: true, ticketId: "E-0" };
  // ponytail: same as tickets: deliver `e` to the CRM or email provider here.
  return { ok: true, ticketId: ticketIdFor(e.requestId).ticketId.replace(/^T-/, "E-") };
}
