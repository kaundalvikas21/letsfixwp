"use client";

import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { Tabs } from "radix-ui";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type FaqGroup = { id: string; name: string; faqs: { q: string; a: string }[] };

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

/**
 * Radix Tabs gives the category row arrow keys, Home/End and roving focus. Each question is a plain
 * button with aria-expanded and its own panel, so the accordion needs no library.
 *
 * The panel animates its height, which contract rule 10 otherwise reserves for transform and opacity:
 * an accordion cannot reveal its answer without one, and the v3 accordion animated height too. The
 * chevron turns, which is a transform. Reduced motion swaps both instantly (duration 0).
 */
export function FaqTabs({ groups }: { groups: FaqGroup[] }) {
  const [tab, setTab] = useState(groups[0].id);
  // The first question of every category starts open, so switching tab never shows a wall of closed rows.
  const [open, setOpen] = useState<string[]>(groups.map((g) => g.faqs[0].q));
  const reduce = useReducedMotion();
  const id = useId();

  const toggle = (q: string) => setOpen((o) => (o.includes(q) ? o.filter((x) => x !== q) : [...o, q]));

  return (
    <MotionConfig reducedMotion="user">
      <Tabs.Root value={tab} onValueChange={setTab} className="mt-8">
        <Tabs.List aria-label="Question categories" className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <Tabs.Trigger
              key={g.id}
              value={g.id}
              className={cn(
                "min-h-11 cursor-pointer rounded-[14px] border px-4 text-[15px] font-medium active:scale-[0.98]",
                tab === g.id
                  ? "border-accent bg-accent text-on-accent"
                  : "border-line-strong bg-surface text-text hover:bg-surface-2",
              )}
            >
              {g.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {groups.map((g) => (
          <Tabs.Content key={g.id} value={g.id} className="mt-8 divide-y divide-line border-y border-line">
            {g.faqs.map((f) => {
              const isOpen = open.includes(f.q);
              const panelId = `${id}-${f.q.replace(/\W+/g, "-")}`;
              return (
                <div key={f.q}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(f.q)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-lg font-bold"
                    >
                      {f.q}
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={reduce ? { duration: 0 } : spring}
                        className="shrink-0 text-accent-text"
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
