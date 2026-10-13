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
  // Visible copy in the home hero. It promises a process (review, fixed-price quote, start on
  // approval) that the owner has not signed off on, so it fails a production build until they do.
  quoteFlow: confirm(
    "quoting flow: an engineer reviews the site, quotes a fixed price, work starts on approval",
    "A WordPress engineer reviews it, quotes a fixed price, and starts once you approve.",
  ),
  // Visible promises in the home fact strip. Each one fails a production build until the owner
  // signs off. A null value renders nothing at all (docs/section-contract.md rule 8), so the strip
  // shows only the facts that are true today and grows as they are confirmed.
  promises: {
    guaranteeDays: confirm(
      "guarantee period in days: LetsFixWP's own figure, NOT the 30 days fixmywp.com offers, or a decision not to offer one",
      null as number | null,
    ),
    // Set priceFrom on each tier in src/content/services/*.ts. Until something is priced, the home
    // pricing rows fall back to "On quote", which is only the quoteFlow promise restated.
    pricing: confirm("price-from figures for the pricing rows: set priceFrom in src/content/services/*.ts", null as null),
    // LetsFixWP's own included-fix value, if the care plan includes one at all. NOT the $150 figure
    // fixmywp.com advertises: that is a different company's offer and scripts/check-content.ts
    // fails the build on it. null renders nothing (contract rule 8).
    carePlanIncludedFix: confirm(
      "does the care plan include a free fix, and what is it worth? LetsFixWP's own figure, not fixmywp.com's",
      null as string | null,
    ),
    testimonials: confirm(
      "real client quotes with consent to publish: replace the placeholders in src/content/testimonials.ts and set confirmed: true",
      null as null,
    ),
    access: confirm(
      "how credentials are shared and removed",
      "Credentials come to us through a one-time link, and our access is removed once the work is signed off.",
    ),
    backupRetentionDays: confirm("how many days backup copies are kept", null as number | null),
    staging: confirm(
      "staging policy: risky work happens on a copy first",
      "Risky work happens on a staging copy, and goes live only once it has been checked.",
    ),
    reporting: confirm(
      "written report after every fix",
      "You get a written report of what broke, what changed, and what still needs attention.",
    ),
    unfixable: confirm(
      "what happens when a fix turns out to be bigger than the quote",
      "If the fix turns out to be bigger than the quote, we tell you before doing any more work and you can stop there.",
    ),
    hosts: confirm(
      "which hosts can be worked on",
      "Any host that gives us SFTP or SSH access to the files and the database.",
    ),
    payment: confirm(
      "when and how customers pay",
      "You approve the quote first, then we invoice. Nothing is charged before you approve.",
    ),
    checkDelivery: confirm(
      "free site check: what the visitor gets back and how long it takes",
      "A written summary by email, covering what is out of date, what is exposed and what is slowing the site down.",
    ),
    // Which provider closes the booking: "razorpay", "stripe", "calcom", or null for the email
    // handoff in src/lib/booking.ts. Each needs an account and keys before it can be switched on.
    bookingProvider: confirm(
      "how a booking is closed: Razorpay (UPI, cards, netbanking, GST invoices), Stripe Checkout, or Cal.com scheduling",
      null as string | null,
    ),
    // Sets NEXT_PUBLIC_CHAT_PROVIDER and NEXT_PUBLIC_CHAT_ID. Until one is chosen the launcher
    // falls back to its offline dialog, which still reaches an engineer.
    chatProvider: confirm("live chat provider: crisp, intercom, tawk or chatwoot", null as string | null),
    whoWorks: confirm(
      "who performs the work: a WordPress engineer named before work starts, not a rotating queue",
      "A WordPress engineer, named before work starts",
    ),
    whenStarts: confirm("when work starts: as soon as the quote is approved", "As soon as you approve the quote"),
    fixedPrice: confirm("fixed-price promise: the price is agreed before work starts", "agreed before work starts"),
    backupFirst: confirm("backup promise: a backup is taken before any change", "before any change"),
    specialistSince: confirm("year the business started taking WordPress work", null as number | null),
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
  quoteFlow: v(input.quoteFlow),
  promises: {
    guaranteeDays: v(input.promises.guaranteeDays),
    pricing: v(input.promises.pricing),
    carePlanIncludedFix: v(input.promises.carePlanIncludedFix),
    testimonials: v(input.promises.testimonials),
    access: v(input.promises.access),
    backupRetentionDays: v(input.promises.backupRetentionDays),
    staging: v(input.promises.staging),
    reporting: v(input.promises.reporting),
    unfixable: v(input.promises.unfixable),
    hosts: v(input.promises.hosts),
    payment: v(input.promises.payment),
    checkDelivery: v(input.promises.checkDelivery),
    bookingProvider: v(input.promises.bookingProvider),
    chatProvider: v(input.promises.chatProvider),
    whoWorks: v(input.promises.whoWorks),
    whenStarts: v(input.promises.whenStarts),
    fixedPrice: v(input.promises.fixedPrice),
    backupFirst: v(input.promises.backupFirst),
    specialistSince: v(input.promises.specialistSince),
  },
  currency: v(input.currency),
  gst: { registered: v(input.gst.registered), gstin: input.gst.gstin },
  legacy: { enabled: legacyEnabled, facts: legacyEnabled ? legacyFacts : null },
} as const;
