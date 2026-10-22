"use client";

import { motion, MotionConfig } from "motion/react";
import { Tabs } from "radix-ui";
import { useState, type ReactNode } from "react";

export type Step = { verb: string; text: string; media: ReactNode };

// Faster than the contract's 100/20 default on purpose: a tab indicator is feedback for a click and should land
// in about 250ms (critically damped, no overshoot), not drift for 600ms.
const pill = { type: "spring", stiffness: 400, damping: 40 } as const;

/**
 * Radix Tabs (arrow keys, Home/End, roving focus) with a shared-layout pill that slides to the active tab, which
 * says "this one is selected". Panels stay mounted and stacked so the change is a true 200ms crossfade; inactive
 * panels are inert. reducedMotion="user" makes the pill jump; motion-reduce drops the fade.
 */
export function StepsTabs({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(steps[0].verb);
  return (
    <MotionConfig reducedMotion="user">
      <Tabs.Root value={active} onValueChange={setActive}>
        {/* gap-2 below 768px, gap-1 from md: without the shared track the four triggers read as four separate
            pills, and rule 5 asks for 8px between targets, where they measured 4px at 375. From md they are the
            segments of one bordered pill track, which is where 4px is the segmented-control spacing MASTER wants.
            The row already scrolls below md, so the extra 4px costs no layout. */}
        <Tabs.List
          aria-label="How a fix works"
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:inline-flex md:gap-1 md:rounded-full md:border md:border-line md:bg-surface-2 md:p-1"
        >
          {steps.map((s) => (
            <Tabs.Trigger
              key={s.verb}
              value={s.verb}
              className="relative h-11 shrink-0 cursor-pointer snap-start rounded-full bg-surface-2 px-5 font-semibold text-muted transition-colors hover:text-text data-[state=active]:text-on-accent md:bg-transparent"
            >
              {active === s.verb && <motion.span layoutId="steps-pill" transition={pill} className="absolute inset-0 rounded-full bg-accent" />}
              <span className="relative">{s.verb}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="mt-8 grid">
          {steps.map((s) => (
            <Tabs.Content
              key={s.verb}
              value={s.verb}
              forceMount
              inert={active !== s.verb}
              className="grid items-center gap-8 transition-opacity duration-200 [grid-area:1/1] data-[state=inactive]:opacity-0 motion-reduce:transition-none md:grid-cols-12 md:gap-12"
            >
              <p className="text-xl leading-snug md:col-span-5">{s.text}</p>
              <div className="md:col-span-7">{s.media}</div>
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </MotionConfig>
  );
}
