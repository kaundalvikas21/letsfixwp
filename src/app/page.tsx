import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { Finder, type FinderLabels } from "@/components/Finder";
import { SiteStatus } from "@/components/SiteStatus";
import { hubNodes, nodes, routes } from "@/config/routes";
import { guides, matchIndex, services } from "@/content";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Fixes, Care Plans and Development" },
  description: "WordPress site down, hacked or throwing errors? Pick your problem and book a fix, or chat with an engineer.",
  alternates: { canonical: routes.home },
};

const labels: FinderLabels = {
  services: Object.fromEntries(services.map((s) => [s.id, { title: s.title, path: s.path }])),
  guides: Object.fromEntries(guides.map((g) => [g.slug, g.title])),
};

/** Emergency-first: finder and fix CTAs lead; hubs follow in SITEMAP order (fixes before development). */
export default function Home() {
  const critical = guides.filter((g) => g.urgency === "critical").slice(0, 8);

  return (
    <>
      <section aria-labelledby="hero">
        <h1 id="hero">Your WordPress site is broken. Tell us what you see.</h1>
        <Finder index={matchIndex} labels={labels} location="home:hero" />
        <p>
          <BookLink location="home:hero" /> <ChatButton location="home:hero" />
        </p>
        <SiteStatus />
      </section>

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
