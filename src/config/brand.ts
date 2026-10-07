import { SITE_URL } from "./sitemap";

/**
 * Brand config (docs/foundation.md, BRAND CONFIG).
 * `confirm(...)` marks a value the owner has not confirmed yet. Unconfirmed values work in dev and
 * local builds (with a loud warning from next.config.ts) and fail the build on a production deploy.
 * To confirm a value, replace `confirm("...", value)` with the plain value.
 */
type Unconfirmed<T> = { readonly unconfirmed: string; readonly value: T };
const confirm = <T>(what: string, value: T): Unconfirmed<T> => ({ unconfirmed: what, value });

const input = {
  name: confirm("final brand name", "fixmywp"),
  domain: SITE_URL,
  email: confirm("support email address", "{{CONFIRM support email}}"),
  accent: "#CC3333",
  currency: confirm("currency: INR, USD or both", "INR" as "INR" | "USD" | "both"),
  gst: {
    registered: confirm("GST registration (true or false)", false),
    gstin: null as string | null,
  },
  legacy: {
    // true only if letsfixwp.com replaces fixmywp.com for the same business.
    enabled: confirm("letsfixwp.com replaces fixmywp.com for the same business", false),
  },
  support: {
    // Shown when live chat status is unavailable (V1.7), e.g. "Mon to Sat, 9am to 7pm IST".
    hours: confirm("support desk hours", null as string | null),
  },
  // Service promises shown on the home page (V1.6). Set to true only once the business commits to them.
  claims: {
    fixedPrice: confirm("claim: fixed price agreed before work starts", false),
    fullBackup: confirm("claim: full backup taken before any change", false),
    credentialsDeleted: confirm("claim: client credentials deleted when the job ends", false),
    // V1.8 pricing
    quoteInMinutes: confirm("claim: emergency quotes are sent within minutes", false),
    mostBookedEmergency: confirm("claim: the emergency fix is the most booked service", false),
  },
};

const isUnconfirmed = (v: unknown): v is Unconfirmed<unknown> =>
  typeof v === "object" && v !== null && "unconfirmed" in v && "value" in v;

const collect = (o: Record<string, unknown>, out: string[] = []) => {
  for (const v of Object.values(o)) {
    if (isUnconfirmed(v)) out.push(v.unconfirmed);
    else if (v && typeof v === "object") collect(v as Record<string, unknown>, out);
  }
  return out;
};

/** Every value still waiting on the owner. next.config.ts reports these at build time. */
export const unconfirmedBrandFields = collect(input);

const v = <T>(x: T | Unconfirmed<T>): T => (isUnconfirmed(x) ? x.value : x);

/**
 * Facts that belong to the old fixmywp.com business. They render only when legacy.enabled is true
 * (docs/foundation.md): the guarantee, the hacked-site promise, the care plan free fix, the two
 * testimonials (src/content/testimonials.ts) and the old address.
 */
const legacyFacts = {
  guaranteeDays: 30,
  hackedPromise: "restored in a day or less",
  freeFixValue: "$150.00",
  address: {
    street: "2852 S. Willamette St. #272",
    locality: "Eugene",
    region: "OR",
    postalCode: "97405",
    country: "US",
  },
  hours: "Mon. to Fri. 8am to 6pm PST",
  oldDomain: "fixmywp.com",
} as const;

const legacyEnabled = v(input.legacy.enabled);

export const brand = {
  name: v(input.name),
  domain: input.domain,
  email: v(input.email),
  accent: input.accent,
  currency: v(input.currency),
  gst: { registered: v(input.gst.registered), gstin: input.gst.gstin },
  legacy: { enabled: legacyEnabled, facts: legacyEnabled ? legacyFacts : null },
  support: { hours: v(input.support.hours) },
  claims: {
    fixedPrice: v(input.claims.fixedPrice),
    fullBackup: v(input.claims.fullBackup),
    credentialsDeleted: v(input.claims.credentialsDeleted),
    quoteInMinutes: v(input.claims.quoteInMinutes),
    mostBookedEmergency: v(input.claims.mostBookedEmergency),
  },
} as const;
