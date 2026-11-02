"use client";

import { motion, useReducedMotion } from "motion/react";

type Quote = { name: string; role: string; org: string; excerpt: string; placeholder?: boolean };

// A browser decides where a line wraps, so the reveal follows the unit the author controls: the
// sentences of the quote, then the attribution as the last beat.
const sentences = (text: string) => text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;
const still = "motion-reduce:opacity-100! motion-reduce:transform-none!";

/**
 * Two quotes, each arriving line by line the first time it comes into view.
 *
 * The quotes are cards. They used to be bare text on the page background, which made the proof the
 * only block on the page without a body while every error tile, panel and plan sat on a surface with
 * a hairline. The opening mark is the one piece of ember here, at a ramp size, and it replaces the
 * typed quotation marks rather than doubling them; the blockquote still carries the semantics.
 *
 * No hover: these are not links, and DESIGN.md's Hover Earns It Rule keeps a pointer response for
 * things that actually go somewhere. The attribution is where a link belongs once a client has a
 * case study to point at.
 */
export function QuotePair({ quotes }: { quotes: Quote[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
      {quotes.map((q) => (
        <motion.figure
          key={q.name}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ shown: { transition: { staggerChildren: reduce ? 0 : 0.12 } } }}
          className="flex h-full flex-col rounded-[14px] border border-line bg-surface p-6 shadow-card md:p-8"
        >
          {q.placeholder && (
            <p className="mb-5 w-fit rounded-[14px] border border-dashed border-line-strong px-3 py-2 text-sm text-muted">
              Placeholder, not a client quote. Replace before launch.
            </p>
          )}
          <span aria-hidden className="font-display text-7xl leading-[0.7] font-extrabold text-accent-text">
            &ldquo;
          </span>
          <blockquote className="mt-3 font-display text-2xl leading-snug font-extrabold tracking-[-0.04em] md:text-3xl">
            {sentences(q.excerpt).map((line, i) => (
              <motion.span
                key={i}
                className={`block ${still}`}
                variants={{ hidden: { opacity: 0, y: reduce ? 0 : 10 }, shown: { opacity: 1, y: 0, transition: spring } }}
              >
                {line}
              </motion.span>
            ))}
          </blockquote>
          <motion.figcaption
            className={`mt-auto pt-6 text-[15px] ${still}`}
            variants={{ hidden: { opacity: 0, y: reduce ? 0 : 10 }, shown: { opacity: 1, y: 0, transition: spring } }}
          >
            <span className="font-semibold">{q.name}</span>
            <span className="text-muted">
              , {q.role}, {q.org}
            </span>
          </motion.figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
