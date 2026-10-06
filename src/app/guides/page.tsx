import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { Breadcrumbs } from "@/components/templates/parts";
import { nodeCrumbs } from "@/components/JsonLd";
import { routes } from "@/config/routes";
import { guidesFor, services } from "@/content";

export const metadata: Metadata = {
  title: "WordPress Error Guides",
  description: "Plain guides to specific WordPress errors: what you see, what causes it, what is safe to try, and when to call an engineer.",
  alternates: { canonical: routes.guides },
};

export default function GuidesIndex() {
  const groups = services.map((s) => ({ s, gs: guidesFor(s.id) })).filter((x) => x.gs.length);
  return (
    <>
      <Breadcrumbs items={nodeCrumbs(routes.guides)} />
      <h1>Knowledge Base</h1>
      <p>Find the exact error you see. Each guide lists safe checks and links to the fix.</p>
      {groups.map(({ s, gs }) => (
        <section key={s.id} aria-labelledby={`g-${s.id}`}>
          <h2 id={`g-${s.id}`}>
            <Link href={s.path}>{s.title}</Link>
          </h2>
          <ul>
            {gs.map((g) => (
              <li key={g.slug}>
                <Link href={routes.guide(g.slug)}>{g.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        <BookLink location="guides-index" /> <ChatButton location="guides-index" /> <CheckLink location="guides-index" />
      </p>
    </>
  );
}
