import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { FixSearch } from "@/components/FixSearch";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { problemSummaries } from "@/content/problems";

export const metadata: Metadata = {
  title: "WordPress Problems We Fix",
  description:
    "Search every WordPress problem we repair: site down, hacked, plugin and theme errors, login lockouts, slow sites, WooCommerce and email failures.",
  alternates: { canonical: "/fix" },
};

export default function FixIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "WordPress problems", path: "/fix" },
        ])}
      />
      <h1>WordPress problems we fix</h1>
      <p>Search by what you see on screen, or filter by category.</p>
      <FixSearch problems={problemSummaries} />
      <p>
        Not listed? <BookLink location="fix-index" /> <ChatButton location="fix-index" />
      </p>
    </>
  );
}
