import { NotePencilIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, page } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Write-ups of WordPress sites we have repaired, secured and built.",
  alternates: { canonical: routes.reviews },
};

export default function CaseStudies() {
  return (
    <div className={cn(page, "max-w-3xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.reviews)} />
      <h1 className={cn(h1, "mt-6")}>Case studies</h1>

      {/* Real case files only. None exist yet: src/content/testimonials.ts holds placeholders, not quotes. */}
      <div data-reveal className="mt-8 rounded-[20px] border border-dashed border-line-strong bg-surface p-8 text-center md:p-12">
        <NotePencilIcon weight="duotone" className="mx-auto size-10 text-muted" aria-hidden />
        <p className="mt-5 font-display text-xl font-bold">No case studies are published yet</p>
        <p className="mx-auto mt-3 max-w-[48ch] text-muted">
          We add them once clients approve the write-up. Until then, the guides set out how each kind of problem gets fixed, step by step.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <BookLink location="case-studies" className="btn-primary" />
          <ChatButton location="case-studies" className="btn-secondary" />
        </div>
        <p className="mt-6 text-sm text-muted">
          <Link href={routes.guides} className="underline underline-offset-4 hover:no-underline">
            Read the guides instead
          </Link>
        </p>
      </div>
    </div>
  );
}
