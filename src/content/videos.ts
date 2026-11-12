/**
 * Video slots. NOTHING HERE IS FILMED YET, and every `clip` is null on purpose.
 *
 * A slot renders a composed empty state naming what will play there, and becomes a real player the
 * moment its `clip` is filled in. That is the same existence gate the screen captures already run
 * through `hasScreen()`: an asset appears on the page when the file lands, with no code change.
 *
 * Paths live in this file rather than in a component because scripts/check-content.ts fails any
 * hardcoded internal path outside src/content and src/config. Put the files in public/videos/ and
 * their posters and captions beside them, then write the paths here. docs/video-todo.md is the brief
 * for whoever films them: the required shape, length, codec and filenames, one row per slot.
 *
 * Two shapes, declared per slot by `ratio`. The captures are 16/10 like every other asset here; a
 * client filming themselves on a phone is 9/16. A slot reserves its own shape whether or not the clip
 * exists, so filling one in later shifts nothing.
 *
 * Do not fill a slot with footage of someone else's work, and do not fill a client slot with a
 * reconstruction. PRODUCT.md lists client testimonials under what must not be fabricated by any
 * future work, and the section contract bans invented brands outright (rule 6).
 */

export type VideoId =
  | "what-a-fix-looks-like"
  | "how-a-rescue-runs"
  | "a-site-brought-back"
  | "client-story-1"
  | "client-story-2"
  | "client-story-3"
  | "client-story-4"
  | "client-story-5"
  | "client-story-6"
  | "client-story-7"
  | "client-story-8"
  | "client-story-9"
  | "client-story-10"
  | "client-story-11"
  | "client-story-12";

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
  /**
   * The shape of the box this slot reserves, which the slot declares rather than the component,
   * because an empty slot has to reserve the same box its clip will fill.
   *
   * 16/10 is the house ratio and the default: it matches the 1600x1000 captures, so a clip and a
   * screenshot read as the same device photographed twice. A client filming themselves holds a phone,
   * and 9/16 is that clip at its own shape. Letterboxing a phone clip into 16/10 puts dead bars down
   * both sides, and cropping it to fit takes the speaker's head out of frame. Amended into MASTER.md
   * for client clips by name and nothing else, owner decision 2026-11-11, ledger Task 79.
   */
  ratio?: "16/10" | "9/16" | "16/9";
  clip: Clip | null;
};

export const videos: Record<VideoId, VideoSlot> = {
  // The one filmed slot on the site. It is a drawn brand film (3D voxel figures on a desk, made in code),
  // not a recording of a client's site, and the label says so: it describes how a fix runs rather than
  // claiming to be evidence of one. It states only the promises the owner has confirmed in PRODUCT.md
  // (fixed price agreed first, full backup before any change, a login the client creates and never their
  // password, access removed afterwards) plus the home H1's "back online today". No price, count, rating
  // or turnaround figure appears, because every such figure here is still a placeholder.
  "what-a-fix-looks-like": {
    ratio: "16/9",
    label: "How a fix runs, from a site that is down to the same site back online.",
    clip: {
      src: "/videos/back-online-today.mp4",
      poster: "/videos/back-online-today.jpg",
      captions: "/videos/back-online-today.vtt",
      width: 1920,
      height: 1080,
      alt: "The LetsFixWP team takes a broken WordPress site through a fixed price, a login you create and a full backup, then brings it back online",
      seconds: 45,
    },
  },
  "how-a-rescue-runs": {
    label: "How a rescue runs, from the first message to the site loading again.",
    clip: null,
  },
  "a-site-brought-back": {
    label: "A WordPress site going from a fatal error back to loading normally.",
    clip: null,
  },
  "client-story-1": {
    ratio: "9/16",
    label: "A client on what broke and how it was handled.",
    clip: null,
  },
  "client-story-2": {
    ratio: "9/16",
    label: "A second client, on work that was not an emergency.",
    clip: null,
  },
  "client-story-3": {
    ratio: "9/16",
    label: "A third client, on a hacked site and what the cleanup involved.",
    clip: null,
  },
  "client-story-4": {
    ratio: "9/16",
    label: "A fourth client, on moving a store without losing orders.",
    clip: null,
  },
  "client-story-5": {
    ratio: "9/16",
    label: "A fifth client, on a site that went down right after an update.",
    clip: null,
  },
  "client-story-6": {
    ratio: "9/16",
    label: "A sixth client, on what a care plan does month to month.",
    clip: null,
  },
  "client-story-7": {
    ratio: "9/16",
    label: "A seventh client, on a site that was slow rather than broken.",
    clip: null,
  },
  "client-story-8": {
    ratio: "9/16",
    label: "An eighth client, on changing hosts without losing a day of orders.",
    clip: null,
  },
  "client-story-9": {
    ratio: "9/16",
    label: "A ninth client, on a checkout that had stopped taking payments.",
    clip: null,
  },
  "client-story-10": {
    ratio: "9/16",
    label: "A tenth client, on a PHP upgrade that took the page builder with it.",
    clip: null,
  },
  "client-story-11": {
    ratio: "9/16",
    label: "An eleventh client, on a redesign that kept every page in place.",
    clip: null,
  },
  "client-story-12": {
    ratio: "9/16",
    label: "A twelfth client, an agency, on handing their support over to us.",
    clip: null,
  },
};
