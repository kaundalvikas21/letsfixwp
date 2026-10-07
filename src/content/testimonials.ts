/**
 * PLACEHOLDERS, not testimonials. Nobody said these words.
 *
 * They exist so the quote section can be designed and reviewed at the right text length. Every one renders with a
 * visible {{CONFIRM}} marker, and `brand.claims.testimonials` fails a production deploy until real quotes replace
 * them. Replace each `quote` and `excerpt` with a client's own words, and each name, role and org with that
 * client's real details. Do not invent a client: a fabricated endorsement on a live site is a false statement
 * about a real person or company, and the section contract bans invented brands outright (rule 6).
 *
 * The previous contents of this file were two real testimonials belonging to fixmywp.com, a different and still
 * trading business. They were removed on 2026-10-07 when the owner confirmed the two companies are unrelated.
 */
export const testimonials = [
  {
    name: "Client name",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with one client's account of a single emergency, in their words: what broke, what they had already tried, and how long the site was down.\n\nA second paragraph can cover what happened after the fix, which is what the longer placement on the service pages uses.",
    // Shown on the home page. Keep a real excerpt to about 25 words so it stays within three display lines.
    excerpt:
      "Placeholder for a client's own words about one emergency: what broke, how fast the site came back, and what they were told while it was happening.",
  },
  {
    name: "Second client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with a second client's words. Pick someone whose job was not an emergency, so the two quotes are not making the same point twice.",
    excerpt:
      "Placeholder for a second client, ideally on a care plan or a build rather than an emergency, so the pair covers two different kinds of work.",
  },
] as const;
