/**
 * Short shared copy that is the same wherever it appears, kept here so no template hard-codes prose.
 * Deliberately brief: anything page-specific belongs in that page's own content file.
 */

import { brand } from "../config/brand";
import type { PhotoId } from "./photos";

/** Guide pages, under the safe checks. A safety warning, not a sales line. */
export const coreFileWarning =
  "Stop at these. Editing WordPress core files, or deleting plugin files without a backup, can turn a fixable fault into lost data.";

/** City pages. How working with a remote team actually runs; no offices are claimed anywhere. */
export const remoteDelivery: { label: string; text: string }[] = [
  { label: "Meetings", text: "Discovery, design reviews and handover happen on video call, at a time you pick." },
  { label: "While we work", text: "You get a staging link to check progress, and questions go to the engineer doing the work." },
  { label: "Handover", text: "You keep the logins, the site and a written note of what changed." },
];

/** The cities index. One line, because each city page carries its own context. */
export const citiesLead = "We work with businesses across India remotely. Each page covers what the websites in that city are usually built to do.";

/**
 * Claim copy, in the one wording the whole site uses for it: the service and guide rails, the pricing page and
 * the about page all read these lines. The `// brand.claims.x` comment on each one is the only written link
 * between the words and the gated field in src/config/brand.ts, which next.config.ts fails a production deploy
 * over while it is unconfirmed, so a line never moves without its comment. `claimPoints` below is the second
 * half of that link and is in code: it reads the gate itself, so a claim the owner turns off drops its words.
 */
export const claimLine = {
  backupFirst: "Files and database are backed up before anything changes.", // brand.claims.backupFirst
  fixedPrice: "You approve the price before any work starts.", // brand.claims.fixedPrice
  ownLogin: "We work through a login you create, never your password.", // brand.claims.ownLogin
  accessRemoved: "Our access is removed when the work is done.", // brand.claims.accessRemoved
} as const;

type ClaimKey = keyof typeof claimLine;

/**
 * The named claim lines that are confirmed on, in the order asked for. A claim that is off renders nothing.
 *
 * Each line carries its own full stop, so the five places that render one agree: the rail printed them bare as
 * list items while the pricing header, the contact panel and two lines of the booking flow appended a stop, and
 * the same sentence read two ways (rule 14). The stop is in the data because four of the five uses are mid prose,
 * where the sentence needs it; `backupFirst` gained its verb so the stop is honest on all four.
 */
const claimPoints = (...keys: readonly ClaimKey[]): string[] => keys.filter((k) => brand.claims[k]).map((k) => claimLine[k]);

/**
 * The claim lines the conversion rail shows, in one order, read by every template that renders a rail. The
 * service rail asked for (backupFirst, fixedPrice, ownLogin) and the guide rail for (backupFirst, ownLogin,
 * accessRemoved), so a visitor got a different set of promises on a guide than on its parent service. Nothing in
 * the briefs or the task reports records a reason for the split, so the two are aligned on all four claim lines
 * rather than on a rationale invented after the fact. Every one is already gated and already shown site-wide by
 * the home page's security section, so this adds no promise; it stops the rail making a different one per page.
 */
/**
 * Four short facts for the chip row inside a service page hero. Two of the three reference sites put a
 * strip like this directly under the headline, because the first question on a service page is whether
 * this is safe to hand a site to, not what the service is called.
 *
 * These are the same promises `claimLine` carries, cut to chip length: the rail states them as sentences
 * further down the page, and a chip has no room for one. Each reads its own gate, so a claim the owner
 * turns off loses its chip rather than appearing here unqualified, and the row renders nothing if every
 * one of them is off.
 */
export const heroChips: string[] = [
  brand.claims.vetted && "Vetted engineers",
  brand.claims.fixedPrice && "Price agreed first",
  brand.claims.backupFirst && "Backup before changes",
  brand.claims.ownLogin && "Your login, not your password",
].filter((x): x is string => typeof x === "string");

export const railPoints = claimPoints("backupFirst", "fixedPrice", "ownLogin", "accessRemoved");

/**
 * How we handle access, data and money: the home page's security section and the about page both read this.
 * Every item is either a claim gated in brand.claims, named in `claim` and marked with the same
 * `// brand.claims.x` comment as the lines above, or content the owner has already published as a deliverable,
 * with the file it comes from noted. `id` is what a page maps an icon to, because icons are not content: it is
 * a union rather than a string so that adding an item without giving it an icon fails to compile, instead of
 * rendering `undefined` as a component.
 */
export type PracticeId = "own-login" | "access-ends" | "backup-first" | "offsite-backups" | "price-approved" | "change-note";

const PRACTICE: { group: string; items: { id: PracticeId; claim?: ClaimKey; title: string; text: string }[] }[] = [
  {
    group: "Access",
    items: [
      // brand.claims.ownLogin
      { id: "own-login", claim: "ownLogin", title: "Your login stays yours", text: "We work through an account you create for us. We never ask for your password." },
      // brand.claims.accessRemoved
      { id: "access-ends", claim: "accessRemoved", title: "Access ends with the job", text: "When the work is done, our account is removed from your site." },
    ],
  },
  {
    group: "Data",
    items: [
      // brand.claims.backupFirst
      { id: "backup-first", claim: "backupFirst", title: "A backup before any change", text: "Files and database are backed up before we touch anything." },
      // care-plans.ts deliverable
      { id: "offsite-backups", title: "Backups kept off your server", text: "On care plans, backups are stored away from your host, with tested restores." },
    ],
  },
  {
    group: "Accountability",
    items: [
      // brand.claims.fixedPrice ("agreed before work starts")
      { id: "price-approved", claim: "fixedPrice", title: "Nothing starts without your yes", text: "You approve the price before any work begins." },
      // emergency.ts and critical-error.ts deliverable
      { id: "change-note", title: "A written note of every change", text: "You get a plain note of what broke and what we changed." },
    ],
  },
];

/** The practice with every unconfirmed claim dropped, and any group it empties dropped with it. */
export const securityPractice = PRACTICE.map((g) => ({ ...g, items: g.items.filter((i) => !i.claim || brand.claims[i.claim]) })).filter(
  (g) => g.items.length > 0,
);

/**
 * The home page's "What we don't do" section. Gated on brand.boundaries, which is why these words sit in this
 * file: it is the one file under src/content that imports brand and gates its own copy (docs/layout-ledger.md,
 * v3/home). An empty array renders nothing.
 *
 * Each line is a limit this business can actually stand behind, checked against src/config/sitemap.ts: there is
 * no hosting service, the two migration services both run towards WordPress and WooCommerce, and nothing in the
 * tree sells copywriting, data entry, paid media or social. fixed.net's list (no custom development, no web
 * design, no new sites) is the opposite of true here, where /wordpress-development/ sells all three.
 */
export const boundaries: { term: string; text: string }[] = brand.boundaries
  ? [
      { term: "Hosting", text: "We do not sell hosting. We work on the host you already have, and tell you when the host is the fault." },
      { term: "Other platforms", text: "We build on WordPress and WooCommerce. We move sites onto them from Wix, Squarespace and Shopify, not away." },
      { term: "Writing and data entry", text: "We do not write your pages or key in a catalogue by hand. Send us a file and we import it." },
      { term: "Ads and social", text: "We do not run ad campaigns or post to your accounts. Search work we do, paid media we do not." },
    ]
  : [];

/**
 * The four moves every job runs through, from broken to fixed. Shared, because two surfaces show them: the
 * home page's tabbed showcase (Steps.tsx) and the numbered row on every service page. Holding one array
 * stops a visitor being told a different process on a service page than on the home page.
 *
 * It lives in this file and not beside the services because three of its lines gate a claim and read the
 * gate: the Approve step's sentence and its alt text read `fixedPrice`, and the Fix step's first clause
 * reads `backupFirst`. notices.ts is the one file under src/content allowed to do that (see the rail note
 * above). Alt text is included deliberately: assistive tech reads it, so an ungated promise there is still
 * a promise. Each claim off leaves a step that still describes the move.
 *
 * `capture` is the real screenshot the home tabs show once it exists, and `standIn` the photograph used
 * until then (docs/image-todo.md). The service row shows neither; it needs only verb and text.
 */
// Each step shows its real capture in a device frame once the file exists; until then a stand-in photo
// (docs/image-todo.md). booking and quote: screenshots of /contact once v3 styles it. before and after:
// `npm run capture` (needs Docker). Stand-ins avoid frames the hero and bento already use on this page.
// Three lines assert a claim gated in brand.claims and read their gate: the Approve step's sentence and its
// alt text (fixedPrice) and the Fix step's first clause (backupFirst). Alt text counts, because assistive
// tech reads it. Each one off leaves a step that still describes the move.
const { fixedPrice, backupFirst } = brand.claims;
export const jobSteps: { verb: string; text: string; capture: string; alt: string; standIn: PhotoId }[] = [
  {
    verb: "Describe",
    text: "Tell us what your site is doing and where it lives. Not sure what broke? Describe what you see.",
    capture: "/screens/booking.png",
    alt: "The booking form asking what the site is doing and which site it is",
    standIn: "terminal",
  },
  {
    verb: "Approve",
    text: `An engineer looks at the problem and quotes ${fixedPrice ? "a fixed price" : "the work"}. No work starts until you approve it.`,
    capture: "/screens/quote.png",
    alt: `A ${fixedPrice ? "fixed-price " : ""}quote waiting for approval`,
    standIn: "emergency",
  },
  {
    verb: "Fix",
    text: `${backupFirst ? "We take a full backup, then fix" : "We fix"} the cause, not the symptom. Your content, settings and design stay as they were.`,
    capture: "/screens/critical-error-on-this-website.png",
    alt: 'Before: the WordPress page reading "There has been a critical error on this website."',
    standIn: "racks",
  },
  {
    verb: "Verify",
    text: "We test the home page, forms, logins and checkout before calling it done. You get a note of what changed.",
    capture: "/screens/restored.png",
    alt: "After: the same WordPress site loading normally",
    standIn: "workspace",
  },
];
