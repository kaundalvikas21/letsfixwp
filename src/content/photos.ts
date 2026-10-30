import { serviceIds } from "../config/routes";

/**
 * Every photograph in public/site_images/, carried over from the v1-incident-console set.
 * Use one with <Photo id="..." /> (src/components/sections/v3/Photo.tsx).
 *
 * Adding an entry here and rendering it through <Photo> is all a new photograph needs: the entrance
 * (the frame opening from clip-path inset(12%) while the picture settles from scale(1.06)) belongs to
 * that component, not to any call site, so it applies to every image on the site and to every one
 * added later. A component that reaches for next/image directly opts itself out by accident.
 *
 * tone tells you whether a frame suits v3 (design-system/letsfixwp-v3/MASTER.md, Imagery):
 *   daylight: the v3 direction, pick these first
 *   mono:     black and white, neutral, fine anywhere
 *   dark:     lit after hours; usable, but off the daylight direction (docs/image-todo.md)
 *   red:      strong red in frame; v3's color lock keeps red off the page, so do not use on v3
 * focus is the object-position that keeps the subject in frame when the box crops the photo.
 */
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  tone: "daylight" | "mono" | "dark" | "red";
  focus?: string;
};

/**
 * Illustrations from Unsplash, in public/site_images/illustrations/. Downloaded rather than hotlinked, so no
 * third-party image host ships in production and next.config.ts needs no remotePatterns entry.
 *
 * Every one is `images.unsplash.com/vector-*`, which is the free Unsplash Licence. The `plus.unsplash.com/
 * premium_vector-*` results that dominate the same searches are Unsplash+ subscription assets and are
 * deliberately excluded. Source ids are kept here so each file can be traced back and re-licensed if asked:
 *
 *   working-at-laptop   vector-1757394158143-e5f18aa61cf8  Sayyam Abbasi
 *   settings-and-gears  vector-1756381489397-6ce13cabf20b  Public domain vectors (dual PD + Unsplash Licence)
 *   browser-with-code   vector-1756773357530-5fe53f70177a  Muhammad Afandi
 *   team-at-work        vector-1757394158174-c54b06939e1c  Sayyam Abbasi
 *   charts-and-plans    vector-1757394158213-e0cff802d25b  Sayyam Abbasi
 *   desk-with-laptop    vector-1756205137934-33da285fc438  Irvan maulana
 *   shield-and-firewall vector-1786212329657-b0f611f563a9  YuguDesign
 *   metrics-and-team    vector-1757394158232-bea54f8f767c  Sayyam Abbasi
 *
 * They are blue and orange, against MASTER's single green accent. That is a recorded exception taken by the
 * owner on 2026-10-30, not an oversight; see MASTER.md under Imagery.
 */
export const illustrations = {
  "working-at-laptop": {
    src: "/site_images/illustrations/working-at-laptop.jpg", width: 1600, height: 1067,
    alt: "Flat illustration of a person at a laptop beside a large interface panel of images and controls",
  },
  "settings-and-gears": {
    src: "/site_images/illustrations/settings-and-gears.jpg", width: 1600, height: 1600,
    alt: "Flat illustration of a settings window with sliders, surrounded by interlocking gears",
  },
  "browser-with-code": {
    src: "/site_images/illustrations/browser-with-code.jpg", width: 1600, height: 1600,
    alt: "Flat illustration of a browser window showing code brackets above lines of text",
  },
  "team-at-work": {
    src: "/site_images/illustrations/team-at-work.jpg", width: 1600, height: 1067,
    alt: "Flat illustration of a small team working around a large mobile interface",
  },
  "charts-and-plans": {
    src: "/site_images/illustrations/charts-and-plans.jpg", width: 1600, height: 1067,
    alt: "Flat illustration of people working at a large monitor showing charts and panels",
  },
  "metrics-and-team": {
    src: "/site_images/illustrations/metrics-and-team.jpg", width: 1600, height: 1067,
    alt: "Flat illustration of a team around a large monitor showing bar charts and a pie chart",
  },
  "shield-and-firewall": {
    src: "/site_images/illustrations/shield-and-firewall.jpg", width: 1600, height: 1067,
    alt: "Flat illustration of a green shield standing in front of a screen behind a brick wall",
  },
  "desk-with-laptop": {
    src: "/site_images/illustrations/desk-with-laptop.jpg", width: 1600, height: 1600,
    alt: "Flat illustration of a person working on a laptop at a desk with a plant and a clock",
  },
} as const;

export type IllustrationId = keyof typeof illustrations;

export const photos = {
  drafting: {
    src: "/site_images/services/drafting.jpg", width: 1600, height: 1000, tone: "daylight", focus: "60% 50%",
    alt: "A hand sketching a website wireframe on a tablet at a light wooden desk, keyboard and mouse beside it",
  },
  cables: {
    src: "/site_images/services/cables.jpg", width: 1600, height: 1000, tone: "mono",
    alt: "Network patch panel with numbered ports and grey cables, in black and white",
  },
  keys: {
    src: "/site_images/services/keys.jpg", width: 1600, height: 1000, tone: "mono",
    alt: "Close-up of a black laptop keyboard, in black and white",
  },
  racks: {
    src: "/site_images/services/racks.jpg", width: 1600, height: 1000, tone: "mono", focus: "40% 50%",
    alt: "Server racks full of patch cables behind mesh doors, in black and white",
  },
  workspace: {
    src: "/site_images/services/workspace.jpg", width: 1600, height: 1000, tone: "dark",
    alt: "A tidy desk with a curved monitor, two speakers and a floor lamp against a dark wall",
  },
  terminal: {
    src: "/site_images/services/terminal.jpg", width: 1600, height: 1000, tone: "dark", focus: "35% 50%",
    alt: "Hands typing on a laptop with a code editor open, in warm low light",
  },
  emergency: {
    src: "/site_images/services/emergency.jpg", width: 1600, height: 1000, tone: "dark", focus: "25% 50%",
    alt: "Over the shoulder of an engineer working on a laptop at night, city windows behind",
  },
  "night-desk": {
    src: "/site_images/services/night-desk.jpg", width: 1600, height: 1000, tone: "dark", focus: "45% 50%",
    alt: "A cluttered desk of chargers and cables under a single lamp at night",
  },
  store: {
    src: "/site_images/services/store.jpg", width: 1600, height: 1000, tone: "dark", focus: "45% 50%",
    alt: "Close-up of hands holding a phone in warm low light",
  },
  "hero-console": {
    src: "/site_images/hero-console-bg.jpg", width: 1600, height: 1200, tone: "dark", focus: "60% 50%",
    alt: "An engineer in a dark room reading a WordPress fatal error and stack trace on a monitor",
  },
  "final-cta": {
    src: "/site_images/final-cta.jpg", width: 2400, height: 1200, tone: "dark", focus: "15% 50%",
    alt: "A dark home office with one monitor glowing on a desk",
  },
  "laptop-hands": {
    src: "/site_images/bento-guarantee.jpg", width: 1200, height: 1200, tone: "red", // red rim on the laptop's right edge
    alt: "Hands typing on a laptop in a dark room, the screen lit",
  },
  monitors: {
    src: "/site_images/services/monitors.jpg", width: 1600, height: 1000, tone: "red",
    alt: "A desk with two monitors showing code, a phone on a stand and headphones, red wall behind",
  },
  alert: {
    src: "/site_images/services/alert.jpg", width: 1600, height: 1000, tone: "red",
    alt: "Rows of red-lit panels on a wall of server cabinets",
  },
  "keyboard-red": {
    src: "/site_images/bento-keyboard.jpg", width: 1200, height: 1200, tone: "red",
    alt: "Close-up of a dark laptop keyboard with the arrow keys in focus and a red light at the edge",
  },
} as const satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;

/**
 * Which photograph each service page shows. v2's mapping (from v1), with the red frames swapped for v3:
 * alert and monitors are out, so their services moved to the nearest neutral frame.
 */
export const servicePhotos: Record<string, PhotoId> = {
  "audit-hardening": "terminal",
  "blacklist-removal": "cables",
  "care-plans": "workspace",
  "critical-error": "emergency",
  "custom-plugin": "terminal",
  "custom-theme": "night-desk",
  "database-connection-error": "racks",
  "elementor-issues": "drafting",
  "email-not-sending": "workspace",
  emergency: "emergency",
  "hire-developer": "terminal",
  "hosting-migration": "racks",
  "login-redirect-issues": "terminal",
  "maintenance-woocommerce": "workspace",
  "malware-removal": "keys",
  "payment-gateway-gst": "store",
  "platform-migration": "cables",
  "plugin-theme-conflict": "keys",
  redesign: "drafting",
  "seo-services": "night-desk",
  "seo-spam-cleanup": "keys",
  "server-errors": "racks",
  "shopify-migration": "store",
  "site-recovery": "racks",
  "speed-optimization": "cables",
  "support-hours": "workspace",
  "update-php-errors": "keys",
  "website-design": "drafting",
  "white-label": "night-desk",
  "white-screen": "night-desk",
  "woocommerce-development": "store",
  "woocommerce-fixes": "store",
};

// Integrity: a new service in SITEMAP without a photograph fails the build here.
for (const id of serviceIds) if (!servicePhotos[id]) throw new Error(`photos: service "${id}" has no photograph`);

/**
 * The banner for one guide card. A guide is an error inside a service, so it inherits that service's banner
 * rather than having a map of its own: the knowledge-base card and the service that fixes it then always show
 * the same subject. Callers pass the resolved parent service.
 */
/**
 * The illustration for one service, by subject. Hub first, because the subject is what a reader recognises: a
 * security service shows the shield whatever kind of work it is. Intent is the fallback for hubs whose services
 * span several kinds.
 *
 * It lives beside the registry rather than in a template because two surfaces read it now, the service hero and
 * the pricing page's service grid, and a third would otherwise invent its own mapping.
 */
/**
 * Illustrations that are landscape (1600x1067) and therefore fill a 16/10 card banner.
 *
 * The square ones (settings-and-gears, browser-with-code, desk-with-laptop) are badge compositions on white:
 * centred artwork with wide margins built into the file. Cropped to a banner they leave white down both sides,
 * which reads as padding and cannot be fixed in CSS without cutting the subject. They are fine in a hero, where
 * the frame is nearer square, and wrong in a card.
 */
export type CardArtId = Extract<
  IllustrationId,
  "working-at-laptop" | "charts-and-plans" | "team-at-work" | "shield-and-firewall" | "metrics-and-team"
>;

/**
 * The banner for one service card. Landscape only, and chosen by subject so a tab shows more than one picture:
 * security services get the shield, speed and migration get the metrics scene, plans get the charts and projects
 * get the team. Everything else is someone working on a site.
 */
export const cardArt = (s: { hub: string; intent: string }): CardArtId => {
  if (s.hub === "wordpress-security") return "shield-and-firewall";
  if (s.hub === "wordpress-performance-migration") return "metrics-and-team";
  if (s.intent === "plan") return "charts-and-plans";
  if (s.intent === "project") return "team-at-work";
  return "working-at-laptop";
};

export const serviceArt = (s: { hub: string; intent: string }): IllustrationId => {
  if (s.hub === "wordpress-security") return "shield-and-firewall";
  if (s.hub === "wordpress-fix") return "browser-with-code";
  if (s.hub === "woocommerce") return "working-at-laptop";
  if (s.intent === "project") return "team-at-work";
  if (s.hub === "wordpress-performance-migration") return "metrics-and-team";
  if (s.intent === "plan") return "charts-and-plans";
  return "settings-and-gears";
};
