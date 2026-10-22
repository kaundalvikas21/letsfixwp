import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import type { ProblemItem } from "@/components/sections/v3/ProblemSearch";
import { Breadcrumbs, h1, page } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { serviceForOldSlug } from "@/config/redirects";
import { nodeByPath, routes, serviceIds } from "@/config/routes";
import { getGuide, getService, matchIndex, services } from "@/content";
import { claimLine } from "@/content/notices";
import { cn } from "@/lib/utils";
import { BookingFlow } from "./BookingFlow";
import { ContactTabs } from "./ContactTabs";

export const metadata: Metadata = {
  title: "Contact and Emergency Ticket",
  description: "Book a WordPress fix, ask for a project quote, or chat with an engineer. Tell us what is wrong and which site it is on.",
  alternates: { canonical: routes.contact },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

// Every problem the matcher knows, labelled for the picker on the first screen.
const problems: ProblemItem[] = matchIndex.map((c) => {
  const svc = getService(c.serviceSlug)!;
  const guide = c.guideSlug ? getGuide(c.guideSlug) : undefined;
  return {
    ...c,
    title: guide?.title ?? svc.title,
    href: guide ? routes.guide(guide.slug) : svc.path,
    category: nodeByPath.get(routes.hub(svc.hub))!.title,
  };
});

const optionsFor = (kind: "fix" | "project") =>
  services.filter((s) => (kind === "project" ? s.intent !== "fix" : s.intent === "fix")).map((s) => ({ id: s.id, title: s.title }));

/** Hosts both flows. Reads routes.book() / routes.quote() params: service, guide, url, type. */
export default async function Contact({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const initialTab = one(sp.type) === "project" ? "project" : "fix";
  // `problem` is the foundation-era param on shared /app?problem=<old-slug> links.
  const requested = one(sp.service) || serviceForOldSlug(one(sp.problem)) || "";
  const service = serviceIds.includes(requested) ? requested : "";
  const guide = getGuide(one(sp.guide))?.slug ?? "";
  const url = one(sp.url).slice(0, 300);
  const initial = { service, guide, url };

  return (
    <div className={cn(page, "max-w-5xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.contact)} />

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h1 className={h1}>Tell us what your site is doing</h1>
          {/* brand.claims.fixedPrice: the second sentence is the shared claim copy, so it goes when the claim is off. */}
          <p className="mt-5 max-w-[46ch] text-lg text-muted">
            An engineer reads every ticket.{brand.claims.fixedPrice ? ` ${claimLine.fixedPrice}.` : ""}
          </p>
          <p className="mt-6 text-sm text-muted">
            Rather talk first? <ChatButton location="contact" service={service || undefined} />
          </p>
          <p className="mt-6 border-t border-line pt-6 text-sm text-muted">
            This form never asks for a password. Access is shared over a secure link after booking.
          </p>
          {!brand.email.includes("{{") && (
            <p className="mt-2 text-sm text-muted">
              Or email{" "}
              <a href={`mailto:${brand.email}`} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
                {brand.email}
              </a>
            </p>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[20px] border border-line bg-surface p-6 shadow-card md:p-8">
            <ContactTabs
              initial={initialTab}
              fix={<BookingFlow type="fix" options={optionsFor("fix")} problems={problems} initial={initial} />}
              project={<BookingFlow type="project" options={optionsFor("project")} problems={problems} initial={initial} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
