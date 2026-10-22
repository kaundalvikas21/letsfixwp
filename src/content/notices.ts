/**
 * Short shared copy that is the same wherever it appears, kept here so no template hard-codes prose.
 * Deliberately brief: anything page-specific belongs in that page's own content file.
 */

import { brand } from "../config/brand";

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
  backupFirst: "Files and database backed up before anything changes", // brand.claims.backupFirst
  fixedPrice: "You approve the price before any work starts", // brand.claims.fixedPrice
  ownLogin: "We work through a login you create, never your password", // brand.claims.ownLogin
  accessRemoved: "Our access is removed when the work is done", // brand.claims.accessRemoved
} as const;

type ClaimKey = keyof typeof claimLine;

/** The named claim lines that are confirmed on, in the order asked for. A claim that is off renders nothing. */
export const claimPoints = (...keys: readonly ClaimKey[]): string[] => keys.filter((k) => brand.claims[k]).map((k) => claimLine[k]);

/**
 * How we handle access, data and money: the home page's security section and the about page both read this.
 * Every item is either a claim gated in brand.claims, named in `claim` and marked with the same
 * `// brand.claims.x` comment as the lines above, or content the owner has already published as a deliverable,
 * with the file it comes from noted. `id` is what a page maps an icon to, because icons are not content.
 */
const PRACTICE: { group: string; items: { id: string; claim?: ClaimKey; title: string; text: string }[] }[] = [
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
