import { serviceIds } from "../config/routes";

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
