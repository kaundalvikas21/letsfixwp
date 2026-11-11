"use client";

import { ArrowDownIcon, CheckIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * "What you are seeing" as a check the reader runs, not a list they read. Each symptom is a toggle
 * row; ticking one rolls its cube (`flip-tick` in globals.css) and the footer counts the matches.
 * The count is the reader's own input over the guide's own list, so it is not a number the site
 * invents (contract rule 8). Once anything matches, the footer offers the next thing to do, which is
 * the safe checks further down this page.
 *
 * Client only for the pressed state. No Motion: the roll is a CSS transition, so this never touches
 * `src/components/motion/`.
 */
export function SymptomCheck({ items, className }: { items: readonly string[]; className?: string }) {
  const [on, setOn] = useState<ReadonlySet<number>>(new Set());
  const toggle = (i: number) =>
    setOn((prev) => {
      const next = new Set(prev);
      if (!next.delete(i)) next.add(i);
      return next;
    });

  return (
    <div className={cn("overflow-hidden rounded-[14px] border border-line bg-surface shadow-card", className)}>
      <ul className="divide-y divide-line">
        {items.map((x, i) => {
          const pressed = on.has(i);
          return (
            <li key={x}>
              <button
                type="button"
                aria-pressed={pressed}
                onClick={() => toggle(i)}
                className="flex min-h-14 w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
              >
                <span className="flip-tick" aria-hidden>
                  <span>
                    <span data-face="off">
                      <CheckIcon weight="bold" className="size-4 text-line-strong" />
                    </span>
                    <span data-face="on">
                      <CheckIcon weight="bold" className="size-4" />
                    </span>
                  </span>
                </span>
                <span className={cn("text-[15px] leading-snug transition-colors duration-200", pressed ? "text-text" : "text-muted")}>
                  {x}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line bg-surface-2 px-5 py-3 text-sm">
        <p aria-live="polite" className="text-muted">
          {on.size === 0 ? (
            "Tick what you can see on your site."
          ) : (
            <>
              <span className="font-semibold text-text tabular-nums">
                {on.size} of {items.length}
              </span>{" "}
              match this guide.
            </>
          )}
        </p>
        {on.size > 0 && (
          <a
            href="#safe-checks"
            className="group inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text underline-offset-4 hover:underline"
          >
            Try the safe checks
            <ArrowDownIcon weight="bold" className="size-4 transition-[translate] duration-200 group-hover:translate-y-0.5" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
