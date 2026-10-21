import {
  ArrowsClockwiseIcon,
  CaretRightIcon,
  CodeIcon,
  GaugeIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";
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

// bentoSpans only returns these three; written out so Tailwind's scanner sees every class.
const SPAN = { 2: "md:col-span-2", 4: "md:col-span-4", 6: "md:col-span-6" } as const;

const hubIcons = {
  "wordpress-fix": WrenchIcon,
  "wordpress-security": ShieldCheckIcon,
  "wordpress-performance-migration": GaugeIcon,
  "wordpress-maintenance": ArrowsClockwiseIcon,
  "wordpress-development": CodeIcon,
  woocommerce: ShoppingCartIcon,
} as const;

const textLink = "inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline";

// Fix services carry symptoms; every other intent has none (serviceSchema refine), so those cards fall back to
// the summary plus whoItsFor. Both shapes are real content fields.
const cardWeight = (s: Service) => (s.symptoms.length ? s.symptoms.slice(0, 3).join(" ") : s.summary + s.whoItsFor).length;

/**
 * /<hub>/. Layout family: triage page. A typographic index panel beside the lead, a bento of symptom cards, then a
 * ranked urgent list, so none of it is the home bento, the home command palette or the service lead column.
 */
export function HubTemplate({ node }: { node: FlatNode }) {
  const id = hubIdOf(node.path);
  const children = nodes.filter((n) => n.parentPath === node.path);
  const serviceChildren = children.filter((n) => n.kind === "service");
  const otherChildren = children.filter((n) => n.kind !== "service");
  const services = serviceChildren.map((n) => ({ node: n, s: getService(serviceIdOf(n.path))! }));
  const spans = bentoSpans(services.map(({ s }) => cardWeight(s)));
  const triage = services.some(({ s }) => s.symptoms.length > 0);
  const topGuides = serviceChildren
    .flatMap((n) => guidesFor(serviceIdOf(n.path)))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, 6);
  const Icon = hubIcons[id as keyof typeof hubIcons] ?? WrenchIcon;
  const loc = `hub:${id}`;
  const intent = primaryCtaFor(node.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;

  return (
    <article className={cn(page, "py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(node.path)} />

      <header className="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className={h1}>{node.title}</h1>
          <p className="mt-5 max-w-[68ch] text-lg text-muted">{hubLead[id]}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Primary location={`${loc}:hero`} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} className="btn-secondary" />
          </div>
        </div>
        {/* Typographic index panel: the hub's own service titles set large. It repeats the grid below, so it is
            hidden from assistive tech rather than read twice. No photograph: the shared pool is dark and reused. */}
        <div aria-hidden className="lg:col-span-5">
          <div className="rounded-[20px] bg-accent-tint p-6 shadow-card motion-safe:animate-[settle_600ms_var(--ease-spring)_both] md:p-8">
            <Icon weight="duotone" className="size-12 text-accent-text" />
            <ul className="mt-6 divide-y divide-line-strong/30">
              {services.slice(0, 4).map(({ s }) => (
                <li key={s.id} className="py-3 font-display text-xl leading-snug font-bold text-balance first:pt-0 last:pb-0">
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <Section id="services" title={triage ? "Which of these is your site doing?" : "Pick the work that fits"}>
        <ul className="grid gap-4 md:grid-cols-6 md:gap-5">
          {services.map(({ node: n, s }, i) => (
            <li
              key={s.id}
              className={cn(
                "group relative rounded-[20px] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-[0.98] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent motion-reduce:transition-none",
                SPAN[spans[i] as keyof typeof SPAN],
              )}
            >
              <h3 className="font-display text-lg leading-snug font-bold">
                {/* Stretched link: the whole card is the target, and the title is its accessible name. */}
                <Link href={n.path} className="flex min-h-11 items-center justify-between gap-3 outline-none after:absolute after:inset-0 after:rounded-[20px] group-hover:text-accent-text">
                  {n.title}
                  <CaretRightIcon weight="duotone" className="mt-1 size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </Link>
              </h3>
              {s.symptoms.length > 0 ? (
                <>
                  <p className="mt-3 text-sm font-semibold">You might see</p>
                  <ul className="mt-1.5 space-y-1.5 text-sm text-muted">
                    {s.symptoms.slice(0, 3).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="mt-3 max-w-[56ch] text-sm">{s.summary}</p>
                  <p className="mt-3 max-w-[56ch] text-sm text-muted">
                    <span className="font-semibold text-text">Who it is for </span>
                    {s.whoItsFor}
                  </p>
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
        <div className="mt-6">
          <ChatButton location={`${loc}:closing`} className="btn-primary" />
        </div>
      </section>
    </article>
  );
}
