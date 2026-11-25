import type { MetadataRoute } from "next";
import { IS_PRODUCTION_HOST, SITE_URL } from "@/config/sitemap";

export default function robots(): MetadataRoute.Robots {
  // A staging or preview host asks for nothing to be crawled, and advertises no sitemap: its
  // sitemap.xml lists its own URLs, and pointing a crawler at them is the opposite of the intent.
  if (!IS_PRODUCTION_HOST) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
