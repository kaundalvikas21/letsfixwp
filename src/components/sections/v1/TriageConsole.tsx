"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { ctaStyles } from "@/components/cta-styles";
import { CTA } from "@/config/cta";
import { matchKey, matchProblem, type MatchCandidate } from "@/lib/match-problem";
import { useSearchTracking } from "@/lib/use-search-tracking";

/** One answer card per match candidate, keyed by matchKey(). Built on the server. */
export type TriageEntry = {
  title: string;
  errorText?: string; // the guide's literal error message, shown in Geist Mono
  causes: string[]; // a guide's top two likely causes; empty for a service-only match
  summary: string; // shown only for a service-only match
  service: string; // the guide's parentService
  guide?: string;
  servicePath: string;
};

export type TriageChip = { label: string; key: string };

const chipClass =
  "inline-flex min-h-11 cursor-pointer items-center rounded-control border border-line bg-surface-2 px-3.5 text-[14px] text-text transition-transform duration-150 hover:border-muted/40 active:scale-[0.98] aria-pressed:border-accent";

/**
 * Live triage: free text or a quick pick in, the best-matching problem out.
 * The result streams in line by line (40ms opacity stagger). It communicates state:
 * the console is reading what you typed and answering. Reduced motion shows the final card at once.
 */
export function TriageConsole({
  index,
  entries,
  chips,
}: {
  index: MatchCandidate[];
  entries: Record<string, TriageEntry>;
  chips: TriageChip[];
}) {
  const inputId = useId();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [pick, setPick] = useState<TriageChip | null>(null);
  // undefined = nothing asked yet, null = asked but no match, string = matched entry key
  const [key, setKey] = useState<string | null | undefined>(undefined);
  useSearchTracking(query);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim();
      if (!q) return setKey(undefined);
      if (pick && q === pick.label) return setKey(pick.key);
      const results = matchProblem(q, index);
      // The card is about a specific error, so prefer the best guide in the top results; a service-only
      // match is the fallback when no guide scored.
      const best = results.find((r) => r.guideSlug) ?? results[0];
      setKey(best ? matchKey(best) : null);
    }, 200);
    return () => clearTimeout(t);
  }, [query, pick, index]);

  const match = key ? entries[key] : undefined;

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
            <li key={c.key}>
              <button
                type="button"
                aria-pressed={pick?.key === c.key && query === c.label}
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
              key={key}
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
              {match.errorText && (
                <motion.p variants={line} className="mt-2 max-w-[65ch] font-mono text-[13px] leading-relaxed text-muted">
                  <code>{match.errorText}</code>
                </motion.p>
              )}
              {match.causes.length > 0 ? (
                <>
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
                </>
              ) : (
                <motion.p variants={line} className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-text">
                  {match.summary}
                </motion.p>
              )}
              <motion.div variants={line} className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <BookLink location="hero:triage" service={match.service} guide={match.guide} />
                <Link href={match.servicePath} className={ctaStyles.text}>
                  {CTA.HOW}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </motion.div>
            </motion.div>
          )}

          {key === null && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <p className="text-[15px] text-muted">No close match. Describe it to an engineer instead.</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <ChatButton location="hero:triage-no-match" />
                <CheckLink location="hero:triage-no-match" variant="text" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
