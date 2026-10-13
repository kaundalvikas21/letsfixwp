import type { Metadata } from "next";
import Link from "next/link";
import { Finder, type FinderLabels } from "@/components/Finder";
import { nodeCrumbs } from "@/components/JsonLd";
import { Band, BandTitle, Breadcrumbs, CtaBand } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { guides, guidesFor, matchIndex, services } from "@/content";

export const metadata: Metadata = {
  title: "WordPress Error Guides",
  description: "Plain guides to specific WordPress errors: what you see, what causes it, what is safe to try, and when to call an engineer.",
  alternates: { canonical: routes.guides },
  openGraph: { title: "WordPress Error Guides", url: routes.guides, type: "website" },
};

// The persisted override (design-system/letsfixwp-v2/pages/guide.md) specifies the knowledge base as
// "Hero with search bar > Popular categories > ... > Contact/support CTA". The search bar is Finder,
// which moved here from the home page: ProblemDirectory's filter already covers that job there.
const labels: FinderLabels = {
  services: Object.fromEntries(services.map((s) => [s.id, { title: s.title, path: s.path }])),
  guides: Object.fromEntries(guides.map((g) => [g.slug, g.title])),
};

export default function GuidesIndex() {
  const groups = services.map((s) => ({ s, gs: guidesFor(s.id) })).filter((x) => x.gs.length);

  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(routes.guides)} />
        <h1 className="mt-8 max-w-[18ch] text-[clamp(2rem,4.2vw,3.25rem)]">Find the exact error you are seeing.</h1>
        <p className="mt-6 max-w-[54ch] text-lg text-muted">
          {guides.length} guides to specific WordPress errors. Each one lists what causes it, what is safe to try
          yourself, and when to stop and call an engineer.
        </p>
        <div className="mt-10">
          <Finder index={matchIndex} labels={labels} location="guides-index" />
        </div>
      </div>

      {/* One band for the whole directory: 16 full bands for groups of two or three guides
          left the page mostly air. The groups separate on a hairline instead. */}
      <Band labelledBy="all-guides">
        <BandTitle id="all-guides">Every guide, by what we fix</BandTitle>
        <div className="mt-8">
          {groups.map(({ s, gs }) => (
            <section key={s.id} aria-labelledby={`g-${s.id}`} className="border-t border-line py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 id={`g-${s.id}`} className="font-bold">
                  {s.title}
                </h3>
                <Link
                  href={s.path}
                  className="inline-flex min-h-11 items-center border-b border-muted text-sm text-muted transition-colors duration-200 hover:border-text hover:text-text"
                >
                  How we fix these
                </Link>
              </div>
              <ul className="mt-2 grid gap-x-10 sm:grid-cols-2">
                {gs.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={routes.guide(g.slug)}
                      className="flex min-h-11 items-center gap-2 py-1 text-[0.9375rem] text-muted transition-colors duration-200 hover:text-accent-text"
                    >
                      <span>{g.title}</span>
                      {g.urgency === "critical" && (
                        <span className="ml-auto font-mono text-xs text-accent-text">Critical</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Band>

      <CtaBand intent="BOOK" location="guides-index" title="Cannot find your error, or tried the safe checks already?" />
    </article>
  );
}
