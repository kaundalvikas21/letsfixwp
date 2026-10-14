import type { Metadata } from "next";
import { Bento } from "@/components/sections/v3/Bento";
import { Faq } from "@/components/sections/v3/Faq";
import { FinalCta } from "@/components/sections/v3/FinalCta";
import { GuaranteeCard } from "@/components/sections/v3/GuaranteeCard";
import { Hero } from "@/components/sections/v3/Hero";
import { LogoGrid } from "@/components/sections/v3/LogoGrid";
import { PlanCompare } from "@/components/sections/v3/PlanCompare";
import { Pricing } from "@/components/sections/v3/Pricing";
import { Quotes } from "@/components/sections/v3/Quotes";
import { Security } from "@/components/sections/v3/Security";
import { Steps } from "@/components/sections/v3/Steps";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

/** Emergency-first: the hero and the bento lead, and every section below is a v3 section. */
export default function Home() {
  return (
    <>
      <Hero />
      <LogoGrid />
      <Bento />
      <Steps />
      <PlanCompare />
      <Pricing />
      <Quotes />
      <Security />
      <GuaranteeCard />
      <Faq />
      <FinalCta />
    </>
  );
}
