"use client";

import { CaretDownIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Accordion } from "radix-ui";
import { useId, useState } from "react";
import { ChatButton } from "@/components/Cta";

export type Faq = { q: string; a: string };

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ");

/**
 * Searchable accordion. The filter narrows by question and answer text, so someone who types a word from the
 * answer ("backup") still finds it. Non-matching items leave and the rest slide up (layout animation), which
 * shows the list reacting to the filter. Reduced motion renders each state with no movement.
 */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const q = norm(query).trim();
  const shown = q ? faqs.filter((f) => norm(`${f.q} ${f.a}`).includes(q)) : faqs;

  return (
    <MotionConfig reducedMotion="user">
      <div className="rounded-[20px] border border-line bg-surface p-5 shadow-card md:p-8">
        <label htmlFor={id} className="block text-sm font-semibold">
          Filter questions
        </label>
        <div className="mt-2 flex items-center gap-3 rounded-[12px] border border-line-strong bg-surface-2 px-4 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
          <MagnifyingGlassIcon weight="duotone" className="size-5 shrink-0 text-muted" aria-hidden />
          <input
            id={id}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="backup, access, hosting"
            autoComplete="off"
            className="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
        </div>

        <p className="sr-only" aria-live="polite">
          {shown.length} of {faqs.length} questions shown
        </p>

        {shown.length ? (
          <Accordion.Root type="single" collapsible className="mt-2">
            <AnimatePresence initial={false}>
              {shown.map((f) => (
                <motion.div
                  key={f.q}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  // Layout slide on the contract spring; the fade itself is quick, so a filter feels immediate.
                  transition={{ layout: spring, opacity: { duration: 0.12 } }}
                >
                  <Accordion.Item value={f.q} className="border-b border-line last:border-b-0">
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-lg font-bold">
                        {f.q}
                        <CaretDownIcon
                          weight="duotone"
                          className="size-5 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden motion-safe:data-[state=closed]:animate-[acc-close_200ms_ease-out] motion-safe:data-[state=open]:animate-[acc-open_200ms_ease-out]">
                      <p className="max-w-[70ch] pb-5 text-muted">{f.a}</p>
                    </Accordion.Content>
                  </Accordion.Item>
                </motion.div>
              ))}
            </AnimatePresence>
          </Accordion.Root>
        ) : (
          <div className="py-10 text-center">
            <p className="font-display text-xl font-bold">No question matches &ldquo;{query.trim()}&rdquo;</p>
            <p className="mx-auto mt-2 max-w-[46ch] text-muted">Ask an engineer instead. Describe what your site is doing and we will tell you what it needs.</p>
            <p className="mt-6">
              <ChatButton location="home:faq" className="btn-secondary" />
            </p>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
