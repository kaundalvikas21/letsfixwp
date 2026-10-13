import type { Metadata } from "next";
import { CaseFile } from "@/components/sections/v2-swiss-precision/CaseFile";
import { ClosingCta } from "@/components/sections/v2-swiss-precision/ClosingCta";
import { ComparisonMatrix } from "@/components/sections/v2-swiss-precision/ComparisonMatrix";
import { FactStrip } from "@/components/sections/v2-swiss-precision/FactStrip";
import { Faq } from "@/components/sections/v2-swiss-precision/Faq";
import { Hero } from "@/components/sections/v2-swiss-precision/Hero";
import { HowItWorks } from "@/components/sections/v2-swiss-precision/HowItWorks";
import { PricingRows } from "@/components/sections/v2-swiss-precision/PricingRows";
import { ProblemDirectory } from "@/components/sections/v2-swiss-precision/ProblemDirectory";
import { Quotes } from "@/components/sections/v2-swiss-precision/Quotes";
import { Safeguards } from "@/components/sections/v2-swiss-precision/Safeguards";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

// Emergency-first. The problem finder and the hub list that used to sit at the bottom of this page
// were foundation leftovers, duplicated by ProblemDirectory and by the header panel plus the footer.
// Finder now lives on /guides/, where the page override asks for a search bar.
export default function Home() {
  return (
    <>
      <Hero />
      <FactStrip />
      <ProblemDirectory />
      <HowItWorks />
      <ComparisonMatrix />
      <CaseFile />
      <PricingRows />
      <Quotes />
      <Safeguards />
      <Faq />
      <ClosingCta />
    </>
  );
}
