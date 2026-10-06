"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { LayoutGroup, motion, MotionConfig } from "motion/react";
import Link from "next/link";
import { Tabs } from "radix-ui";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { BookLink, ChatButton, ctaStyles } from "@/components/Cta";
import { matchProblem, type MatchCandidate } from "@/lib/match-problem";
import { useSearchTracking } from "@/lib/use-search-tracking";

export type Urgency = "critical" | "high" | "standard";
export type FinderRow = { key: string; title: string; line: string; urgency?: Urgency; href: string };
export type FinderTab = { id: string; label: string; rows: FinderRow[] };
export type SearchGuide = { title: string; href: string; service: string };

// Tabs are vertical from 768px and a horizontal scroll-snap row below, so arrow keys follow the layout.
const mq = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const m = matchMedia(mq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const useWide = () => useSyncExternalStore(subscribe, () => matchMedia(mq).matches, () => true);

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName));

function Rows({ tab }: { tab: FinderTab }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    // The rail is one element that moves between rows (shared layoutId). Communicates feedback: this is the row you are on.
    <LayoutGroup id={`finder-${tab.id}`}>
      <ul className="grid gap-x-6 gap-y-1 md:grid-cols-2" onMouseLeave={() => setActive(null)}>
        {tab.rows.map((r) => (
          <li key={r.key}>
            <Link
              href={r.href}
              onMouseEnter={() => setActive(r.key)}
              onFocus={() => setActive(r.key)}
              onBlur={() => setActive(null)}
              className="group relative flex min-h-11 items-start gap-4 rounded-control px-4 py-4 transition-colors hover:bg-surface"
            >
              {active === r.key && (
                <motion.span
                  layoutId="rail"
                  aria-hidden
                  className="absolute inset-y-3 left-0 w-px bg-accent"
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-medium text-text">{r.title}</span>
                <span className="mt-1 line-clamp-1 text-[14px] text-muted">{r.line}</span>
                {r.urgency && (
                  <span className="mt-2 block font-mono text-[12px] text-muted">
                    urgency: {r.urgency}
                  </span>
                )}
              </span>
              <ArrowRight
                size={18}
                aria-hidden
                className="mt-1 shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-text"
              />
            </Link>
          </li>
        ))}
      </ul>
    </LayoutGroup>
  );
}

export function FinderClient({
  tabs,
  index,
  guides,
  guidesHref,
}: {
  tabs: FinderTab[];
  index: MatchCandidate[];
  guides: Record<string, SearchGuide>;
  guidesHref: string;
}) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const wide = useWide();
  useSearchTracking(query); // fires problem_search once typing pauses

  // "/" jumps to the search, unless the visitor is already typing somewhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim();
  const results = q.length > 1 ? [...new Set(matchProblem(q, index, 12).flatMap((r) => (r.guideSlug ? [r.guideSlug] : [])))].slice(0, 5) : [];

  return (
    <MotionConfig reducedMotion="user">
      <div className="mt-10">
        <label htmlFor={inputId} className="flex items-center gap-2 text-[14px] text-muted">
          Search by what you see
          <span className="text-muted max-md:sr-only">
            (press <kbd className="rounded-control border border-line bg-surface-2 px-1.5 font-mono text-[12px] text-text">/</kbd> to focus)
          </span>
        </label>
        <input
          ref={input}
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. error establishing a database connection"
          autoComplete="off"
          enterKeyHint="search"
          className="mt-2 h-12 w-full max-w-2xl rounded-control border border-line bg-surface-2 px-4 text-base text-text placeholder:text-muted"
        />

        <div aria-live="polite" className="max-w-2xl">
          {q.length > 1 &&
            (results.length ? (
              <ul className="mt-3 rounded-card border border-line bg-surface p-2 shadow-card">
                {results.map((slug) => {
                  const g = guides[slug];
                  return (
                    <li key={slug} className="flex flex-wrap items-center justify-between gap-x-4 rounded-control px-3 py-1">
                      <Link href={g.href} className="min-h-11 py-2.5 text-[15px] text-text hover:underline">
                        {g.title}
                      </Link>
                      <BookLink location="finder:search" service={g.service} guide={slug} variant="text" />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 text-[15px] text-muted">No matching guide. Try other words, or describe it to an engineer below.</p>
            ))}
        </div>
      </div>

      <Tabs.Root
        defaultValue={tabs[0].id}
        orientation={wide ? "vertical" : "horizontal"}
        className="mt-10 md:grid md:grid-cols-[14rem_1fr] md:gap-8"
      >
        <Tabs.List
          aria-label="Problem categories"
          className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0"
        >
          {tabs.map((t) => (
            <Tabs.Trigger
              key={t.id}
              value={t.id}
              className="min-h-11 shrink-0 cursor-pointer snap-start rounded-control border border-line px-4 text-left text-[15px] whitespace-nowrap text-muted transition-colors hover:text-text data-[state=active]:border-transparent data-[state=active]:bg-surface data-[state=active]:text-text md:border-transparent"
            >
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {tabs.map((t) => (
          // forceMount keeps every row link in the HTML (crawlable internal links); inactive panels are hidden.
          <Tabs.Content key={t.id} value={t.id} forceMount className="mt-4 data-[state=inactive]:hidden md:mt-0">
            <Rows tab={t} />
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
        <p className="text-[15px] text-text">Not listed? Describe it to an engineer.</p>
        <ChatButton location="finder:footer" />
        <Link href={guidesHref} className={ctaStyles.text}>
          Browse all error guides
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </MotionConfig>
  );
}
