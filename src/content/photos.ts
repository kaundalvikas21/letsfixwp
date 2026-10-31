import { hubIds, serviceIds } from "../config/routes";

/**
 * Every photograph in public/site_images/, carried over from the v1-incident-console set.
 * Use one with <Photo id="..." /> (src/components/sections/v3/Photo.tsx).
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
  /* The four warm renders of the eight the owner supplied. Object-on-a-lit-surface 3D renders, a
     different visual language from the documentary photographs above, so they are kept to one
     place: the hub cards. 359x149 is small, which is why they are used at card width and never in
     a masthead. The other four glow blue, which is a second accent this site does not have, and
     are logged in docs/image-todo.md for regeneration rather than used. Measured warm/cool split
     of the lit pixels is in docs/layout-ledger.md Task 28. */
  "hub-fix": {
    src: "/site_images/services/emergency-fixes.png", width: 359, height: 149, tone: "dark",
    alt: "A glowing life ring on a desk beside a laptop showing the WordPress logo",
  },
  "hub-performance": {
    src: "/site_images/services/speed-optimization.png", width: 359, height: 149, tone: "dark",
    alt: "A speedometer lit in amber, its needle swinging up through the dial",
  },
  "hub-woocommerce": {
    src: "/site_images/services/woocommerce-help.png", width: 359, height: 149, tone: "dark",
    alt: "A glowing shopping trolley on a pad beside a laptop showing a shop page",
  },
  "hub-maintenance": {
    src: "/site_images/services/maintenance-care.png", width: 359, height: 149, tone: "dark",
    alt: "A steel gear resting on a pad lit from beneath in amber",
  },
  "hero-background": {
    src: "/site_images/hero-background.png", width: 1774, height: 522, tone: "dark",
    alt: "A developer at night at a two-monitor desk, a WordPress site open in a code editor, warm lamplight behind",
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
 *
 * `drafting` is out too, and for the same kind of reason. It is the catalogue's one `daylight` frame,
 * which v4's Imagery section rules off direction, and /pricing/ had already rejected it by name on
 * tone: even under the scrim it was the brightest thing on a dark-locked page and read as a stock
 * photograph pasted into the system. That was survivable while it sat in a 432px column. It is not
 * now the photograph is the band, which is the largest element on the page, on three service pages,
 * the development hub and every city page (a city takes its first highlighted service's frame, and
 * that is `website-design` on most of them). Each moved to the nearest frame on direction rather
 * than to the nearest subject: night, one warm source, dark page.
 */
export const servicePhotos: Record<string, PhotoId> = {
  "audit-hardening": "terminal",
  "blacklist-removal": "cables",
  "care-plans": "workspace",
  "critical-error": "emergency",
  "custom-plugin": "terminal",
  "custom-theme": "night-desk",
  "database-connection-error": "racks",
  "elementor-issues": "night-desk",
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
  redesign: "workspace",
  "seo-services": "night-desk",
  "seo-spam-cleanup": "keys",
  "server-errors": "racks",
  "shopify-migration": "store",
  "site-recovery": "racks",
  "speed-optimization": "cables",
  "support-hours": "workspace",
  "update-php-errors": "keys",
  "website-design": "terminal",
  "white-label": "night-desk",
  "white-screen": "night-desk",
  "woocommerce-development": "store",
  "woocommerce-fixes": "store",
};

/** Hub pages have no content file, so their photograph is mapped by hub id. */
export const hubPhotos: Record<string, PhotoId> = {
  "wordpress-fix": "emergency",
  "wordpress-security": "terminal",
  "wordpress-performance-migration": "racks",
  "wordpress-maintenance": "workspace",
  "wordpress-development": "final-cta",
  woocommerce: "store",
};

/**
 * The hub card banner, where one exists.
 *
 * Deliberately partial, and deliberately not covered by the integrity check below. A banner is an
 * enhancement to a card that already works, not a requirement of a hub, so a hub without one is
 * not a build error. `wordpress-security` has renders but both glow blue, and
 * `wordpress-development` has none at all; both are logged in docs/image-todo.md.
 */
export const hubBanners: Partial<Record<string, PhotoId>> = {
  "wordpress-fix": "hub-fix",
  "wordpress-performance-migration": "hub-performance",
  "wordpress-maintenance": "hub-maintenance",
  woocommerce: "hub-woocommerce",
};

// Integrity: a new service or hub in SITEMAP without a photograph fails the build here.
for (const id of serviceIds) if (!servicePhotos[id]) throw new Error(`photos: service "${id}" has no photograph`);
for (const id of hubIds) if (!hubPhotos[id]) throw new Error(`photos: hub "${id}" has no photograph`);
