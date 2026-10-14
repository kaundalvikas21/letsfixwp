import { brand } from "../config/brand";
import { formatPrice } from "./pricing";

/** Option lists for the booking flow. Wording lives here, never in the form component. */

/**
 * How the visitor will give us access. There is no "type your password here" option on purpose:
 * this form never collects credentials, and the secure link is the default for that reason.
 */
export const accessMethods = [
  { value: "secure-link", label: "Send me a secure link after booking", help: "A one-time link to share hosting or admin access. Nothing sensitive goes through this form." },
  { value: "have-ready", label: "I already have access details ready", help: "We will ask for them over the secure link, not here." },
  { value: "need-help", label: "I am not sure what you need", help: "An engineer will tell you exactly which access is needed, and why." },
] as const;

export const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone call" },
] as const;

export const timelines = [
  { value: "asap", label: "As soon as possible" },
  { value: "month", label: "Within a month" },
  { value: "quarter", label: "Within three months" },
  { value: "exploring", label: "Just exploring" },
] as const;

/** Enquiry budget buckets, in the brand currency. These are the client's budget, not our prices. */
const currency = brand.currency === "USD" ? "USD" : "INR";
const bucket = (n: number) => formatPrice({ amount: n, currency });
const EDGES = currency === "USD" ? [1000, 5000, 15000] : [50000, 200000, 600000];

export const budgets = [
  { value: "under", label: `Under ${bucket(EDGES[0])}` },
  { value: "low", label: `${bucket(EDGES[0])} to ${bucket(EDGES[1])}` },
  { value: "mid", label: `${bucket(EDGES[1])} to ${bucket(EDGES[2])}` },
  { value: "high", label: `Over ${bucket(EDGES[2])}` },
  { value: "unsure", label: "Not sure yet" },
] as const;

export const accessValues = accessMethods.map((a) => a.value);
export const contactValues = contactMethods.map((c) => c.value);
export const timelineValues = timelines.map((t) => t.value);
export const budgetValues = budgets.map((b) => b.value);
