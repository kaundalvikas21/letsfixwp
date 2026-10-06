import type { NextConfig } from "next";
import { legacyProblems } from "./src/content/problems";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Problems with a live legacy URL: the legacy URL is canonical, /fix/<slug> points at it.
      ...legacyProblems.map((p) => ({
        source: `/fix/${p.slug}`,
        destination: `/${p.legacySlug}`,
        permanent: true,
      })),
      // Other live URLs from the audit (docs/audit.md) mapped onto the new IA.
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/testimonials/page/:n", destination: "/testimonials", permanent: true },
      { source: "/tos", destination: "/legal/terms", permanent: true },
      { source: "/privacy-policy", destination: "/legal/privacy", permanent: true },
      { source: "/wordpress-support-request", destination: "/app", permanent: true },
      { source: "/fix-wordpress-services", destination: "/fix", permanent: true },
      { source: "/wordpress-optimization", destination: "/fix/slow-wordpress-site", permanent: true },
    ];
  },
};

export default nextConfig;
