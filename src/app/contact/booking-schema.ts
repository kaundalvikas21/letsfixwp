import { z } from "zod";
import { accessValues, budgetValues, contactValues, timelineValues } from "@/content/booking-options";

export const requestTypes = ["fix", "project", "check"] as const;
export type RequestType = (typeof requestTypes)[number];

// Field names are part of the analytics and autofill contract. Do not rename silently.
// One schema, shared by the client (per-screen validation) and the Server Action (whole payload).
export const bookingSchema = z
  .object({
    type: z.enum(requestTypes),
    service: z.string().trim().max(80),
    guide: z.string().trim().max(80),
    description: z.string().trim().max(2000),
    siteUrl: z.string().trim().max(300),
    host: z.string().trim().max(120),
    access: z.enum(accessValues as [string, ...string[]]),
    budget: z.string().trim().max(20),
    timeline: z.string().trim().max(20),
    name: z.string().trim().min(1, "Enter your name").max(120),
    email: z.email("Enter a valid email address").max(254),
    phone: z.string().trim().max(40),
    contactMethod: z.enum(contactValues as [string, ...string[]]),
  })
  .superRefine((b, ctx) => {
    const need = (path: keyof typeof b, message: string) => ctx.addIssue({ code: "custom", path: [path], message });

    // A site address is what we work on, so a fix and a check both need one. A project may not have a site yet.
    if (b.type !== "project") {
      if (!b.siteUrl) need("siteUrl", "Enter your site address");
      else if (!/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i.test(b.siteUrl)) need("siteUrl", "Enter your site address, like example.com");
    }
    // An emergency ticket needs to say what is wrong: either a chosen problem or a description.
    if (b.type === "fix" && !b.service && b.description.length < 10) need("description", "Tell us what the site is doing, in a sentence");
    if (b.type === "project") {
      if (!budgetValues.includes(b.budget as (typeof budgetValues)[number])) need("budget", "Pick a budget range");
      if (!timelineValues.includes(b.timeline as (typeof timelineValues)[number])) need("timeline", "Pick a timeline");
      if (b.description.length < 10) need("description", "Tell us what you need built, in a sentence");
    }
    // Asking to be called without a number is the most common dead end in this form.
    if (b.contactMethod === "phone" && !b.phone) need("phone", "Add a phone number, or choose email instead");
  });

export type Booking = z.infer<typeof bookingSchema>;
export type BookingField = keyof Booking;

/** Screens are named, never numbered: the progress bar shows where you are, not how much is left. */
export const SCREENS = {
  problem: { id: "problem", label: "Problem", fields: ["service", "description"] },
  project: { id: "project", label: "Project", fields: ["description", "budget", "timeline"] },
  site: { id: "site", label: "Your site", fields: ["siteUrl", "host", "access"] },
  contact: { id: "contact", label: "Contact", fields: ["name", "email", "phone", "contactMethod"] },
  confirm: { id: "confirm", label: "Confirm", fields: [] },
} as const satisfies Record<string, { id: string; label: string; fields: readonly BookingField[] }>;

export type Screen = (typeof SCREENS)[keyof typeof SCREENS];

export const screensFor = (type: RequestType): Screen[] =>
  type === "project"
    ? [SCREENS.project, SCREENS.contact, SCREENS.confirm]
    : type === "check"
      ? [SCREENS.site, SCREENS.contact, SCREENS.confirm]
      : [SCREENS.problem, SCREENS.site, SCREENS.contact, SCREENS.confirm];

export const emptyBooking = (type: RequestType, initial: Partial<Booking> = {}): Booking => ({
  type,
  service: "",
  guide: "",
  description: "",
  siteUrl: "",
  host: "",
  access: "secure-link",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  phone: "",
  contactMethod: "email",
  ...initial,
});

/** Validates one screen's fields only, so a visitor is never shown errors for a screen they have not reached. */
export function validateScreen(b: Booking, fields: readonly BookingField[]): Partial<Record<BookingField, string>> {
  const res = bookingSchema.safeParse(b);
  if (res.success) return {};
  const out: Partial<Record<BookingField, string>> = {};
  for (const issue of res.error.issues) {
    const f = issue.path[0] as BookingField;
    if (fields.includes(f) && !out[f]) out[f] = issue.message;
  }
  return out;
}

/** sessionStorage key: Back, a reload or a bumped tab must never lose what was typed. */
export const DRAFT_KEY = "booking-draft";
