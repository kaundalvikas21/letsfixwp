/**
 * Which photograph each service page shows, carried over from the v1-incident-console set
 * (public/site_images/services/). Eleven photographs cover thirty-two services, so the same
 * frame repeats across related work: every migration gets the racks, every storefront the store.
 *
 * These are lit for v1's after-hours direction, not this variation's natural-light one
 * (design-system/letsfixwp-v2/MASTER.md under Imagery). docs/image-todo.md keeps that open.
 */
export const servicePhotos: Record<string, string> = {
  "audit-hardening": "terminal",
  "blacklist-removal": "monitors",
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
  "malware-removal": "monitors",
  "payment-gateway-gst": "store",
  "platform-migration": "cables",
  "plugin-theme-conflict": "keys",
  redesign: "drafting",
  "seo-services": "night-desk",
  "seo-spam-cleanup": "monitors",
  "server-errors": "alert",
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

/**
 * Hub pages have no content file, only a route node, so their photograph is mapped by hub id
 * rather than by a slot in a schema. Same eleven photographs, one per hub, chosen so a hub never
 * shares a frame with the service directly under it where that can be helped.
 */
export const hubPhotos: Record<string, string> = {
  "wordpress-fix": "alert",
  "wordpress-security": "monitors",
  "wordpress-performance-migration": "racks",
  "wordpress-maintenance": "workspace",
  "wordpress-development": "terminal",
  woocommerce: "store",
};

/**
 * Where to hold the frame when a photograph is cropped. Every file is 16:10, and the hero box is
 * 4:5, so the crop keeps only the middle half of the width. These are the frames whose subject does
 * not sit in that middle half; anything absent is centred.
 */
export const photoFocus: Record<string, string> = {
  emergency: "object-left", // the laptop and the hands are left of centre; the centre is out-of-focus dark
  workspace: "object-center",
  store: "object-left",
};
