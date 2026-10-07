import type { Metadata } from "next";
import { AfterYouBook } from "@/components/sections/v1/AfterYouBook";
import { DeskStatus } from "@/components/sections/v1/DeskStatus";
import { FinalCta } from "@/components/sections/v1/FinalCta";
import { GuaranteeSplit } from "@/components/sections/v1/GuaranteeSplit";
import { Hero } from "@/components/sections/v1/Hero";
import { ObjectionFaq } from "@/components/sections/v1/ObjectionFaq";
import { PlatformMarquee } from "@/components/sections/v1/PlatformMarquee";
import { PricingColumns } from "@/components/sections/v1/PricingColumns";
import { ProblemFinder } from "@/components/sections/v1/ProblemFinder";
import { QuotePair } from "@/components/sections/v1/QuotePair";
import { TrustBento } from "@/components/sections/v1/TrustBento";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

/** V1 home: emergency-first. Hubs and services are linked from the finder, the nav and the footer. */
export default function Home() {
  return (
    <>
      <Hero />
      <PlatformMarquee />
      <ProblemFinder />
      <AfterYouBook />
      <TrustBento />
      <DeskStatus />
      <PricingColumns />
      <QuotePair />
      <GuaranteeSplit />
      <ObjectionFaq />
      <FinalCta />
    </>
  );
}
