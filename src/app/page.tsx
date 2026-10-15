import type { Metadata } from "next";
import { Faq } from "@/components/sections/v4/Faq";
import { FinalCta } from "@/components/sections/v4/FinalCta";
import { ErrorStack } from "@/components/sections/v4/ErrorStack";
import { FixPan } from "@/components/sections/v4/FixPan";
import { Guarantee } from "@/components/sections/v4/Guarantee";
import { Hero } from "@/components/sections/v4/Hero";
import { Plans } from "@/components/sections/v4/Plans";
import { Practices } from "@/components/sections/v4/Practices";
import { ProblemTiles } from "@/components/sections/v4/ProblemTiles";
import { Proof } from "@/components/sections/v4/Proof";
import { Restored } from "@/components/sections/v4/Restored";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

/** Emergency-first, and every section is v4: the break, the fix, the list of problems, proof, the
 *  result, the three ways to work with us, the guarantee, how we work and the ask. */
export default function Home() {
  return (
    <>
      <Hero />
      <ErrorStack />
      <FixPan />
      <ProblemTiles />
      <Proof />
      <Restored />
      <Plans />
      <Guarantee />
      <Practices />
      <Faq />
      <FinalCta />
    </>
  );
}
