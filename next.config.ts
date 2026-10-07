import type { NextConfig } from "next";
import { unconfirmedBrandFields } from "./src/config/brand";
import { redirects } from "./src/config/redirects";

// Unconfirmed brand values (src/config/brand.ts): loud warning on every build, hard failure on a production deploy.
if (unconfirmedBrandFields.length) {
  const msg = `Unconfirmed brand values in src/config/brand.ts:\n  - ${unconfirmedBrandFields.join("\n  - ")}`;
  if (process.env.VERCEL_ENV === "production" || process.env.BRAND_STRICT === "1") throw new Error(msg);
  console.warn(`\n\x1b[33m⚠ ${msg}\nA production deploy (VERCEL_ENV=production or BRAND_STRICT=1) will fail until they are confirmed.\x1b[0m\n`);
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    // Every quality a component passes must be listed, or /_next/image answers that request with a 400 and the
    // prop is silently dropped. 35: decorative layers. 55: the hero backdrop. 65: the service and step
    // photographs. 75: Next's default, used everywhere else.
    qualities: [35, 55, 65, 75],
    // No remotePatterns on purpose. Every image is a local file now (docs/image-credits.md), and an allowed
    // remote host would leave the optimiser able to fetch and serve arbitrary images from it.
  },
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
