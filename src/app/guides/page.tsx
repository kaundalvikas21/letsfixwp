import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, page, Section } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { guidesFor, services } from "@/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WordPress Error Guides",
  description: "Plain guides to specific WordPress errors: what you see, what causes it, what is safe to try, and when to call an engineer.",
  alternates: { canonical: routes.guides },
};

export default function GuidesIndex() {
  const groups = services.map((s) => ({ s, gs: guidesFor(s.id) })).filter((x) => x.gs.length);
  return (
    <div className={cn(page, "max-w-4xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.guides)} />
      <h1 className={cn(h1, "mt-6")}>Knowledge Base</h1>
      <p className="mt-5 max-w-[68ch] text-lg text-muted">Find the exact error you see. Each guide lists safe checks and links to the fix.</p>

      {groups.map(({ s, gs }) => (
        <Section key={s.id} id={`g-${s.id}`} title={s.title}>
          <ul className="grid gap-2 sm:grid-cols-2">
            {gs.map((g) => (
              <li key={g.slug}>
                <Link href={routes.guide(g.slug)} className="flex h-full items-center rounded-[14px] border border-line bg-surface px-5 py-3 text-sm font-medium hover:text-accent-text">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            <Link href={s.path} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
              How we fix these: {s.title}
            </Link>
          </p>
        </Section>
      ))}

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
        <BookLink location="guides-index" className="btn-primary" />
        <ChatButton location="guides-index" className="btn-secondary" />
      </div>
      <p className="mt-4 text-sm text-muted">
        Nothing down right now? <CheckLink location="guides-index" />
      </p>
    </div>
  );
}
