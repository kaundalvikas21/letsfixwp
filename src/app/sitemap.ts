import type { MetadataRoute } from "next";
import { problemPath, problems } from "@/content/problems";
import { site } from "@/content/site";

// Legal pages are noindex, so they stay out. Problem URLs use their canonical (legacy-aware) path.
const pages = ["/", "/fix", "/app", "/pricing", "/wordpress-maintenance-services", "/testimonials", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...pages, ...problems.map(problemPath)].map((path) => ({ url: `${site.url}${path}` }));
}
