import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { h1, pageWrap } from "@/components/sections/v1/page-kit";
import { Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { serviceForOldSlug } from "@/config/redirects";
import { routes, serviceIds } from "@/config/routes";
import { getGuide, guides, matchIndex, services } from "@/content";
import { pageCopy } from "@/content/pages";
import { handoffLabel } from "@/lib/booking";
import { matchKey } from "@/lib/match-problem";
import { ContactTabs } from "./ContactTabs";
import { EnquiryForm } from "./EnquiryForm";
import { type ProblemOption, TicketFlow } from "./TicketFlow";

export const metadata: Metadata = {
  title: "Contact and Emergency Ticket",
  description: "Open an emergency ticket for a broken WordPress site, or send a project enquiry. Chat with an engineer any time.",
  alternates: { canonical: routes.contact },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const rank = { critical: 0, high: 1, standard: 2 } as const;

// Every guide and fix service as a pickable problem; the matcher keys line up with matchIndex.
const options: ProblemOption[] = [
  ...guides.map((g) => ({ key: matchKey({ serviceSlug: g.parentService, guideSlug: g.slug }), title: g.title, service: g.parentService, guide: g.slug, errorText: g.errorText })),
  ...services.filter((s) => s.intent === "fix").map((s) => ({ key: matchKey({ serviceSlug: s.id }), title: s.title, service: s.id })),
];
const common = [...guides]
  .sort((a, b) => rank[a.urgency] - rank[b.urgency])
  .slice(0, 6)
  .map((g) => matchKey({ serviceSlug: g.parentService, guideSlug: g.slug }));
const prices = Object.fromEntries(services.map((s) => [s.id, s.priceFrom]));
const projectOptions = services.filter((s) => s.intent !== "fix").map((s) => ({ id: s.id, title: s.title }));

/** routes.book() lands on the Emergency ticket tab; routes.quote() (type=project) on the Project enquiry tab. */
export default async function Contact({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const type = one(sp.type) === "project" ? "project" : "ticket";
  // `problem` is the foundation-era param on shared /app?problem=<old-slug> links.
  const requested = one(sp.service) || serviceForOldSlug(one(sp.problem)) || "";
  const service = serviceIds.includes(requested) ? requested : "";
  const guide = getGuide(one(sp.guide))?.slug ?? "";
  const url = one(sp.url).slice(0, 300);

  return (
    <div className={`${pageWrap} pb-24`}>
      <Breadcrumbs items={nodeCrumbs(routes.contact)} />
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <div className="min-w-0">
          <h1 className={`pt-8 md:pt-12 ${h1}`}>{pageCopy.booking.h1}</h1>
          <ContactTabs
            initial={type}
            ticket={
              <TicketFlow
                initial={{ service: type === "ticket" ? service : "", guide: type === "ticket" ? guide : "", url }}
                options={options}
                index={matchIndex}
                common={common}
                prices={prices}
                handoffLabel={handoffLabel()}
              />
            }
            project={<EnquiryForm options={projectOptions} initialService={type === "project" && projectOptions.some((o) => o.id === service) ? service : ""} />}
          />
        </div>
        <aside aria-label="Other ways to reach us" className="mt-12 lg:mt-36">
          <div className="rounded-card border border-line bg-surface p-6 shadow-card lg:sticky lg:top-24">
            <ChatButton location="contact:aside" className="w-full" />
            <p className="mt-4 text-[14px] text-muted">
              <a href={`mailto:${brand.email}`} className="inline-flex min-h-11 items-center text-text underline-offset-4 hover:underline">
                {brand.email}
              </a>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
