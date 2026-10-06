import { z } from "zod";

export const requestTypes = ["fix", "project", "check"] as const;
export type RequestType = (typeof requestTypes)[number];

// Field names are part of the analytics and autofill contract. Do not rename silently.
export const bookingSchema = z.object({
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
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.email("Enter a valid email address").max(254),
  phone: z.string().trim().max(40),
});

export type Booking = z.infer<typeof bookingSchema>;

const allSteps = [
  { id: "service", label: "What you need", fields: ["service", "description"] },
  { id: "site", label: "Your site", fields: ["siteUrl"] },
  { id: "contact", label: "Contact", fields: ["name", "email", "phone"] },
  { id: "review", label: "Review", fields: [] },
] as const satisfies readonly { id: string; label: string; fields: readonly (keyof Booking)[] }[];

/** A free site check skips the service step: the check itself is the service. */
export const stepsFor = (type: RequestType) => (type === "check" ? allSteps.filter((s) => s.id !== "service") : allSteps);

/** sessionStorage key for the prepared email handed to /contact/thanks/. */
export const HANDOFF_KEY = "booking-handoff";
