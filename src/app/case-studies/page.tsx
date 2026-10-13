import type { Metadata } from "next";
import Link from "next/link";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Band, BandTitle, Breadcrumbs } from "@/components/templates/parts";
import { routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Write-ups of WordPress sites we have repaired, secured and built.",
  alternates: { canonical: routes.reviews },
  openGraph: { title: "Case Studies", url: routes.reviews, type: "website" },
};

// Real case files only. None exist yet: src/content/testimonials.ts holds placeholders, not quotes,
// and the two that used to be here belonged to fixmywp.com. A composed empty state, not a fake one.
export default function CaseStudies() {
  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(routes.reviews)} />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">Case studies</h1>
      </div>

      <Band labelledBy="empty">
        <BandTitle id="empty">Nothing published yet.</BandTitle>
        <p className="mt-6 max-w-[58ch] text-muted">
          We publish a repair only once the client has read the write-up and agreed to it being public. None have been
          cleared yet, so this page is empty rather than filled with work we cannot name.
        </p>
        <p className="mt-6 max-w-[58ch] text-muted">
          If you want to know whether we have handled something like your problem, ask an engineer directly. You will get
          a straight answer about what is comparable and what is not.
        </p>
        <p className="mt-8 flex flex-wrap items-center gap-2">
          <ChatButton location="case-studies" className="btn-primary" />
        </p>
        <p className="mt-8 text-[0.9375rem] text-muted">
          In the meantime, the{" "}
          <Link href={routes.guides} className="border-b border-muted transition-colors duration-200 hover:text-accent-text">
            knowledge base
          </Link>{" "}
          shows how we approach each error.
        </p>
      </Band>
    </article>
  );
}
