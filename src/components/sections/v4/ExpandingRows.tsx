"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Row = { name: string; who: string; price: ReactNode; items: string[]; image: ReactNode; cta: ReactNode };

/**
 * Three rows, one open at a time: the pointer or the keyboard opens one and the others compress.
 * The row header is a real button with aria-expanded, so a tap opens it too and a screen reader is
 * told what happened; the panel is `hidden` while closed, so nothing inside it is focusable.
 *
 * Nothing animates: the motion budget for this page is spent on the scroll scenes, and a height
 * transition is neither transform nor opacity (contract rule 10). The row that is open stays open
 * until another takes over, so focus never lands in a panel that is closing under it.
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
            onPointerEnter={() => setActive(i)}
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
                className="flex w-full cursor-pointer flex-col gap-1 p-5 text-left md:flex-row md:items-baseline md:gap-6 md:p-6"
              >
                <span className="font-display text-2xl leading-tight font-extrabold tracking-[-0.04em] md:text-3xl">
                  {row.name}
                </span>
                <span className="text-muted">{row.who}</span>
                {row.price && <span className="md:ml-auto">{row.price}</span>}
              </button>
            </h3>

            <div id={panelId} hidden={!open} className="px-5 pb-5 md:px-6 md:pb-6">
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
