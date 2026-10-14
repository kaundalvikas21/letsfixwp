"use client";

import { CheckIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { BookLink, PlansLink } from "@/components/Cta";
import { PillRadio } from "./PillRadio";

export type Mode = "fix" | "plan";
export type ModeContent = { label: string; title: string; items: string[]; image: ReactNode };

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

/**
 * A PillRadio switches mode. The left side re-lays out to the new content height and crossfades; the photo
 * crossfades with it.
 */
export function PlanToggle({ modes }: { modes: Record<Mode, ModeContent> }) {
  const [mode, setMode] = useState<Mode>("fix");
  const reduce = useReducedMotion();
  const c = modes[mode];

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid overflow-hidden rounded-[20px] border border-line bg-surface shadow-card md:grid-cols-2">
        <motion.div layout={!reduce} transition={spring} className="flex flex-col p-6 md:p-10">
          <PillRadio
            value={mode}
            onChange={setMode}
            options={(Object.keys(modes) as Mode[]).map((m) => ({ value: m, label: modes[m].label }))}
            label="Compare a one-time fix with a care plan"
            layoutId="plan-thumb"
          />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={reduce ? { duration: 0 } : { duration: 0.18 }}
              className="mt-8"
            >
              <h3 className="font-display text-2xl leading-tight font-bold md:text-3xl">{c.title}</h3>
              <ul className="mt-5 space-y-3">
                {c.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon weight="duotone" className="mt-1 size-5 shrink-0 text-accent-text" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {mode === "fix" ? <BookLink location="home:compare" className="btn-primary" /> : <PlansLink location="home:compare" className="btn-primary" />}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="relative min-h-64 md:min-h-full">
          {(Object.keys(modes) as Mode[]).map((m) => (
            <div
              key={m}
              aria-hidden={m !== mode}
              className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${m === mode ? "opacity-100" : "opacity-0"}`}
            >
              {modes[m].image}
            </div>
          ))}
        </div>
      </div>
    </MotionConfig>
  );
}
