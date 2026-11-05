/**
 * The three ways to work with us, named and described once.
 *
 * These are not content. They name a **mode of engagement** rather than a service, so they cannot be
 * read off a file in `src/content/`: "One-time fix" is not the title of any service, and no service
 * file carries a five-word summary of itself. They are the owner's words, written for the home page
 * and shipping there since `Plans` was built.
 *
 * They live here because two pages say them. `src/components/sections/v4/Plans.tsx` names the three
 * on the home page and `src/app/pricing/page.tsx` names the same three on the pricing page, and
 * **the three names were already duplicated across those two files** before this const existed. The
 * pricing page's own docstring had refused to also copy the `who` lines, on the ground that a second
 * wording for the same three choices is the drift Task 8 removed from the promises. That objection
 * was right about the risk and wrong about the remedy: one const read by both pages removes the
 * drift instead of avoiding the words, which is what Task 32 did with `RemoteTrack`.
 *
 * `who` is the scannable line. It is what tells a reader which of the three is theirs without
 * reading a paragraph, which is the job `whoItsFor` was doing on the pricing page at 97, 143 and 152
 * characters, three sentences of unequal length in the one slot meant to differentiate (ledger Task
 * 75). Each is one line at every width the site supports, and they are deliberately parallel in
 * shape: a noun phrase naming what you end up with.
 *
 * `id` is the service each mode books against, and it is the key to everything factual: the page
 * reads `deliverables`, `path` and the rest off `getService(id)`, so nothing here states a fact the
 * service pages do not. Nothing in this file may ever carry a price, a turnaround or a claim; those
 * live in `src/content/pricing.ts` and `src/config/brand.ts` and are gated there.
 */
export const WAYS = [
  { id: "emergency", name: "One-time fix", who: "One problem on your site, found and fixed." },
  { id: "malware-removal", name: "Hacked site cleanup", who: "Malware out, the way in closed." },
  { id: "care-plans", name: "Care plan", who: "Updates, backups and monitoring, every month." },
] as const;

export type Way = (typeof WAYS)[number];

/** Lookup by service id, so a call site can take the three in its own order without re-typing them. */
export const wayOf = (id: Way["id"]): Way => WAYS.find((w) => w.id === id)!;
