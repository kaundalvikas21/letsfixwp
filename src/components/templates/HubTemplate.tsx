import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { hubLead } from "@/content/hubs";
import type { Service } from "@/content/schema";
import { bentoSpans } from "@/lib/bento";
import { cn } from "@/lib/utils";
import { Breadcrumbs, h1, h2, page, Section, UrgencyBadge } from "./parts";

const urgencyRank = { critical: 0, high: 1, standard: 2 } as const;

// bentoSpans returns 2, 4 or 6, and a uniform hub uses 3; written out so Tailwind's scanner sees every class.
const SPAN = { 3: "md:col-span-3", 2: "md:col-span-2", 4: "md:col-span-4", 6: "md:col-span-6" } as const;

const textLink = "inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline";

// Fix services carry symptoms; every other intent has none (serviceSchema refine), so those cards fall back to
// the summary, whoItsFor and deliverables. `shown` is the one place that decides what a card renders, and the
// bento weights are measured from it, so a cell is sized by the text it actually holds.
const shown = (s: Service) =>
  s.symptoms.length
    ? { symptoms: s.symptoms.slice(0, 3), deliverables: [] as string[], body: "", who: "" }
    : { symptoms: [] as string[], deliverables: s.deliverables.slice(0, 3), body: s.summary, who: s.whoItsFor };
const weight = (c: ReturnType<typeof shown>) => [...c.symptoms, ...c.deliverables, c.body, c.who].join(" ").length;

/**
 * /<hub>/. Layout family: triage page. A text-only lead, a bento of symptom cards, then a
 * ranked urgent list, so none of it is the home bento, the home command palette or the service lead column.
 */
export function HubTemplate({ node }: { node: FlatNode }) {
  const id = hubIdOf(node.path);
  const children = nodes.filter((n) => n.parentPath === node.path);
  const serviceChildren = children.filter((n) => n.kind === "service");
  const otherChildren = children.filter((n) => n.kind !== "service");
  const services = serviceChildren.map((n) => {
    const s = getService(serviceIdOf(n.path))!;
    return { node: n, s, c: shown(s) };
  });
  // Near-equal cards give bentoSpans nothing to differentiate, so it would only invent wide cells the text cannot
  // fill. Below this max/min ratio the grid is a plain 2-up (two equal cards a row is allowed, rule 6 bans three).
  const weights = services.map(({ c }) => weight(c));
  const uniform = Math.max(...weights) <= Math.min(...weights) * 1.4;
  const spans = uniform ? weights.map(() => 3) : bentoSpans(weights);
  const triage = services.some(({ s }) => s.symptoms.length > 0);
  const topGuides = serviceChildren
    .flatMap((n) => guidesFor(serviceIdOf(n.path)))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, 6);
  const loc = `hub:${id}`;
  const intent = primaryCtaFor(node.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;

  return (
    <article className={cn(page, "py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(node.path)} />

      <header className="mt-6">
        <div>
          <h1 className={h1}>{node.title}</h1>
          <p className="mt-5 max-w-[68ch] text-lg text-muted">{hubLead[id]}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Primary location={`${loc}:hero`} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} className="btn-secondary" />
          </div>
        </div>
      </header>

      <Section id="services" title={triage ? "Which of these is your site doing?" : "Pick the work that fits"}>
        <ul className="grid gap-4 md:grid-cols-6 md:gap-5">
          {services.map(({ node: n, s, c }, i) => (
            <li
              key={s.id}
              className={cn(
                "group relative rounded-[20px] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-[0.98] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent motion-reduce:transition-none",
                SPAN[spans[i] as keyof typeof SPAN],
              )}
            >
              <h3 className="font-display text-lg leading-snug font-bold">
                {/* Stretched link: the whole card is the target, and the title is its accessible name. */}
                <Link href={n.path} className="flex min-h-11 items-center justify-between gap-3 supports-[selector(:has(*))]:outline-none after:absolute after:inset-0 after:rounded-[20px] group-hover:text-accent-text">
                  {n.title}
                  <CaretRightIcon weight="duotone" className="mt-1 size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </Link>
              </h3>
              {c.symptoms.length > 0 ? (
                <>
                  <p className="mt-3 text-sm font-semibold">You might see</p>
                  <ul className={cn("mt-1.5 space-y-1.5 text-sm text-muted", spans[i] === 6 && "md:grid md:grid-cols-3 md:gap-x-6 md:space-y-0")}>
                    {c.symptoms.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="mt-3 max-w-[68ch] text-sm">{c.body}</p>
                  <p className="mt-3 max-w-[68ch] text-sm text-muted">
                    <span className="font-semibold text-text">Who it is for </span>
                    {c.who}
                  </p>
                  <p className="mt-3 text-sm font-semibold">You get</p>
                  <ul className={cn("mt-1.5 space-y-1.5 text-sm text-muted", spans[i] === 6 && "md:grid md:grid-cols-3 md:gap-x-6 md:space-y-0")}>
                    {c.deliverables.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
        {otherChildren.map((n) => (
          <p key={n.path} className="mt-4">
            <Link href={n.path} className={textLink}>
              {n.title}
            </Link>
          </p>
        ))}
      </Section>

      {topGuides.length > 0 && (
        <Section id="guides" title="Most urgent problems">
          {/* Ranked by Guide.urgency, most urgent first. The badge words carry the rank, so the order is not colour. */}
          <ol className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface shadow-card">
            {topGuides.map((g) => (
              <li key={g.slug}>
                <Link href={routes.guide(g.slug)} className="group flex min-h-11 items-start gap-4 px-5 py-4 hover:bg-surface-2 sm:px-6">
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <UrgencyBadge level={g.urgency} />
                      <span className={cn("font-display text-lg leading-snug group-hover:text-accent-text", g.urgency === "critical" ? "font-extrabold" : "font-bold")}>
                        {g.title}
                      </span>
                    </span>
                    {g.errorText && (
                      <code className="mt-2 block max-w-[70ch] truncate rounded-[12px] bg-surface-2 px-3 py-1.5 font-mono text-xs">{g.errorText}</code>
                    )}
                    <span className="mt-2 block max-w-[70ch] text-sm text-muted">{g.symptoms[0]}</span>
                  </span>
                  <CaretRightIcon weight="duotone" className="mt-2 size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-3">
            <Link href={routes.guides} className={textLink}>
              Every error we have written up
            </Link>
          </p>
        </Section>
      )}

      <section aria-labelledby="hub-closing" className="mt-16 rounded-[20px] bg-surface-2 p-6 md:p-10">
        <h2 id="hub-closing" className={cn(h2, "max-w-[24ch]")}>
          Not sure which one is yours?
        </h2>
        <p className="mt-3 max-w-[56ch] text-muted">Tell us what your site is doing and we will point you to the right page.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Primary location={`${loc}:closing`} className="btn-primary" />
          <ChatButton location={`${loc}:closing`} className="btn-secondary" />
        </div>
      </section>
    </article>
  );
}
