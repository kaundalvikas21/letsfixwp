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
 * `video` names this client's reserved video slot in src/content/videos.ts, which is empty until the clip exists.
 * The same rule governs it: a client video is that client on camera, filmed with their consent, or it is nothing. Do
 * not fill a slot with an actor, a voiceover over stock footage, or a reconstruction.
 *
 * The previous contents of this file were two real testimonials belonging to fixmywp.com, a different and still
 * trading business. They were removed on 2026-10-07 when the owner confirmed the two companies are unrelated.
 */
export const testimonials = [
  {
    placeholder: true,
    video: "client-story-1",
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
    video: "client-story-2",
    name: "Second client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with a second client's words. Pick someone whose job was not an emergency, so the two quotes are not making the same point twice.",
    excerpt: "Placeholder: a second client on a care plan or a build, not another emergency.",
  },
  {
    placeholder: true,
    video: "client-story-3",
    name: "Third client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with a third client's words about a hacked or infected site: what they first noticed, who told them, and what it took to get the warnings cleared.",
    excerpt: "Placeholder: a third client on a hacked site and what the cleanup took.",
  },
  {
    placeholder: true,
    video: "client-story-4",
    name: "Fourth client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with a fourth client's words about a move or a store: what they were afraid of losing, and whether anything was lost.",
    excerpt: "Placeholder: a fourth client on moving a store and keeping every order.",
  },
] as const;
