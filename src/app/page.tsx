import type { Metadata } from "next";
import Link from "next/link";
import { AfterYouBook } from "@/components/sections/v1/AfterYouBook";
import { DeskStatus } from "@/components/sections/v1/DeskStatus";
import { GuaranteeSplit } from "@/components/sections/v1/GuaranteeSplit";
import { Hero } from "@/components/sections/v1/Hero";
import { PlatformMarquee } from "@/components/sections/v1/PlatformMarquee";
import { PricingColumns } from "@/components/sections/v1/PricingColumns";
import { ProblemFinder } from "@/components/sections/v1/ProblemFinder";
import { QuotePair } from "@/components/sections/v1/QuotePair";
import { TrustBento } from "@/components/sections/v1/TrustBento";
import { hubNodes, nodes, routes } from "@/config/routes";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

/** Emergency-first: the V1 hero (live triage) leads; hubs follow in SITEMAP order (fixes before development). */
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

      <section aria-labelledby="hubs">
        <h2 id="hubs">What we do</h2>
        {hubNodes.map((h) => (
          <section key={h.path} aria-labelledby={`hub-${h.path}`}>
            <h3 id={`hub-${h.path}`}>
              <Link href={h.path}>{h.title}</Link>
            </h3>
            <ul>
              {nodes
                .filter((n) => n.parentPath === h.path && n.kind === "service")
                .map((n) => (
                  <li key={n.path}>
                    <Link href={n.path}>{n.title}</Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </section>
    </>
  );
}
