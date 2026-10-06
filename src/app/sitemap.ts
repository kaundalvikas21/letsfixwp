import type { MetadataRoute } from "next";
import { nodes, routes } from "@/config/routes";
import { SITE_URL } from "@/config/sitemap";
import { compares, guides } from "@/content";

// Every SITEMAP node plus the guide and compare collections. Utility routes (legal, thanks) are noindex and stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...nodes.map((n) => n.path),
    ...guides.map((g) => routes.guide(g.slug)),
    ...compares.map((c) => routes.compare(c.slug)),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
