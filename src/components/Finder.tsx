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

/** Home finder: free-text symptom in, top 3 matches out, each resolving to a service so BOOK always has a target. */
export function Finder({ index, labels, location }: { index: MatchCandidate[]; labels: FinderLabels; location: string }) {
  const id = useId();
  const [query, setQuery] = useState("");
  useSearchTracking(query);
  const results = matchProblem(query, index);

  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id}>What is your site doing?</label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. blank white page after update"
        autoComplete="off"
      />
      {query.trim().length > 2 && (
        <div aria-live="polite">
          {results.length ? (
            <ul>
              {results.map((r) => {
                const svc = labels.services[r.serviceSlug];
                return (
                  <li key={`${r.serviceSlug}:${r.guideSlug ?? ""}`}>
                    {r.guideSlug ? (
                      <Link href={routes.guide(r.guideSlug)}>{labels.guides[r.guideSlug]}</Link>
                    ) : (
                      <Link href={svc.path}>{svc.title}</Link>
                    )}{" "}
                    <BookLink location={location} service={r.serviceSlug} guide={r.guideSlug} />
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>
              No exact match. <ChatButton location={`${location}:no-match`} /> or, if nothing is down right now,{" "}
              <CheckLink location={`${location}:no-match`} />
            </p>
          )}
        </div>
      )}
    </form>
  );
}
