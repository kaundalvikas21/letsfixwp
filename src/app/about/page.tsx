import type { Metadata } from "next";
import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { primaryCtaFor } from "@/config/cta";
import { hubNodes, nodeByPath, routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "About",
  description: "WordPress engineers for sites that are down, hacked or slow, plus care plans and development.",
  alternates: { canonical: routes.about },
};

export default function About() {
  return (
    <>
      <Breadcrumbs items={nodeCrumbs(routes.about)} />
      <h1>About {brand.name}</h1>
      <p>We fix WordPress sites that are down, hacked or slow, look after them afterwards, and build new ones.</p>
      <ul>
        {hubNodes.map((h) => (
          <li key={h.path}>
            <Link href={h.path}>{h.title}</Link>
          </li>
        ))}
      </ul>
      <CtaPair intent={primaryCtaFor(nodeByPath.get(routes.about)?.intent)} location="about" />
    </>
  );
}
