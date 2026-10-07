import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { CtaBand, h1, h2, lead, pageWrap } from "@/components/sections/v1/page-kit";
import { Breadcrumbs, LinkList } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { guidesFor, services } from "@/content";

export const metadata: Metadata = {
  title: "WordPress Error Guides",
  description: "Plain guides to specific WordPress errors: what you see, what causes it, what is safe to try, and when to call an engineer.",
  alternates: { canonical: routes.guides },
};

const rank = { critical: 0, high: 1, standard: 2 } as const;

/** Knowledge base index. Layout family: grouped directory, one block per parent service. */
export default function GuidesIndex() {
  const groups = services.map((s) => ({ s, gs: guidesFor(s.id) })).filter((x) => x.gs.length);
  const total = groups.reduce((n, g) => n + g.gs.length, 0);

  return (
    <>
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(routes.guides)} />
        <header className="pt-8 md:pt-12">
          <h1 className={h1}>Knowledge Base</h1>
          <p className={`mt-5 ${lead}`}>
            Find the exact error you see. Each guide lists what causes it, what is safe to try, and when to call an engineer.
          </p>
          <p className="mt-4 font-mono text-[13px] text-muted">
            {total} guides across {groups.length} services
          </p>
        </header>

        <div className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {groups.map(({ s, gs }) => (
            <section key={s.id} aria-labelledby={`g-${s.id}`}>
              <h2 id={`g-${s.id}`} className={`${h2} text-xl md:text-2xl`}>
                <Link href={s.path} className="hover:underline">
                  {s.title}
                </Link>
              </h2>
              <div className="mt-5">
                <LinkList
                  items={[...gs]
                    .sort((a, b) => rank[a.urgency] - rank[b.urgency])
                    .map((g) => ({ href: routes.guide(g.slug), title: g.title, meta: g.errorText }))}
                />
              </div>
            </section>
          ))}
        </div>
      </div>

      <CtaBand line="Cannot find your error? Describe what you see and an engineer will name it.">
        <div className="flex flex-wrap justify-center gap-2">
          <BookLink location="guides-index" />
          <ChatButton location="guides-index" />
          <CheckLink location="guides-index" />
        </div>
      </CtaBand>
    </>
  );
}
