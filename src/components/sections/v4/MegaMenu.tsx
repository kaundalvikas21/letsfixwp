"use client";

import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";
import { BookLink, ChatButton } from "@/components/Cta";
import { cn } from "@/lib/utils";

export type MenuLink = { label: string; href: string };
export type MenuCategory = MenuLink & { links: MenuLink[] };

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

/**
 * The full-screen menu. Categories reveal 50ms apart (hierarchy: the eye lands on Fixes first), and
 * one category is open at a time: on a pointer it follows hover and focus, on a phone it is a
 * disclosure you tap. The panel is absolute at md and up, so an expansion never moves the category
 * list. Reduced motion fades, with no stagger and no travel.
 *
 * Under 768px every category used to be expanded at once, on the reasoning that a phone has no hover.
 * That buried the six categories under 32 links: the list was 2,152px inside a 563px scroller, so the
 * navigation sat behind the sub-items of whichever category happened to be first. Phones now open
 * nothing until asked, which is why `touched` exists: it separates "nobody has chosen yet", where a
 * pointer still wants the first panel showing, from a real choice.
 */
export function MegaMenu({
  categories,
  support,
  onNavigate,
}: {
  categories: MenuCategory[];
  support: MenuLink[];
  onNavigate: () => void;
}) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();
  const choose = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  return (
    <>
      <nav
        aria-label="All pages"
        className="flex-1 overflow-auto px-4 pb-10 md:px-6"
      >
        <motion.ul
          initial="hidden"
          animate="shown"
          variants={{
            shown: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
          }}
          className="relative mx-auto max-w-5xl"
        >
          {categories.map((c, i) => (
            <li
              key={c.href}
              onPointerEnter={(e) => e.pointerType === "mouse" && choose(i)}
              className="border-b border-line last:border-0 md:w-[52%] md:border-0 md:py-2"
            >
              {/* The reveal animates this wrapper, never the row. A transform makes an element the
                  containing block for its absolutely positioned descendants, so animating the row made
                  the panel resolve against the 52%-wide row for the length of the animation and then
                  jump to its real place the frame Motion wrote `transform: none`. Measured before the
                  fix: panel at x=426 w=234 until 719ms, x=701 w=451 from 785ms. */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: reduce ? 0 : 24 },
                  shown: {
                    opacity: 1,
                    y: 0,
                    transition: reduce ? { duration: 0.16 } : spring,
                  },
                }}
              >
                {/* Phone: a disclosure, so all six categories fit on one screen until one is asked for. */}
                <button
                  type="button"
                  aria-expanded={i === active && touched}
                  aria-controls={`${id}-${i}`}
                  onClick={() => choose(i === active && touched ? -1 : i)}
                  style={{ fontVariationSettings: '"opsz" 36' }}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.04em] md:hidden"
                >
                  {c.label}
                  <CaretDownIcon
                    weight="duotone"
                    aria-hidden
                    className={cn(
                      "size-6 shrink-0 text-accent-text transition-transform duration-200 ease-out motion-reduce:transition-none",
                      i === active && touched && "rotate-180",
                    )}
                  />
                </button>
                {/* Pointer: the category is a link, and hover or focus opens its panel beside it. */}
                <Link
                  href={c.href}
                  onClick={onNavigate}
                  onFocus={() => choose(i)}
                  style={{ fontVariationSettings: '"opsz" 48' }}
                  className={cn(
                    "hidden font-display text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] md:block",
                    i === active && "md:text-accent-text",
                  )}
                >
                  {c.label}
                </Link>
              </motion.div>
              <ul
                id={`${id}-${i}`}
                // Tabbing into the links keeps the row open; on a phone this re-selects the row that
                // is already open, which changes nothing.
                onFocus={() => choose(i)}
                className={cn(
                  "space-y-2 pb-4 md:absolute md:top-0 md:right-0 md:w-[44%] md:pb-0",
                  i === active
                    ? touched
                      ? "block"
                      : "hidden md:block"
                    : "hidden",
                )}
              >
                {/* The hub itself, which the heading links to on a pointer and cannot on a phone. */}
                <li className="md:hidden">
                  <Link
                    href={c.href}
                    onClick={onNavigate}
                    className="flex min-h-11 items-center font-semibold text-accent-text"
                  >
                    All {c.label.toLowerCase()}
                  </Link>
                </li>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onNavigate}
                      className="flex min-h-11 items-center text-muted hover:text-text"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </motion.ul>
      </nav>

      <div className="shrink-0 border-t border-line px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {support.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center text-[15px] text-muted hover:text-text"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 md:ml-auto">
            <ChatButton
              location="menu"
              className="btn-secondary flex-1 md:flex-none"
              onClick={onNavigate}
            />
            <BookLink
              location="menu"
              className="btn-primary flex-1 md:flex-none"
              onClick={onNavigate}
            />
          </div>
        </div>
      </div>
    </>
  );
}
