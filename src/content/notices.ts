/**
 * Short shared copy that is the same wherever it appears, kept here so no template hard-codes prose.
 * Deliberately brief: anything page-specific belongs in that page's own content file.
 */

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
