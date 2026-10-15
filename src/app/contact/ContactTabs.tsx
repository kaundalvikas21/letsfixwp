"use client";

import { Tabs } from "radix-ui";
import { useState, type ReactNode } from "react";

/**
 * Emergency ticket and project enquiry share one page. The tab is chosen by the link that got you here
 * (routes.book or routes.quote), and switching is a local change: nothing is lost, because each flow keeps its
 * own draft in sessionStorage.
 */
export function ContactTabs({ initial, fix, project }: { initial: "fix" | "project"; fix: ReactNode; project: ReactNode }) {
  const [tab, setTab] = useState(initial);
  const trigger =
    "min-h-11 flex-1 cursor-pointer rounded-[14px] px-4 text-sm font-semibold text-muted transition-colors hover:text-text data-[state=active]:bg-accent data-[state=active]:text-on-accent";

  return (
    <Tabs.Root value={tab} onValueChange={(v) => setTab(v as "fix" | "project")}>
      <Tabs.List aria-label="What do you need?" className="flex gap-1 rounded-[14px] border border-line-strong bg-surface-2 p-1">
        <Tabs.Trigger value="fix" className={trigger}>
          Emergency ticket
        </Tabs.Trigger>
        <Tabs.Trigger value="project" className={trigger}>
          Project enquiry
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="fix" className="mt-8 outline-none">
        {fix}
      </Tabs.Content>
      <Tabs.Content value="project" className="mt-8 outline-none">
        {project}
      </Tabs.Content>
    </Tabs.Root>
  );
}
