"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { BookLink } from "@/components/Cta";
import type { ProblemSummary } from "@/content/problems";
import { matchProblem } from "@/lib/match-problem";
import { useSearchTracking } from "@/lib/use-search-tracking";

/** Hero triage: free-text symptom in, top 3 matching problems out. */
export function Triage({ problems, location }: { problems: ProblemSummary[]; location: string }) {
  const id = useId();
  const [query, setQuery] = useState("");
  useSearchTracking(query);
  const bySlug = new Map(problems.map((p) => [p.slug, p]));
  const matches = matchProblem(query, problems).map((s) => bySlug.get(s)!);

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
          {matches.length ? (
            <ul>
              {matches.map((p) => (
                <li key={p.slug}>
                  <Link href={p.path}>{p.title}</Link> <BookLink location={location} problem={p.slug} />
                </li>
              ))}
            </ul>
          ) : (
            <p>
              No exact match. Describe it to an engineer instead. <BookLink location={location} />
            </p>
          )}
        </div>
      )}
    </form>
  );
}
