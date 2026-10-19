"use client";

import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { Tabs } from "radix-ui";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type FaqGroup = { id: string; name: string; faqs: { q: string; a: string }[] };

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// One rail row, in pixels. The travelling pill is positioned by index rather than by measuring the
// DOM, which only holds while every row is exactly this tall: h-12 with no gap.
const ROW = 48;

/**
 * Categories down the left, questions on the right.
 *
 * They used to be a wrapping row of pills above the questions, inside a max-w-4xl section that put
 * this block's left edge 128px inboard of every other section on the page. The section now runs on
 * the same spine as the rest, and the width it gained goes to a vertical category rail rather than
 * to longer question rows: a question with its chevron 1100px away reads as two separate things.
 * At 375 the rail is still vertical, which also ends the ragged two-line wrap the pills had there.
 *
 * Radix Tabs with orientation="vertical" gives the rail Up/Down arrows, Home/End and roving focus,
 * matching what the rail looks like. Each question is a plain button with aria-expanded and its own
 * labelled region, so the accordion needs no library.
 *
 * The pill behind the active category slides rather than cutting, which is the one piece of motion
 * here: it says the three categories are one list being pointed at, not three buttons. It is
 * --surface-2 rather than an ember fill so that nothing is ever mid-travel under an unreadable
 * colour; the active label carries the ember instead, at 5.47:1 on that surface.
 *
 * The panel animates its height, which contract rule 10 otherwise reserves for transform and
 * opacity: an accordion cannot reveal its answer without one, and the v3 accordion animated height
 * too. The chevron turns, which is a transform. Reduced motion swaps both instantly (duration 0).
 */
export function FaqTabs({ groups }: { groups: FaqGroup[] }) {
  const [tab, setTab] = useState(groups[0].id);
  // The first question of every category starts open, so switching tab never shows a wall of closed rows.
  const [open, setOpen] = useState<string[]>(groups.map((g) => g.faqs[0].q));
  const reduce = useReducedMotion();
  const id = useId();
  const active = Math.max(0, groups.findIndex((g) => g.id === tab));

  const toggle = (q: string) => setOpen((o) => (o.includes(q) ? o.filter((x) => x !== q) : [...o, q]));

  return (
    <MotionConfig reducedMotion="user">
      <Tabs.Root
        value={tab}
        onValueChange={setTab}
        orientation="vertical"
        className="mt-10 md:mt-12 md:grid md:grid-cols-[14rem_minmax(0,48rem)] md:items-start md:gap-12"
      >
        <Tabs.List aria-label="Question categories" className="relative isolate flex flex-col">
          {/* Behind the labels, so a focus ring on any row still draws over it. */}
          <span
            aria-hidden
            style={{ transform: `translateY(${active * ROW}px)` }}
            className="absolute inset-x-0 top-0 -z-10 h-12 rounded-[14px] bg-surface-2 transition-transform duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          />
          {groups.map((g) => (
            <Tabs.Trigger
              key={g.id}
              value={g.id}
              className="flex h-12 cursor-pointer items-center rounded-[14px] px-4 text-left text-[15px] font-medium text-muted transition-[color,scale] duration-150 ease-out active:scale-[0.98] data-[state=active]:text-accent-text motion-reduce:transition-none"
            >
              {g.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {groups.map((g) => (
          <Tabs.Content
            key={g.id}
            value={g.id}
            // Radix mounts only the open category, so this plays on every switch: the answers arrive
            // rather than replacing each other in place.
            className="mt-8 divide-y divide-line border-y border-line md:mt-0 motion-safe:animate-[rise_320ms_var(--ease-spring)]"
          >
            {g.faqs.map((f) => {
              const isOpen = open.includes(f.q);
              const key = f.q.replace(/\W+/g, "-");
              const panelId = `${id}-${key}`;
              const labelId = `${id}-${key}-q`;
              return (
                <div key={f.q}>
                  <h3>
                    <button
                      type="button"
                      id={labelId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(f.q)}
                      className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-lg font-bold"
                    >
                      {f.q}
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : spring}
                        className={cn(
                          "shrink-0 transition-colors duration-150 ease-out",
                          isOpen ? "text-accent-text" : "text-muted group-hover:text-accent-text",
                        )}
                      >
                        <CaretDownIcon weight="duotone" className="size-5" aria-hidden />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={labelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : spring}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[68ch] pb-6 text-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </MotionConfig>
  );
}
