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
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
