import { SITE_URL } from "./sitemap";

/**
 * Brand config (docs/foundation.md, BRAND CONFIG).
 * `confirm(...)` marks a value the owner has not confirmed yet. Unconfirmed values work in dev and
 * local builds (with a loud warning from next.config.ts) and fail the build on a production deploy.
 * To confirm a value, replace `confirm("...", value)` with the plain value.
 */
type Unconfirmed<T> = { readonly unconfirmed: string; readonly value: T };
const confirm = <T>(what: string, value: T): Unconfirmed<T> => ({ unconfirmed: what, value });

/** LetsFixWP's own guarantee. Shown by the v3 manifesto card and /legal/guarantee/ once set. */
type Guarantee = { days: number; summary: string; placeholder?: true }; // placeholder: marked on the page

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
  // Promises the v3 home page makes (src/components/sections/v3/Hero.tsx and Security.tsx). Confirm each one the business stands
  // behind; for any that is not true, delete its words from the hero copy and from this list.
  claims: {
    sameDay: confirm("claim: a broken site is back online the same day (hero headline)", true),
    vetted: confirm("claim: every engineer is vetted", true),
    bookingMinutes: confirm("claim: booking a fix takes about two minutes", 2),
    fixedPrice: confirm("claim: fixes are fixed price, agreed before work starts", true),
    backupFirst: confirm("claim: a full backup is taken before any change", true),
    ownLogin: confirm("claim: we work through a login you create for us and never ask for your password", true),
    accessRemoved: confirm("claim: our access is removed when the work is done", true),
    checkTurnaround: confirm("claim: how long a free site check takes to come back", "two working days"),
  },
  // Live chat. The runtime switch is NEXT_PUBLIC_CHAT_PROVIDER (+ NEXT_PUBLIC_CHAT_ID); this entry exists so a
  // production deploy fails until the owner has actually chosen one, or confirmed there is none.
  chatProvider: confirm("chat provider: set NEXT_PUBLIC_CHAT_PROVIDER to crisp, intercom, tawk or chatwoot, or confirm none", process.env.NEXT_PUBLIC_CHAT_PROVIDER ?? null),
  // How a booked job is paid for or scheduled (src/lib/booking.ts). null = no provider yet, and the flow hands
  // the ticket over by email instead. "razorpay" | "stripe" | "cal" once the owner picks one.
  bookingProvider: confirm("booking handoff: Razorpay, Stripe, Cal.com or none", null as "razorpay" | "stripe" | "cal" | null),
  // PLACEHOLDER so the design can be reviewed: the card and /legal/guarantee/ show it with a visible "placeholder"
  // note, and a production deploy fails while it is wrapped in confirm(). Replace with the plain value once decided:
  // { days, summary } to publish LetsFixWP's real guarantee, or null for none.
  // Never the old business's guarantee in legacyFacts below: it is not this company's promise.
  guarantee: confirm("guarantee: LetsFixWP's own guarantee (days and a one-sentence summary), or null for none", { days: 14, summary: "Placeholder: one sentence on what the guarantee covers and how to claim it.", placeholder: true } as Guarantee | null),
  // The home page's "What we don't do" section (src/components/sections/v3/Boundaries.tsx), whose four lines live
  // in src/content/notices.ts. One gate for the section, not one per line: the owner edits the words there and
  // confirms here that the four limits are true of this business. false removes the section. fixed.net's own list
  // (no custom development, no web design, no new sites) cannot be reused: src/config/sitemap.ts sells all three.
  boundaries: confirm("the four things LetsFixWP does not do (see boundaries in src/content/notices.ts)", true),
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
  chatProvider: v(input.chatProvider),
  bookingProvider: v(input.bookingProvider),
  guarantee: v(input.guarantee),
  boundaries: v(input.boundaries),
  claims: {
    sameDay: v(input.claims.sameDay),
    vetted: v(input.claims.vetted),
    bookingMinutes: v(input.claims.bookingMinutes),
    fixedPrice: v(input.claims.fixedPrice),
    backupFirst: v(input.claims.backupFirst),
    ownLogin: v(input.claims.ownLogin),
    accessRemoved: v(input.claims.accessRemoved),
    checkTurnaround: v(input.claims.checkTurnaround),
  },
  legacy: { enabled: legacyEnabled, facts: legacyEnabled ? legacyFacts : null },
} as const;
