"use client";

// shadcn/ui Accordion structure on the Radix primitive, restyled to design-system/fixmywp-v1/MASTER.md.
import { CaretDown } from "@phosphor-icons/react";
import { motion, MotionConfig } from "motion/react";
import { Accordion } from "radix-ui";
import { useState } from "react";

export type FaqItem = { q: string; a: string; pending: boolean };

/**
 * Chevron rotates on a 200ms spring (feedback: this item is open). Answers fade in (opacity only, no height
 * animation). Reduced motion: the chevron snaps.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState("");
  return (
    <MotionConfig reducedMotion="user">
      <Accordion.Root type="single" collapsible value={open} onValueChange={setOpen} className="border-t border-line">
        {items.map((it, i) => {
          const id = `faq-${i}`;
          return (
            <Accordion.Item key={id} value={id} className="border-b border-line">
              <Accordion.Header>
                <Accordion.Trigger className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[18px] font-medium text-text">
                  {it.q}
                  <motion.span
                    aria-hidden
                    animate={{ rotate: open === id ? 180 : 0 }}
                    transition={{ type: "spring", duration: 0.2, bounce: 0 }}
                    className="shrink-0 text-muted"
                  >
                    <CaretDown size={18} />
                  </motion.span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-6 data-[state=open]:animate-[fade-in_150ms_ease-out] motion-reduce:animate-none">
                <p className="max-w-[60ch] text-[16px] leading-relaxed text-muted">
                  {it.a}
                  {it.pending && <span className="ml-2 font-mono text-[13px] text-muted">{"{{CONFIRM}}"}</span>}
                </p>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </MotionConfig>
  );
}
