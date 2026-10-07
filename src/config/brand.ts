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
  name: "LetsFixWP",
  domain: SITE_URL,
  email: confirm("support email address", "{{CONFIRM support email}}"),
  accent: "#CC3333",
  currency: confirm("currency: INR, USD or both", "INR" as "INR" | "USD" | "both"),
  gst: {
    registered: confirm("GST registration (true or false)", false),
    gstin: null as string | null,
  },
  legacy: {
    // Confirmed false by the owner on 2026-10-07: letsfixwp.com is a different business from fixmywp.com, which
    // is still live and trading. Nothing belonging to that company may appear here. The branch below is dead as
    // a result and is kept only until the removal pass; do not flip this back without a written instruction.
    enabled: false,
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
} as const;
