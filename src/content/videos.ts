/**
 * Video slots. NOTHING HERE IS FILMED YET, and every `clip` is null on purpose.
 *
 * A slot renders a composed empty state naming what will play there, and becomes a real player the
 * moment its `clip` is filled in. That is the same existence gate the screen captures already run
 * through `hasScreen()`: an asset appears on the page when the file lands, with no code change.
 *
 * Paths live in this file rather than in a component because scripts/check-content.ts fails any
 * hardcoded internal path outside src/content and src/config. Put the files in public/videos/ and
 * their posters and captions beside them, then write the paths here.
 *
 * Do not fill a slot with footage of someone else's work, and do not fill a client slot with a
 * reconstruction. PRODUCT.md lists client testimonials under what must not be fabricated by any
 * future work, and the section contract bans invented brands outright (rule 6).
 */

export type VideoId =
  | "how-a-rescue-runs"
  | "a-site-brought-back"
  | "client-story-1"
  | "client-story-2"
  | "client-story-3"
  | "client-story-4";

export type Clip = {
  src: string;
  /** The frame shown before play. Required: without it the box is a black rectangle on a dark page. */
  poster: string;
  /**
   * WebVTT captions, required rather than optional. A clip cannot ship without them (contract rule 9),
   * and a <track> cannot be written for a file that does not exist, so the type asks for the path the
   * day a clip is added instead of letting an uncaptioned video reach the page.
   */
  captions: string;
  /** The real pixel size, so the reserved box is the final box and nothing reflows. */
  width: number;
  height: number;
  /** What the clip shows. Becomes the player's accessible name. */
  alt: string;
  /** Printed in the caption, so a visitor knows what a click costs before they spend it. */
  seconds: number;
};

export type VideoSlot = {
  /** One sentence naming what plays here. Shown under the frame whether or not the clip exists. */
  label: string;
  clip: Clip | null;
};

export const videos: Record<VideoId, VideoSlot> = {
  "how-a-rescue-runs": {
    label: "How a rescue runs, from the first message to the site loading again.",
    clip: null,
  },
  "a-site-brought-back": {
    label: "A WordPress site going from a fatal error back to loading normally.",
    clip: null,
  },
  "client-story-1": {
    label: "A client on what broke and how it was handled.",
    clip: null,
  },
  "client-story-2": {
    label: "A second client, on work that was not an emergency.",
    clip: null,
  },
  "client-story-3": {
    label: "A third client, on a hacked site and what the cleanup involved.",
    clip: null,
  },
  "client-story-4": {
    label: "A fourth client, on moving a store without losing orders.",
    clip: null,
  },
};
