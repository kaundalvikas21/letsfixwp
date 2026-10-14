import type { NextConfig } from "next";
import { unconfirmedBrandFields } from "./src/config/brand";
import { testimonials } from "./src/content/testimonials";
import { redirects } from "./src/config/redirects";

// Unconfirmed brand values (src/config/brand.ts) and placeholder quotes (src/content/testimonials.ts): loud warning
// on every build, hard failure on a production deploy.
const placeholders = testimonials.filter((t) => "placeholder" in t && t.placeholder).length;
const unconfirmed = [
  ...unconfirmedBrandFields,
  ...(placeholders ? [`${placeholders} placeholder testimonial(s) in src/content/testimonials.ts`] : []),
];
if (unconfirmed.length) {
  const msg = `Unconfirmed values:\n  - ${unconfirmed.join("\n  - ")}`;
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
