"use client";

import { motion, MotionConfig } from "motion/react";
import { Tabs } from "radix-ui";
import { useState, type ReactNode } from "react";

export type ServiceGroup = { name: string; count: number; content: ReactNode };

// Same spring as the home page's step tabs: a tab indicator is feedback for a click and should land in about
// 250ms, critically damped, rather than drift.
const pill = { type: "spring", stiffness: 400, damping: 40 } as const;

/**
 * The pricing page's service directory, as tabs over the three `Service.intent` groups.
 *
 * It replaced three stacked lists under three subheadings, which printed all 32 services at once and made a
 * reader scroll past two thirds of them to reach the third group. The grouping is the one the content already
 * has, so nothing was rewritten to do this.
 *
 * Deliberately the same idiom as StepsTabs rather than a second tab pattern: Radix `Tabs` gives arrow keys,
 * Home and End and roving focus; the pill is a shared-layout element so it slides to say which is selected; the
 * panels stay mounted and `inert` so switching is a true crossfade and not a remount.
 *
 * `layoutId` is `service-pill` and not `steps-pill`: two shared-layout elements with one id would animate into
 * each other if they ever met on the same page.
 *
 * The count sits in the trigger because it is the thing a reader wants before choosing a tab, and it is inside
 * the accessible name rather than a separate badge, so a screen reader hears "One-time fix, 15 services".
 */
export function ServiceTabs({ groups }: { groups: ServiceGroup[] }) {
  const [active, setActive] = useState(groups[0].name);

  return (
    <MotionConfig reducedMotion="user">
      <Tabs.Root value={active} onValueChange={setActive}>
        <Tabs.List
          aria-label="Services by the kind of work"
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] md:mx-0 md:inline-flex md:gap-1 md:rounded-full md:border md:border-line md:bg-surface-2 md:p-1"
        >
          {groups.map((g) => (
            <Tabs.Trigger
              key={g.name}
              value={g.name}
              className="relative h-11 shrink-0 cursor-pointer snap-start rounded-full bg-surface-2 px-5 font-semibold text-muted transition-colors hover:text-text data-[state=active]:text-on-accent md:bg-transparent"
            >
              {active === g.name && <motion.span layoutId="service-pill" transition={pill} className="absolute inset-0 rounded-full bg-accent" />}
              <span className="relative">
                {g.name}
                <span className="ml-2 font-normal opacity-70">{g.count}</span>
              </span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="mt-6 grid">
          {groups.map((g) => (
            <Tabs.Content
              key={g.name}
              value={g.name}
              forceMount
              inert={active !== g.name}
              className="transition-opacity duration-200 [grid-area:1/1] data-[state=inactive]:pointer-events-none data-[state=inactive]:opacity-0 motion-reduce:transition-none"
            >
              {g.content}
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    </MotionConfig>
  );
}
