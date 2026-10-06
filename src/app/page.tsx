import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections/v1/Hero";
import { hubNodes, nodes, routes } from "@/config/routes";
import { guides } from "@/content";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

/** Emergency-first: the V1 hero (live triage) leads; hubs follow in SITEMAP order (fixes before development). */
export default function Home() {
  const critical = guides.filter((g) => g.urgency === "critical").slice(0, 8);

  return (
    <>
      <Hero />

      <section aria-labelledby="critical">
        <h2 id="critical">Site down or hacked right now</h2>
        <ul>
          {critical.map((g) => (
            <li key={g.slug}>
              <Link href={routes.guide(g.slug)}>{g.title}</Link>
            </li>
          ))}
        </ul>
      </section>

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
