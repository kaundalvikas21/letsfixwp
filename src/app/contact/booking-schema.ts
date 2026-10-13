import { z } from "zod";

export const requestTypes = ["fix", "project", "check"] as const;
export type RequestType = (typeof requestTypes)[number];

/** How the visitor will give us access. Passwords are never collected in this form. */
export const accessMethods = ["secure-link", "already-shared", "hosting-panel"] as const;
export const ACCESS_LABEL: Record<(typeof accessMethods)[number], string> = {
  "secure-link": "Send me a secure link after booking",
  "already-shared": "An engineer already has access",
  "hosting-panel": "I will add an admin user myself",
};

export const contactMethods = ["email", "phone"] as const;
export const CONTACT_LABEL: Record<(typeof contactMethods)[number], string> = {
  email: "Email",
  phone: "Phone",
};

export const budgets = ["under-50k", "50k-150k", "150k-500k", "over-500k", "not-sure"] as const;
export const BUDGET_LABEL: Record<(typeof budgets)[number], string> = {
  "under-50k": "Under 50,000",
  "50k-150k": "50,000 to 1,50,000",
  "150k-500k": "1,50,000 to 5,00,000",
  "over-500k": "Over 5,00,000",
  "not-sure": "Not sure yet",
};

export const timelines = ["asap", "this-month", "this-quarter", "planning"] as const;
export const TIMELINE_LABEL: Record<(typeof timelines)[number], string> = {
  asap: "As soon as possible",
  "this-month": "This month",
  "this-quarter": "This quarter",
  planning: "Still planning",
};

// Field names are part of the analytics and autofill contract. Do not rename silently.
export const bookingSchema = z
  .object({
    type: z.enum(requestTypes),
    service: z.string().trim().max(80),
    guide: z.string().trim().max(80),
    description: z.string().trim().max(2000),
    siteUrl: z
      .string()
      .trim()
      .min(1, "Enter your site address")
      .max(300)
      .regex(/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i, "Enter your site address, like example.com"),
    host: z.string().trim().max(80),
    access: z.enum(accessMethods),
    name: z.string().trim().min(1, "Enter your name").max(120),
    email: z.email("Enter a valid email address").max(254),
    phone: z.string().trim().max(40),
    contactMethod: z.enum(contactMethods),
    budget: z.string().trim().max(40),
    timeline: z.string().trim().max(40),
  })
  // A fix with no service picked needs words, otherwise there is nothing to triage.
  .superRefine((b, ctx) => {
    if (b.type !== "check" && !b.service && b.description.length < 10)
      ctx.addIssue({ code: "custom", path: ["description"], message: "Tell us what you see, in a sentence or two" });
    if (b.contactMethod === "phone" && !b.phone)
      ctx.addIssue({ code: "custom", path: ["phone"], message: "Add a phone number, or choose email instead" });
    if (b.type === "project") {
      if (!budgets.includes(b.budget as (typeof budgets)[number]))
        ctx.addIssue({ code: "custom", path: ["budget"], message: "Pick a budget range" });
      if (!timelines.includes(b.timeline as (typeof timelines)[number]))
        ctx.addIssue({ code: "custom", path: ["timeline"], message: "Pick a timeline" });
    }
  });

export type Booking = z.infer<typeof bookingSchema>;

/** The one site-address rule on the site. The hero field and the booking screen both parse with this. */
export const siteUrlField = bookingSchema.shape.siteUrl;

/**
 * "example.com" to "https://example.com". An existing http(s) scheme is left alone.
 * Parse with `siteUrlField` first: this only adds the scheme, it does not validate.
 */
export const normaliseSiteUrl = (raw: string) => {
  const v = raw.trim();
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

/**
 * Four named screens. Never "Step 1 of 4": contract rule 6 bans numbered step labels, and the
 * ui-ux-pro-max Progress Indicators row suggests exactly that, so the names carry the progress.
 */
const allScreens = [
  { id: "problem", label: "Problem", fields: ["service", "description", "budget", "timeline"] },
  { id: "site", label: "Your site", fields: ["siteUrl", "host", "access"] },
  { id: "contact", label: "Contact", fields: ["name", "email", "phone", "contactMethod"] },
  { id: "confirm", label: "Confirm", fields: [] },
] as const satisfies readonly { id: string; label: string; fields: readonly (keyof Booking)[] }[];

export type ScreenId = (typeof allScreens)[number]["id"];

/** A free site check skips the problem screen: the check itself is the service. */
export const screensFor = (type: RequestType) =>
  type === "check" ? allScreens.filter((s) => s.id !== "problem") : allScreens;

export const emptyBooking = (type: RequestType, initial: { service: string; guide: string; url: string }): Booking => ({
  type,
  service: initial.service,
  guide: initial.guide,
  description: "",
  siteUrl: initial.url,
  host: "",
  access: "secure-link",
  name: "",
  email: "",
  phone: "",
  contactMethod: "email",
  budget: "",
  timeline: "",
});

/** sessionStorage key for the in-progress booking, so Back and a reload never lose data. */
export const DRAFT_KEY = "booking-draft";
/** sessionStorage key for the prepared handoff handed to /contact/thanks/. */
export const HANDOFF_KEY = "booking-handoff";
