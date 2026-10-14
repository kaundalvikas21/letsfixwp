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
 * Lives on the knowledge base index, which the persisted override
 * (design-system/letsfixwp-v2/pages/guide.md) specifies as "Hero with search bar". It is not on the
 * home page: ProblemDirectory's filter already does that job there, and two search fields on one
 * page would split the problem_search signal between them.
 */
export function Finder({ index, labels, location }: { index: MatchCandidate[]; labels: FinderLabels; location: string }) {
  const id = useId();
  const [query, setQuery] = useState("");
  useSearchTracking(query);
  const results = matchProblem(query, index);
  const show = query.trim().length > 2;

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-[34rem]">
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
        className="mt-3 min-h-14 w-full border border-muted bg-surface px-4 text-base text-text transition-colors duration-200 placeholder:text-muted focus-visible:border-text"
      />

      {show && (
        <div aria-live="polite" className="mt-6">
          {results.length ? (
            <ul className="border-t border-line">
              {results.map((r) => {
                const svc = labels.services[r.serviceSlug];
                return (
                  <li
                    key={`${r.serviceSlug}:${r.guideSlug ?? ""}`}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-3"
                  >
                    {r.guideSlug ? (
                      <Link
                        href={routes.guide(r.guideSlug)}
                        className="text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
                      >
                        {labels.guides[r.guideSlug]}
                      </Link>
                    ) : (
                      <Link href={svc.path} className="text-[0.9375rem] transition-colors duration-200 hover:text-accent-text">
                        {svc.title}
                      </Link>
                    )}
                    <BookLink
                      location={location}
                      service={r.serviceSlug}
                      guide={r.guideSlug}
                      className="btn-primary shrink-0 !min-h-11 !px-4 !text-sm"
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="border border-muted p-4">
              <p className="text-[0.9375rem]">No guide matches that wording yet.</p>
              <p className="mt-3 flex flex-wrap items-center gap-2">
                <ChatButton location={`${location}:no-match`} className="btn-primary" />
                <CheckLink location={`${location}:no-match`} className="btn-secondary" />
              </p>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
