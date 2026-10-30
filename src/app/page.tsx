import type { Metadata } from "next";
import { Bento } from "@/components/sections/v3/Bento";
import { Boundaries } from "@/components/sections/v3/Boundaries";
import { Faq } from "@/components/sections/v3/Faq";
import { FinalCta } from "@/components/sections/v3/FinalCta";
import { GuaranteeCard } from "@/components/sections/v3/GuaranteeCard";
import { Hero } from "@/components/sections/v3/Hero";
import { PlanCompare } from "@/components/sections/v3/PlanCompare";
import { Pricing } from "@/components/sections/v3/Pricing";
import { Security } from "@/components/sections/v3/Security";
import { Steps } from "@/components/sections/v3/Steps";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

/**
 * Emergency-first, in the order the three reviewed competitors all use (docs/layout-ledger.md, v3/home): the
 * problem catalogue right after the hero, the process before any ask, and the care plan only after the price it
 * upsells. Every section is a v3 section.
 *
 * LogoGrid and Quotes are deliberately not here. A tech-stack grid was the weakest thing that could hold slot 2,
 * and src/content/testimonials.ts is still two marked placeholders, so the quote masonry rendered placeholder
 * cards above the price. Both files stay put: Quotes goes back in before Pricing the day two real quotes exist.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Bento />
      <Steps />
      <Pricing />
      <PlanCompare />
      <Security />
      <Boundaries />
      <GuaranteeCard />
      <Faq />
      <FinalCta />
    </>
  );
}
