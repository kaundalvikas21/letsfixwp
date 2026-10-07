import type { Metadata } from "next";
import { nodeCrumbs } from "@/components/JsonLd";
import { h1, lead, pageWrap } from "@/components/sections/v1/page-kit";
import { Breadcrumbs } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { pageCopy } from "@/content/pages";
import { CheckForm } from "./CheckForm";

export const metadata: Metadata = {
  title: "Free WordPress Site Check",
  description: "Not an emergency? Ask for a free check of your WordPress site: updates, backups, security basics and speed.",
  alternates: { canonical: routes.check },
};

const c = pageCopy.freeCheck;

/** Lead Magnet + Form: benefit headline, preview of what the check covers, a minimal form, CHECK submit. */
export default function FreeSiteCheck() {
  return (
    <div className={`${pageWrap} pb-24`}>
      <Breadcrumbs items={nodeCrumbs(routes.check)} />
      <div className="grid gap-12 pt-8 md:pt-12 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-16">
        <div>
          <h1 className={h1}>{c.h1}</h1>
          <p className={`mt-5 ${lead}`}>{c.intro}</p>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
            {c.covers.map((x) => (
              <div key={x.title} className="bg-surface p-6">
                <dt className="font-mono text-[13px] text-accent-ink">{x.title}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-text">{x.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:pt-2">
          <CheckForm />
        </div>
      </div>
    </div>
  );
}
