import { FolderOpen } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { h1, pageWrap } from "@/components/sections/v1/page-kit";
import { Breadcrumbs } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { pageCopy } from "@/content/pages";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Write-ups of WordPress sites we have repaired, secured and built.",
  alternates: { canonical: routes.reviews },
};

const c = pageCopy.caseStudies;

/** Real case files only. None exist yet, so a composed empty state with CHAT. */
export default function CaseStudies() {
  return (
    <div className={`${pageWrap} pb-24`}>
      <Breadcrumbs items={nodeCrumbs(routes.reviews)} />
      <h1 className={`pt-8 md:pt-12 ${h1}`}>{c.h1}</h1>
      <div className="mt-12 flex flex-col items-start gap-5 rounded-card border border-dashed border-line bg-surface p-8 md:p-12">
        <FolderOpen size={32} aria-hidden className="text-muted" />
        <p className="max-w-[52ch] text-lg leading-relaxed text-text">{c.empty}</p>
        <p className="max-w-[52ch] text-[16px] leading-relaxed text-muted">{c.chat}</p>
        <ChatButton location="case-studies:empty" />
      </div>
    </div>
  );
}
