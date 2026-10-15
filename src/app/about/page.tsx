import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, LinkRows, page, Section } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { hubIdOf, hubNodes, routes } from "@/config/routes";
import { hubLead } from "@/content/hubs";
import { remoteDelivery } from "@/content/notices";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "WordPress engineers for sites that are down, hacked or slow, plus care plans and development.",
  alternates: { canonical: routes.about },
};

export default function About() {
  return (
    <div className={cn(page, "max-w-3xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.about)} />
      <h1 className={cn(h1, "mt-6")}>About {brand.name}</h1>
      <p className="mt-5 max-w-[68ch] text-lg text-muted">
        We fix WordPress sites that are down, hacked or slow, look after them afterwards, and build new ones.
      </p>

      <Section id="what-we-do" title="What we work on">
        <LinkRows items={hubNodes.map((h) => ({ href: h.path, title: h.title, summary: hubLead[hubIdOf(h.path)] }))} />
      </Section>

      <Section id="how" title="How working with us runs">
        <dl className="grid gap-4 sm:grid-cols-3">
          {remoteDelivery.map((r) => (
            <div key={r.label} className="rounded-[14px] border border-line bg-surface p-5">
              <dt className="font-display text-sm font-bold tracking-wide text-accent-text">{r.label}</dt>
              <dd className="mt-1.5 text-sm">{r.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
        <BookLink location="about" className="btn-primary" />
        <ChatButton location="about" className="btn-secondary" />
      </div>
    </div>
  );
}
