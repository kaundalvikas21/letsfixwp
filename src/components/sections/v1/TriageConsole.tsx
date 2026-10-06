"use client";

import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { BookLink, ChatButton } from "@/components/Cta";
import { CTA } from "@/config/cta";
import type { Problem } from "@/content/schema";
import { matchProblem } from "@/lib/match-problem";
import { useSearchTracking } from "@/lib/use-search-tracking";

export type TriageProblem = Pick<
  Problem,
  "slug" | "title" | "h1" | "symptoms" | "urgency" | "typicalTurnaround" | "priceFrom"
> & { path: string; causes: string[] };

export type TriageChip = { label: string; slug: string };

const chipClass =
  "inline-flex min-h-11 cursor-pointer items-center rounded-control border border-line bg-surface-2 px-3.5 text-[14px] text-text transition-transform duration-150 hover:border-muted/40 active:scale-[0.98] aria-pressed:border-accent";

/**
 * Live triage: free text or a quick pick in, the best-matching problem out.
 * The result streams in line by line (40ms opacity stagger). It communicates state:
 * the console is reading what you typed and answering. Reduced motion shows the final card at once.
 */
export function TriageConsole({ problems, chips }: { problems: TriageProblem[]; chips: TriageChip[] }) {
  const inputId = useId();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [pick, setPick] = useState<TriageChip | null>(null);
  // undefined = nothing asked yet, null = asked but no match, string = matched slug
  const [slug, setSlug] = useState<string | null | undefined>(undefined);
  useSearchTracking(query);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();
      if (!q) return setSlug(undefined);
      setSlug(pick && q === pick.label ? pick.slug : (matchProblem(q, problems)[0] ?? null));
    }, 200);
    return () => clearTimeout(t);
  }, [query, pick, problems]);

  const match = slug ? problems.find((p) => p.slug === slug) : undefined;

  const list = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
  const line = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.24 } } };

  return (
    <div className="rounded-card border border-line bg-surface/90 shadow-card backdrop-blur-sm">
      <label htmlFor={inputId} className="block border-b border-line px-5 py-3 font-mono text-[13px] text-muted">
        Describe the problem
      </label>

      <div className="p-5">
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. blank page after a plugin update"
          autoComplete="off"
          enterKeyHint="search"
          className="h-12 w-full rounded-control border border-line bg-surface-2 px-4 text-base text-text placeholder:text-muted"
        />

        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Common problems">
          {chips.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                aria-pressed={pick?.slug === c.slug && query === c.label}
                onClick={() => {
                  setPick(c);
                  setQuery(c.label);
                }}
                className={chipClass}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>

        <div aria-live="polite">
          {match && (
            <motion.div
              key={match.slug}
              variants={list}
              initial={reduce ? false : "hidden"}
              animate="show"
              className="mt-5 border-t border-line pt-5"
            >
              <motion.p variants={line} className="font-mono text-[13px] text-muted">
                Best match
              </motion.p>
              <motion.p variants={line} className="mt-1 text-xl font-semibold tracking-tight text-text">
                {match.title}
              </motion.p>
              <motion.p variants={line} className="mt-4 text-[14px] text-muted">
                Likely causes
              </motion.p>
              <ul className="mt-1 space-y-1.5">
                {match.causes.map((c) => (
                  <motion.li key={c} variants={line} className="max-w-[65ch] text-[15px] leading-relaxed text-text">
                    {c}
                  </motion.li>
                ))}
              </ul>
              <motion.dl variants={line} className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[13px]">
                <dt className="text-muted">urgency</dt>
                <dd className="flex items-center gap-1.5 text-text">
                  {match.urgency !== "standard" && <WarningCircle size={16} className="text-accent-ink" aria-hidden />}
                  {match.urgency}
                </dd>
                {match.typicalTurnaround && (
                  <>
                    <dt className="text-muted">turnaround</dt>
                    <dd className="text-text">{match.typicalTurnaround}</dd>
                  </>
                )}
                {match.priceFrom && (
                  <>
                    <dt className="text-muted">from</dt>
                    <dd className="text-text">{match.priceFrom}</dd>
                  </>
                )}
              </motion.dl>
              <motion.div variants={line} className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <BookLink location="hero:triage" problem={match.slug} />
                <Link
                  href={match.path}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-control text-[15px] font-medium text-accent-ink hover:underline"
                >
                  {CTA.HOW}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </motion.div>
            </motion.div>
          )}

          {slug === null && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <p className="text-[15px] text-muted">No close match. Describe it to an engineer instead.</p>
              <ChatButton location="hero:triage-no-match" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
