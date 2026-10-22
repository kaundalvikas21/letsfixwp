import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, FactRail, h1, h2, LinkList, page, practiceIcons, Section } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { cityNodes, hubIdOf, hubNodes, routes } from "@/config/routes";
import { hubLead } from "@/content/hubs";
import { citiesLead, remoteDelivery, securityPractice } from "@/content/notices";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "WordPress engineers for sites that are down, hacked or slow, plus care plans and development.",
  alternates: { canonical: routes.about },
};

/**
 * Contract rule 4 caps supporting copy at 25 words and every `hubLead` runs 36 to 46, so a card carries the
 * hub's first sentence that fits the cap. Measured on the six real paragraphs: 20, 23, 13, 11, 14 and 22 words,
 * which is the first sentence for four hubs and the second for the two whose openers run 26 and 33. A hub whose
 * sentences are all over the cap falls back to its opener, which is the loudest way to show it needs rewriting.
 */
const cardLine = (lead: string) => {
  const sentences = lead.split(/(?<=\.)\s+/);
  return sentences.find((x) => x.trim().split(/\s+/).length <= 25) ?? sentences[0];
};

/**
 * /about/. A company page, not a team page: no person is named anywhere in the content, so nothing here
 * describes one. Layout: a document header, the six hubs as uniform cards two a row, then a body column
 * carrying how an engagement runs, how access and data are handled and where the work happens, with the shared
 * `FactRail` beside it from lg. No photography, and no address or LocalBusiness anywhere: there is no office.
 */
export default function About() {
  const hubs = hubNodes.map((n) => ({ node: n, lead: cardLine(hubLead[hubIdOf(n.path)]) }));

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
        {/* Two a row, which rule 6 allows; it bans three. Not a bento: `bentoLayout` reads 2.10 on the six card
            lines and returns (2,4) (4,2) (2,4), but built and measured that leaves every 4-span cell half empty
            (the longest line is 23 words) and squeezes a 33-character title onto three lines in the 227px cell
            at 768. Uniform cards are the shape it returns for the untrimmed paragraphs anyway, and the guides
            index made the same call for the same reason. */}
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {hubs.map(({ node, lead }) => (
            <li
              key={node.path}
              // Resting elevation is shadow-card; --shadow-lift is MASTER's hover shadow (MASTER.md:99,204).
              className="group relative rounded-[20px] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-[0.98] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent motion-reduce:transition-none"
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
              three equal cards, which is also what keeps the card family to the hub grid above. */}
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

          <Section id="coverage" title="Where we work">
            <p className="max-w-[68ch] text-muted">{citiesLead}</p>
            <div className="mt-5">
              <LinkList paths={cityNodes.map((c) => c.path)} />
            </div>
          </Section>
        </div>

        {/* The one rail (parts.tsx), beside the body from lg only. It carries no claim `points`, because the
            practice list above is the same promises in full, which leaves the guarantee as its whole body; and
            while brand.guarantee is a placeholder, a lone card of placeholder text is worse on a narrow screen
            than no card, where the fixed bottom bar is already the CTA and the footer already links the
            guarantee page. It comes back below lg by deleting `hidden` once that guarantee is real. */}
        <aside className="hidden lg:col-span-4 lg:block">
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
