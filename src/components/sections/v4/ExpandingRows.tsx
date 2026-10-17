"use client";

import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Row = { name: string; who: string; price: ReactNode; items: string[]; image: ReactNode; cta: ReactNode };

/**
 * Three rows, one open at a time. The row header is a real button with aria-expanded, so a tap opens
 * it too and a screen reader is told what happened; the panel is `hidden` while closed, so nothing
 * inside it is focusable.
 *
 * Opening is a click, a tap or focus, never hover. It used to open on pointerenter, which meant a
 * mouse crossing the section collapsed whatever the visitor was reading and swapped in a different
 * row underneath them. On a page where the next thing is a price, that is the one place content must
 * not move on its own.
 *
 * The caret is the affordance: before it, nothing told a sighted visitor these rows opened at all,
 * only aria-expanded told a screen reader. It turns 180 degrees, the same chevron the FAQ uses.
 *
 * The height still snaps, because contract rule 10 allows transform and opacity only and the
 * accordion-height exception is spent on the FAQ. What animates is the panel's content arriving:
 * opacity and a 12px rise, the `rise` keyframe the hero headline uses.
 */
export function ExpandingRows({ rows, checkIcon }: { rows: Row[]; checkIcon: ReactNode }) {
  const [active, setActive] = useState(0);
  const id = useId();

  return (
    <ul className="mt-10 flex flex-col gap-3">
      {rows.map((row, i) => {
        const open = i === active;
        const panelId = `${id}-${i}`;
        return (
          <li
            key={row.name}
            className={cn(
              "overflow-hidden rounded-[14px] border bg-surface",
              open ? "border-accent" : "border-line",
            )}
          >
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="flex w-full cursor-pointer items-start gap-4 p-5 text-left md:p-6"
              >
                <span className="flex flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
                  <span className="font-display text-2xl leading-tight font-extrabold tracking-[-0.04em] md:text-3xl">
                    {row.name}
                  </span>
                  <span className="text-muted">{row.who}</span>
                  {row.price && <span className="md:ml-auto">{row.price}</span>}
                </span>
                <CaretDownIcon
                  weight="bold"
                  aria-hidden
                  className={cn(
                    "mt-1 size-5 shrink-0 text-accent-text transition-transform duration-200 ease-out motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                />
              </button>
            </h3>

            <div
              id={panelId}
              hidden={!open}
              className={cn("px-5 pb-5 md:px-6 md:pb-6", open && "motion-safe:animate-[rise_320ms_var(--ease-spring)]")}
            >
              <div className="grid gap-6 md:grid-cols-12 md:items-center">
                <ul className="space-y-3 text-[15px] md:col-span-7">
                  {row.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      {checkIcon}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="md:col-span-5">{row.image}</div>
              </div>
              <div className="mt-6">{row.cta}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
