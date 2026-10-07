"use client";

// shadcn/ui Tabs structure on the Radix primitive, restyled to MASTER tokens.
import { Tabs } from "radix-ui";
import type { ReactNode } from "react";
import { pageCopy } from "@/content/pages";

const trigger =
  "inline-flex min-h-11 cursor-pointer items-center rounded-control px-4 text-[15px] text-muted transition-colors hover:text-text data-[state=active]:bg-surface data-[state=active]:text-text";

export function ContactTabs({ initial, ticket, project }: { initial: "ticket" | "project"; ticket: ReactNode; project: ReactNode }) {
  return (
    <Tabs.Root defaultValue={initial} className="mt-10">
      <Tabs.List aria-label="Contact type" className="inline-flex gap-1 rounded-control border border-line p-1">
        <Tabs.Trigger value="ticket" className={trigger}>
          {pageCopy.booking.tabs.ticket}
        </Tabs.Trigger>
        <Tabs.Trigger value="project" className={trigger}>
          {pageCopy.booking.tabs.project}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="ticket" className="mt-6 focus-visible:outline-offset-4">
        {ticket}
      </Tabs.Content>
      <Tabs.Content value="project" className="mt-6 focus-visible:outline-offset-4">
        {project}
      </Tabs.Content>
    </Tabs.Root>
  );
}
