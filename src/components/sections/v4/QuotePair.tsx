"use client";

import { motion, useReducedMotion } from "motion/react";

type Quote = { name: string; role: string; org: string; excerpt: string; placeholder?: boolean };

// A browser decides where a line wraps, so the reveal follows the unit the author controls: the
// sentences of the quote, then the attribution as the last beat.
const sentences = (text: string) => text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;
const still = "motion-reduce:opacity-100! motion-reduce:transform-none!";

/** Two quotes, each arriving line by line the first time it comes into view. */
export function QuotePair({ quotes }: { quotes: Quote[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-12">
      {quotes.map((q) => (
        <motion.figure
          key={q.name}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ shown: { transition: { staggerChildren: reduce ? 0 : 0.12 } } }}
          className="flex flex-col"
        >
          {q.placeholder && (
            <p className="mb-5 w-fit rounded-[14px] border border-dashed border-line-strong px-3 py-2 text-sm text-muted">
              Placeholder, not a client quote. Replace before launch.
            </p>
          )}
          <blockquote className="font-display text-2xl leading-snug font-extrabold tracking-[-0.04em] md:text-3xl">
            {sentences(q.excerpt).map((line, i) => (
              <motion.span
                key={i}
                className={`block ${still}`}
                variants={{ hidden: { opacity: 0, y: reduce ? 0 : 10 }, shown: { opacity: 1, y: 0, transition: spring } }}
              >
                {i === 0 ? `“${line}` : line}
                {i === sentences(q.excerpt).length - 1 ? "”" : null}
              </motion.span>
            ))}
          </blockquote>
          <motion.figcaption
            className={`mt-6 text-[15px] ${still}`}
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
