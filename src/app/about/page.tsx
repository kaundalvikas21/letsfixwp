import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { practiceIcons } from "@/components/sections/v3/Security";
import { Breadcrumbs, FactRail, h1, h2, LinkList, page, Section } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { cityNodes, hubIdOf, hubNodes, routes } from "@/config/routes";
import { hubLead } from "@/content/hubs";
import { citiesLead, remoteDelivery, securityPractice } from "@/content/notices";
import { bentoLayout } from "@/lib/bento";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "WordPress engineers for sites that are down, hacked or slow, plus care plans and development.",
  alternates: { canonical: routes.about },
};

// bentoLayout returns 3 for a uniform grid and 2, 4 or 6 for a varied one; written out so Tailwind sees them.
const SPAN = { 3: "md:col-span-3", 2: "md:col-span-2", 4: "md:col-span-4", 6: "md:col-span-6" } as const;

/**
 * /about/. A company page, not a team page: no person is named anywhere in the content, so nothing here
 * describes one. Layout: a document header, a bento of the six hubs with the whole `hubLead` paragraph, then a
 * body column carrying how an engagement runs, how access and data are handled and where clients are, with the
 * shared `FactRail` beside it. No photography, and no address or LocalBusiness anywhere: there is no office.
 */
export default function About() {
  const hubs = hubNodes.map((n) => ({ node: n, lead: hubLead[hubIdOf(n.path)] }));
  const spans = bentoLayout(hubs.map((h) => h.lead.length));

  return (
    <div className={cn(page, "py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.about)} />

      <header className="mt-6">
        <h1 className={h1}>About {brand.name}</h1>
        <p className="mt-5 max-w-[68ch] text-lg text-muted">
          We fix WordPress sites that are down, hacked or slow, look after them afterwards, and build new ones.
        </p>
      </header>

      <Section id="what-we-do" title="What we work on">
        <ul className="grid gap-4 md:grid-cols-6 md:gap-5">
          {hubs.map(({ node, lead }, i) => (
            <li
              key={node.path}
              className={cn(
                // Resting elevation is shadow-card; --shadow-lift is MASTER's hover shadow (MASTER.md:99,204).
                "group relative rounded-[20px] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-[0.98] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent motion-reduce:transition-none",
                SPAN[spans[i] as keyof typeof SPAN],
              )}
            >
              <h3 className="font-display text-lg leading-snug font-bold">
                {/* Stretched link: the whole card is the target, the title is its accessible name, and the
                    outline is only dropped where :has() can put the ring on the card instead. */}
                <Link
                  href={node.path}
                  className="flex min-h-11 items-center justify-between gap-3 supports-[selector(:has(*))]:outline-none after:absolute after:inset-0 after:rounded-[20px] group-hover:text-accent-text"
                >
                  {node.title}
                  <CaretRightIcon
                    weight="duotone"
                    className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden
                  />
                </Link>
              </h3>
              <p className="mt-2 max-w-[68ch] text-sm text-muted">{lead}</p>
            </li>
          ))}
        </ul>
      </Section>

      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          {/* Phase names, in the order the work happens. No numerals and no "Step 1" label (rule 6): rows, not
              three equal cards, which is also what keeps the card family to the bento above. */}
          <Section id="engagement" title="How an engagement runs" className="mt-0 md:mt-0">
            <ol className="divide-y divide-line border-y border-line">
              {remoteDelivery.map((r) => (
                <li key={r.label} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <span className="font-display text-sm font-bold tracking-wide text-accent-text">{r.label}</span>
                  <p className="max-w-[62ch] text-muted">{r.text}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* The same practice the home page shows, read from src/content/notices.ts, in this page's own shape. */}
          <Section id="practice" title="How we handle access and data">
            <div className="space-y-8">
              {securityPractice.map((g) => (
                <div key={g.group}>
                  <h3 className="font-display text-sm font-bold tracking-wide">{g.group}</h3>
                  <ul className="mt-3 grid gap-5 sm:grid-cols-2 sm:gap-x-8">
                    {g.items.map((it) => {
                      const Icon = practiceIcons[it.id];
                      return (
                        <li key={it.id} className="flex gap-3">
                          <Icon weight="duotone" className="mt-0.5 size-6 shrink-0 text-accent-text" aria-hidden />
                          <span>
                            <span className="block font-semibold">{it.title}</span>
                            <span className="mt-1 block text-sm text-muted">{it.text}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="coverage" title="Where our clients are">
            <p className="max-w-[68ch] text-muted">{citiesLead}</p>
            <div className="mt-5">
              <LinkList paths={cityNodes.map((c) => c.path)} />
            </div>
          </Section>
        </div>

        {/* The one rail (parts.tsx): the CTA pair beside the body from lg, and in flow below it with the
            guarantee and its placeholder disclosure. No claim points here, because the practice list above is
            the same promises in full and the rail would print them twice. */}
        <aside className="lg:col-span-4">
          <FactRail title={`Work with ${brand.name}`}>
            <BookLink location="about:rail" className="btn-primary w-full" />
            <ChatButton location="about:rail" className="btn-secondary w-full" />
          </FactRail>
        </aside>
      </div>

      <section
        aria-labelledby="about-closing"
        className="mt-16 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between"
      >
        <h2 id="about-closing" className={cn(h2, "max-w-[24ch]")}>
          Tell us what your site is doing
        </h2>
        <div className="flex shrink-0 flex-wrap gap-x-3 gap-y-3">
          <BookLink location="about:closing" className="btn-primary" />
          <ChatButton location="about:closing" className="btn-secondary" />
        </div>
      </section>
    </div>
  );
}
