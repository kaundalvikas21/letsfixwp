import type { Metadata } from "next";
import { ClientStories } from "@/components/sections/v4/ClientStories";
import { Faq } from "@/components/sections/v4/Faq";
import { FilmBand } from "@/components/sections/v4/FilmBand";
import { FinalCta } from "@/components/sections/v4/FinalCta";
import { ErrorStack } from "@/components/sections/v4/ErrorStack";
import { FixPan } from "@/components/sections/v4/FixPan";
import { Guarantee } from "@/components/sections/v4/Guarantee";
import { Hero } from "@/components/sections/v4/Hero";
import { Logos } from "@/components/sections/v4/Logos";
import { Plans } from "@/components/sections/v4/Plans";
import { Practices } from "@/components/sections/v4/Practices";
import { ProblemTiles } from "@/components/sections/v4/ProblemTiles";
import { Restored } from "@/components/sections/v4/Restored";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

/**
 * Emergency-first, and every section is v4: who we work on, the break, the fix, the list of problems,
 * the result, the three ways to work with us, the guarantee, what clients say, how we work and the ask.
 *
 * The order answers doubts where the visitor has them rather than telling the story in the order it
 * happens. Two moves, both argued in docs/layout-ledger.md under Task 55:
 *
 * `Logos` is second because "do you even work on what I run" is the first question someone has, and
 * the strip was sitting at 65% page depth, four screens after anyone decides whether this company is
 * real. `ClientStories` is ninth because "did this work for someone like me" is the question people
 * ask while they are reading what it costs, not while they are still working out which problem is
 * theirs. The two used to be one section, which gave the client-proof block a heading that named a
 * list of platforms.
 *
 * `Restored` now lands directly after the problem list, so the page shows the same site working again
 * before it hands over to quotes. With no confirmed client quotes yet, the real capture is the
 * stronger proof and goes first.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Logos />
      <ErrorStack />
      <FixPan />
      <ProblemTiles />
      <Restored />
      <FilmBand />
      <Plans />
      <Guarantee />
      <ClientStories />
      <Practices />
      <Faq />
      <FinalCta />
    </>
  );
}
