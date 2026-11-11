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
  {
    placeholder: true,
    video: "client-story-5",
    name: "Fifth client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about a site that went down right after an update: what they clicked, what they saw, and how long it took to get the page back.",
    excerpt: "Placeholder: a site that went down the moment an update finished, and what it took to undo.",
  },
  {
    placeholder: true,
    video: "client-story-6",
    name: "Sixth client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about a care plan, month to month: what actually arrives in their inbox, and what has not gone wrong since.",
    excerpt: "Placeholder: what a care plan looks like from the client's side, month after month.",
  },
  {
    placeholder: true,
    video: "client-story-7",
    name: "Seventh client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about a site that was slow rather than broken: what they were losing to it, and what changed after.",
    excerpt: "Placeholder: a slow site rather than a broken one, and what the speed was costing.",
  },
  {
    placeholder: true,
    video: "client-story-8",
    name: "Eighth client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about a change of hosting: what they were afraid would happen during the move, and what the day was actually like.",
    excerpt: "Placeholder: changing hosts without losing a day, in the client's own words.",
  },
  {
    placeholder: true,
    video: "client-story-9",
    name: "Ninth client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about a checkout that had stopped taking payments: how they found out, and how much it cost before it was fixed.",
    excerpt: "Placeholder: a checkout that stopped taking payments, and how they found out.",
  },
  {
    placeholder: true,
    video: "client-story-10",
    name: "Tenth client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about a PHP upgrade that took their page builder with it: who told them to upgrade, and what broke when they did.",
    excerpt: "Placeholder: a PHP upgrade that took the page builder down with it.",
  },
  {
    placeholder: true,
    video: "client-story-11",
    name: "Eleventh client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about a redesign: what they wanted to keep, and whether the pages they already ranked for survived it.",
    excerpt: "Placeholder: a redesign that kept every page that was already working.",
  },
  {
    placeholder: true,
    video: "client-story-12",
    name: "Twelfth client",
    role: "Role",
    org: "Company",
    quote:
      "Placeholder. Replace with this client's words about an agency handing their WordPress support over: what they stopped doing, and what their own clients noticed.",
    excerpt: "Placeholder: an agency on handing WordPress support over and what their clients noticed.",
  },
] as const;
