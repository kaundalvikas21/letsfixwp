import type { Metadata } from "next";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/templates/parts";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Write-ups of WordPress sites we have repaired, secured and built.",
  alternates: { canonical: routes.reviews },
};

export default function CaseStudies() {
  return (
    <>
      <Breadcrumbs items={nodeCrumbs(routes.reviews)} />
      <h1>Case studies</h1>
      {/* Real case files only. None exist yet: src/content/testimonials.ts holds placeholders, not quotes. */}
      <p>No case studies are published yet. We add them once clients approve the write-up.</p>
      <CtaPair intent={primaryCtaFor(nodeByPath.get(routes.reviews)?.intent)} location="case-studies" />
    </>
  );
}
