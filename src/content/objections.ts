import type { brand } from "../config/brand";

/**
 * Home page objection FAQ (V1.11). Plain answers, under 60 words each.
 * `claim` names the brand.ts claim an answer depends on; until it is confirmed the answer shows {{CONFIRM}}.
 */
export const objections: { q: string; a: string; claim?: keyof typeof brand.claims }[] = [
  {
    q: "How fast do you start?",
    a: "An engineer starts on the diagnosis as soon as your request and site access arrive.",
    claim: "faqStartTime",
  },
  {
    q: "Do you need my password?",
    a: "No. Create a separate WordPress admin account and SFTP or hosting panel access for us, then delete both when the job is done. Your own logins stay private.",
  },
  {
    q: "What if you cannot fix it?",
    a: "You get a written note of what we found, what we tried and what we recommend next.",
    claim: "faqCannotFix",
  },
  {
    q: "Will I lose content or orders?",
    a: "Very unlikely. A broken site is almost always a code or server fault, and your posts, pages and orders stay in the database. We take a full backup before changing anything.",
    claim: "fullBackup",
  },
  {
    q: "Do you work with my host?",
    a: "Yes, as long as the host gives SFTP or hosting panel access. That covers shared hosting, managed WordPress hosts and cloud servers.",
  },
  {
    q: "How do I pay?",
    a: "Payment methods and timing are agreed with your quote, before any work starts.",
    claim: "faqPayment",
  },
];
