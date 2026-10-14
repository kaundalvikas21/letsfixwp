/**
 * PLACEHOLDERS, not testimonials. Nobody said these words.
 *
 * They exist so a quote section can be designed and reviewed at the right text length. A design variation that
 * renders them must mark each one visibly as unconfirmed and must gate publication on real quotes. Replace each
 * `quote` and `excerpt` with a client's own words, and each name, role and org with that client's real details. Do
 * not invent a client: a fabricated endorsement on a live site is a false statement about a real person or company,
 * and the section contract bans invented brands outright (rule 6).
 *
 * `placeholder: true` marks each card visibly on the page and fails a production deploy (next.config.ts). Delete the
 * flag from an entry only when its words, name, role and org are a real client's.
 *
 * The previous contents of this file were two real testimonials belonging to fixmywp.com, a different and still
 * trading business. They were removed on 2026-10-07 when the owner confirmed the two companies are unrelated.
 */
export const testimonials = [
  {
    placeholder: true,
    name: "Client name",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with one client's account of a single emergency, in their words: what broke, what they had already tried, and how long the site was down.\n\nA second paragraph can cover what happened after the fix, which is what the longer placement on the service pages uses.",
    // Shown on the home page quote cards, which cap a quote at three lines and never cut one: keep a real excerpt to
    // about 15 words (roughly 90 characters).
    excerpt: "Placeholder: one client's words on one emergency, what broke and how fast it came back.",
  },
  {
    placeholder: true,
    name: "Second client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with a second client's words. Pick someone whose job was not an emergency, so the two quotes are not making the same point twice.",
    excerpt: "Placeholder: a second client on a care plan or a build, not another emergency.",
  },
] as const;
