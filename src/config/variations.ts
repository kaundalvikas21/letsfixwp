/**
 * The design variations, for the chooser at /preview/.
 *
 * Each variation lives on its own branch and is never merged into main. Its code is therefore not in this
 * build: the chooser links to that branch's own deployment, it does not render the branch.
 *
 * `url` is null until the owner pastes the branch's deployment address. A null url renders as "not deployed
 * yet" rather than a dead link, which is the same rule the rest of the site follows for unconfirmed values.
 *
 * On Vercel, pushing a branch creates its URL automatically; copy it from the deployment list. Any host that
 * builds one URL per branch works the same way.
 */
export type Variation = {
  id: string;
  /** The git branch the design lives on. */
  branch: string;
  /** What a non-technical reader needs to tell the designs apart. */
  name: string;
  summary: string;
  /** A screenshot of this variation's home page, in public/previews/. */
  shot: string;
  /** The branch's deployment address, or null while it has none. */
  url: string | null;
};

export const variations: Variation[] = [
  {
    id: "v1",
    branch: "v1-incident-console",
    name: "Incident console",
    summary: "Dark, dense and status-led, built to read like an operations dashboard during an outage.",
    shot: "/previews/v1-incident-console.png",
    url: null,
  },
  {
    id: "v2",
    branch: "v2-swiss-precision",
    name: "Swiss precision",
    summary: "Quiet editorial layout on a strict grid, with wide bands of text and very little decoration.",
    shot: "/previews/v2-swiss-precision.png",
    url: null,
  },
  {
    id: "v3",
    branch: "v3-bento-ops",
    name: "Bento ops",
    summary: "Soft, rounded cards in a bento grid, a green accent and a command palette for finding a problem.",
    shot: "/previews/v3-bento-ops.png",
    url: null,
  },
];

export const liveVariations = variations.filter((v) => v.url);
