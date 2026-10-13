"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchTracking } from "@/lib/use-search-tracking";

// Isolated client leaf (contract rule 2): the filter is the only interactive part of the directory.

export type Problem = { slug: string; title: string; href: string; critical: boolean; search: string };
export type Category = { id: string; name: string; hubHref: string; allLabel: string; count: number; problems: Problem[] };

const PER_CATEGORY = 6;
const MD = "(min-width: 768px)";

/**
 * md and up renders plain columns, below it renders disclosure items. The server snapshot is `true`,
 * so the HTML ships fully expanded: every problem link is in the markup for crawlers and for a
 * visitor without JavaScript, and the accordion only appears once a narrow viewport hydrates.
 */
const useIsWide = () =>
  useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(MD);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(MD).matches,
    () => true,
  );

export function ProblemDirectoryList({ categories }: { categories: Category[] }) {
  const fieldId = useId();
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const isWide = useIsWide();
  useSearchTracking(query);

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          // While filtering, every match shows. At rest the column is capped.
          problems: q ? c.problems.filter((p) => p.search.includes(q)) : c.problems.slice(0, PER_CATEGORY),
        }))
        .filter((c) => c.problems.length > 0),
    [categories, q],
  );

  const total = shown.reduce((n, c) => n + c.problems.length, 0);

  return (
    <>
      <div role="search" className="mt-8 max-w-[28rem]">
        <label htmlFor={fieldId} className="mb-2 block text-sm font-medium">
          Filter problems
        </label>
        <input
          id={fieldId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="white screen, checkout, redirect"
          autoComplete="off"
          className="min-h-14 w-full border border-muted bg-surface px-4 text-base text-text transition-colors duration-200 placeholder:text-muted focus-visible:border-text"
        />
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 font-mono text-sm text-muted">
        {q && total > 0 ? `${total} ${total === 1 ? "problem matches" : "problems match"} "${query.trim()}"` : ""}
      </p>

      {shown.length === 0 ? (
        <p className="mt-8 max-w-[46ch] text-muted">
          Nothing matches that wording. Try one word from the error, or describe what the page shows.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => {
            const heading = (
              <span className="flex items-baseline gap-3">
                <span className="font-bold">{c.name}</span>
                <span className="font-mono text-sm text-muted">{c.count}</span>
              </span>
            );

            const body = (
              <>
                <ul className="mt-4 grid gap-px">
                  {c.problems.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={p.href}
                        className="flex min-h-11 items-center gap-2 border-b border-line py-2 text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
                      >
                        <span>{p.title}</span>
                        {p.critical && <span className="ml-auto font-mono text-xs text-accent-text">Critical</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={c.hubHref}
                  className="mt-4 inline-flex min-h-11 items-center border-b border-muted text-sm text-muted transition-colors duration-200 hover:border-text hover:text-text"
                >
                  {c.allLabel}
                </Link>
              </>
            );

            if (isWide) {
              return (
                <div key={c.id}>
                  <h3>{heading}</h3>
                  {body}
                </div>
              );
            }

            return (
              <details
                key={c.id}
                open={!!q || !!opened[c.id]}
                onToggle={(e) => setOpened((o) => ({ ...o, [c.id]: e.currentTarget.open }))}
                className="group border-t border-line pt-4 first:border-t-0 first:pt-0"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                  <h3>{heading}</h3>
                  <CaretDownIcon
                    aria-hidden
                    size={16}
                    weight="bold"
                    className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                {body}
              </details>
            );
          })}
        </div>
      )}
    </>
  );
}
