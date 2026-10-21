import { brand } from "../config/brand";

/**
 * Short shared copy that is the same wherever it appears, kept here so no template hard-codes prose.
 * Deliberately brief: anything page-specific belongs in that page's own content file.
 */

/**
 * What the company promises a paying customer, for /contact/ and /legal/guarantee/.
 *
 * Every sentence is the owner's approved phrasing, copied verbatim from the `confirm(...)`
 * description of its own claim in src/config/brand.ts and reproduced in PRODUCT.md under Brand
 * Commitments. `brand.claims` holds booleans and numbers, so the words have to live somewhere, and
 * they lived in two hardcoded copies until this file: a promise that reads differently on two
 * routes is a real problem, not an untidy one. Never reword one.
 *
 * Four of the eight on purpose. sameDay, bookingMinutes, vetted and checkTurnaround are speed
 * claims and answer a different question from "what protects me"; they also ran the /contact/
 * column past the height of the form it sits beside. Each pair carries its own claim rather than a
 * list of sentences, because an unconfirmed claim is null and must then render nothing (contract
 * rule 8). `Promises` in templates/parts.tsx is the only thing that renders these.
 */
export const promises = [
  [brand.claims.fixedPrice, "fixes are fixed price, agreed before work starts"],
  [brand.claims.backupFirst, "a full backup is taken before any change"],
  [brand.claims.ownLogin, "we work through a login you create for us and never ask for your password"],
  [brand.claims.accessRemoved, "our access is removed when the work is done"],
] as const;

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
