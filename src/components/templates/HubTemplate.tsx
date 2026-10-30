import { ClosingCta } from "@/components/sections/v3/ClosingCta";
import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import { Illustration } from "@/components/sections/v3/Photo";
import Link from "next/link";
import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { hubLead } from "@/content/hubs";
import type { IllustrationId } from "@/content/photos";
import { heroChips, jobSteps } from "@/content/notices";
import type { Service } from "@/content/schema";
import { bentoLayout } from "@/lib/bento";
import { cn } from "@/lib/utils";
import { Breadcrumbs, cardGrid, cardLink, GuideCard, h1, h2, HeroSplit, page, Section, StepRow, stretchedLink, TrustChips, UrgencyBadge } from "./parts";

/**
 * One illustration per hub, chosen for that hub's subject rather than reused across all six. Before this every
 * hub showed the same team scene, which said nothing about which hub you were on.
 *
 * Keyed by hub id and falling back, so a hub added to SITEMAP renders rather than failing on a missing key.
 */
const hubArt: Record<string, IllustrationId> = {
  "wordpress-fix": "browser-with-code",
  "wordpress-security": "shield-and-firewall",
  "wordpress-maintenance": "settings-and-gears",
  "wordpress-performance-migration": "metrics-and-team",
  "wordpress-development": "team-at-work",
  woocommerce: "working-at-laptop",
};

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
  const spans = bentoLayout(services.map(({ c }) => weight(c)));
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

      <HeroSplit art={<Illustration id={hubArt[id] ?? "team-at-work"} sizes="(min-width: 1024px) 40vw, 100vw" />}>
        <div>
          <h1 className={h1}>{node.title}</h1>
          <p className="mt-5 max-w-[68ch] text-lg text-muted">{hubLead[id]}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Primary location={`${loc}:hero`} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} className="btn-secondary" />
          </div>
          {/* Inside the hero, not its own section: see TrustChips in parts.tsx for why. */}
          <TrustChips items={heroChips} />
        </div>
      </HeroSplit>

      <Section id="services" revealBody={false} title={triage ? "Which of these is your site doing?" : "Pick the work that fits"}>
        <ul className="grid gap-4 md:grid-cols-6 md:gap-5">
          {services.map(({ node: n, s, c }, i) => (
            <li
              data-reveal
              key={s.id}
              className={cn(cardLink, "p-6", SPAN[spans[i] as keyof typeof SPAN])}
            >
              <h3 className="font-display text-lg leading-snug font-bold">
                {/* Stretched link: the whole card is the target, and the title is its accessible name. */}
                <Link href={n.path} className={cn("flex min-h-11 items-center justify-between gap-3", stretchedLink)}>
                  {n.title}
                  <ArrowUpRightIcon weight="duotone" className="mt-1 size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
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
        <Section id="guides" revealBody={false} title="Most urgent problems">
          {/* Ranked by Guide.urgency, most urgent first. The badge words carry the rank, so the order is not
              colour. Three equal columns, deliberately a different family from the span-varied symptom bento in
              the section above, and what distinguishes one card from the next is the urgency badge and the
              message the software prints. The banner this grid used to carry did not: `guideArt` resolved from
              the parent's hub, and every guide on a hub shares that hub, so all 26 cards under /wordpress-fix/
              drew the same picture. See GuideCard in parts.tsx. */}
          <ol className={cardGrid}>
            {topGuides.map((g, i) => (
              <GuideCard key={g.slug} guide={g} index={i} />
            ))}
          </ol>
          <p className="mt-3">
            <Link href={routes.guides} className={textLink}>
              Every error we have written up
            </Link>
          </p>
        </Section>
      )}

      {/* "What happens next", not the service page's "How this job runs": nothing has been chosen yet here. */}
      <Section id="whats-next" revealBody={false} title="What happens next">
        <StepRow steps={jobSteps} />
      </Section>

      <ClosingCta
        id="hub-closing"
        title="Not sure which one you need?"
        sub="Describe what your site is doing and an engineer will tell you which of these it is, before any work starts."
        intent={intent}
        location={`${loc}:closing`}
      />
    </article>
  );
}
