import { z } from "zod";

// Shared by the client screens and the Server Actions. Field names are part of the analytics and autofill
// contract: do not rename silently.

const siteUrl = z
  .string()
  .trim()
  .min(1, "Enter your site address")
  .max(300)
  .regex(/^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i, "Enter your site address, like example.com");

// Never collect passwords: free text that looks like a pasted credential is rejected.
const noSecrets = (t: string) => !/\b(pass(word)?|pwd)\s*[:=]/i.test(t);
const freeText = (max: number) =>
  z.string().trim().max(max).refine(noSecrets, "Please remove any password. We arrange access separately.");

export const ticketScreens = ["problem", "site", "contact", "confirm"] as const;
export type TicketScreen = (typeof ticketScreens)[number];

const ticketBase = z.object({
  service: z.string().trim().max(80), // empty when "Something else"
  guide: z.string().trim().max(80),
  other: z.boolean(),
  description: freeText(2000),
  siteUrl,
  host: freeText(120),
  access: z.enum(["secure-link", "temp-admin", "on-call"]),
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.email("Enter a valid email address").max(254),
  phone: z.string().trim().max(40),
  method: z.enum(["email", "phone", "whatsapp"]),
  requestId: z.uuid(), // double-submit guard
  company: z.string().max(200), // honeypot: real people leave it empty; the server drops filled ones
});

type Base = z.infer<typeof ticketBase>;
type Ctx = z.RefinementCtx;
const problemRule = (t: Pick<Base, "service" | "other" | "description">, ctx: Ctx) => {
  if (!t.other && !t.service) ctx.addIssue({ code: "custom", path: ["service"], message: "Pick the closest problem, or choose Something else" });
  if (t.other && t.description.length < 5) ctx.addIssue({ code: "custom", path: ["description"], message: "Describe what you see in a few words" });
};
const contactRule = (t: Pick<Base, "method" | "phone">, ctx: Ctx) => {
  if (t.method !== "email" && !t.phone) ctx.addIssue({ code: "custom", path: ["phone"], message: "Add a phone number for a call or WhatsApp" });
};

/** Full ticket, validated by the Server Action. */
export const ticketSchema = ticketBase.superRefine((t, ctx) => {
  problemRule(t, ctx);
  contactRule(t, ctx);
});
export type Ticket = z.infer<typeof ticketSchema>;

/** Per-screen schemas for the client: each screen validates only its own fields and cross-field rules. */
export const screenSchemas = {
  problem: ticketBase.pick({ service: true, guide: true, other: true, description: true }).superRefine(problemRule),
  site: ticketBase.pick({ siteUrl: true, host: true, access: true }),
  contact: ticketBase.pick({ name: true, email: true, phone: true, method: true }).superRefine(contactRule),
  confirm: z.object({}),
} satisfies Record<TicketScreen, z.ZodType>;

export const enquirySchema = z.object({
  service: z.string().trim().min(1, "Pick what you need").max(80),
  budget: z.string().trim().min(1, "Pick a budget range").max(60),
  timeline: z.string().trim().min(1, "Pick a timeline").max(60),
  details: freeText(2000),
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.email("Enter a valid email address").max(254),
  phone: z.string().trim().max(40),
  requestId: z.uuid(),
  company: z.string().max(200),
});

export type Enquiry = z.infer<typeof enquirySchema>;

/** sessionStorage key for the legacy /contact/thanks/ handoff. */
export const HANDOFF_KEY = "booking-handoff";
