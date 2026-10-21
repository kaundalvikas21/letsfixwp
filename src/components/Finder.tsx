"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { routes } from "@/config/routes";
import { matchProblem, type MatchCandidate } from "@/lib/match-problem";
import { useSearchTracking } from "@/lib/use-search-tracking";

export type FinderLabels = {
  services: Record<string, { title: string; path: string }>;
  guides: Record<string, string>; // slug -> title
};

/**
 * Free-text symptom in, top 3 matches out, each resolving to a service so BOOK always has a target.
 *
 * Lives on the knowledge base index. It is not on the home page: ProblemDirectory's filter already
 * does that job there, and two search fields on one page would split the problem_search signal
 * between them.
 *
 * This is the one client island on /guides/, and the reason is that the page's job is finding one
 * error among 37: free-text scoring against titles, error strings and symptoms is not something CSS
 * can do, and the ranked answer has to arrive while the visitor types. The 37 guide links the page
 * exists for are all server-rendered in the directory below it, so nothing here is load-bearing for
 * a crawler or for a visitor with no JS.
 *
 * Visually this was the last component in the repo still carrying v2's square corners and
 * `border-muted`: the control is now 14px with `--line-strong` on its boundary (3.36:1, the only
 * hairline weight allowed to identify a control), the global 2px ember focus ring at 2px offset, and
 * 44px minimums on every target in the result rows.
 */
export function Finder({ index, labels, location }: { index: MatchCandidate[]; labels: FinderLabels; location: string }) {
  const id = useId();
  const [query, setQuery] = useState("");
  useSearchTracking(query);
  const results = matchProblem(query, index);
  const show = query.trim().length > 2;

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="block font-medium">
        What is your site doing?
      </label>
      <p id={`${id}-help`} className="mt-1 text-sm text-muted">
        Describe the symptom in a few words. The exact error text helps most.
      </p>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="blank white page after update"
        autoComplete="off"
        aria-describedby={`${id}-help`}
        // 16px, not the 17px body: the iOS zoom threshold, which is why the system's input spec
        // names a size of its own. The border is the only thing that says "type here", so it is
        // `--line-strong` rather than the decorative `--line` every card edge uses.
        className="mt-3 min-h-12 w-full rounded-[14px] border border-line-strong bg-surface px-4 text-base text-text transition-colors duration-200 placeholder:text-muted hover:border-text/50"
      />

      {/* The region is mounted from first render and only its contents are conditional. A live
          region that arrives in the same mutation as its first content is a region the screen
          reader has not been observing yet, so the first answer, the one the visitor is waiting
          for, can go unannounced; every answer after it is announced normally, which is why this
          reads as working. Nothing axe can see: the attribute is correct, the timing is not. The
          margin is conditional with the contents so an empty region takes no space. */}
      <div aria-live="polite" className={show ? "mt-6" : undefined}>
        {show &&
          (results.length ? (
            <ul className="divide-y divide-line border-y border-line">
              {results.map((r) => {
                const svc = labels.services[r.serviceSlug];
                return (
                  <li
                    key={`${r.serviceSlug}:${r.guideSlug ?? ""}`}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2"
                  >
                    <Link
                      href={r.guideSlug ? routes.guide(r.guideSlug) : svc.path}
                      className="inline-flex min-h-11 items-center text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
                    >
                      {r.guideSlug ? labels.guides[r.guideSlug] : svc.title}
                    </Link>
                    {/* Secondary, though it is the booking call: three ember fills stacked in one
                        answer, under a header that already carries one, is the whole page shouting
                        at a visitor who has just started typing. The row's own link is what they
                        asked for; this is the escalation beside it, and it still carries the
                        service and the guide, so BOOK lands on a target either way. */}
                    <BookLink
                      location={location}
                      service={r.serviceSlug}
                      guide={r.guideSlug}
                      className="btn-secondary shrink-0 !px-4 !text-sm"
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-[14px] border border-line bg-surface p-5 shadow-card">
              <p className="text-[0.9375rem]">No guide matches that wording yet.</p>
              <p className="mt-4 flex flex-wrap items-center gap-2">
                <ChatButton location={`${location}:no-match`} className="btn-primary" />
                <CheckLink location={`${location}:no-match`} className="btn-secondary" />
              </p>
            </div>
          ))}
      </div>
    </form>
  );
}
