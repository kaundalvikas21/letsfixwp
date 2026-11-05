"use client";

import { XIcon } from "@phosphor-icons/react/ssr";
import { AnimatePresence, m, useReducedMotion, useScroll, useMotionValueEvent } from "motion/react";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { MotionFeatures } from "./MotionFeatures";
import { duration, easing, mobileBreakpoint, stickyCtaThreshold } from "./tokens";

/**
 * A persistent call to action that arrives once the reader is 60% of the way down, and can be sent
 * away.
 *
 * **Desktop only (>= 768px), and that is the whole reason it is safe to add.** This site already
 * has a mobile action bar whose space is reserved in `globals.css`, plus a chat widget that floats
 * on every route. A third floating control on a phone would be two too many, so below the
 * breakpoint this renders nothing at all.
 *
 * **Dismissible, and it stays dismissed.** A CTA you cannot remove is an advert. The choice is kept
 * in `sessionStorage`, not `localStorage`: a visitor who comes back next week is a different visit,
 * but one who is still reading should not be asked twice. Storage access is wrapped, because it
 * throws outright in some privacy modes.
 *
 * `hiddenOn` takes path prefixes. The brief named checkout and account routes, which this site does
 * not have; the equivalent here is the pages that already **are** the conversion step, where a
 * floating "get a quote" is pestering someone who is filling in the quote form.
 *
 * Under reduced motion it still appears, because its arrival is information rather than decoration,
 * but it cross-fades in place instead of sliding (rule 3).
 */
export function StickyCTA({
  children,
  hiddenOn = [],
  threshold = stickyCtaThreshold,
  label = "Shortcut",
}: {
  children: ReactNode;
  /** Path prefixes this must never appear on. */
  hiddenOn?: string[];
  /** Scroll depth, 0 to 1. */
  threshold?: number;
  /** Names the region for assistive tech, since its contents are usually just a button. */
  label?: string;
}) {
  return (
    <MotionFeatures>
      <Bar hiddenOn={hiddenOn} threshold={threshold} label={label}>
        {children}
      </Bar>
    </MotionFeatures>
  );
}

const KEY = "lfw:sticky-cta";

/**
 * Both pieces of client-only state are read through `useSyncExternalStore`, which is the idiom
 * `Magnetic` already uses on this site for its coarse-pointer check.
 *
 * It is not a style preference. Each one has a **server snapshot that renders nothing** (not wide,
 * already dismissed), so the server and the first client render agree by construction and there is
 * no hydration mismatch and no flash to patch (rule 7). Reading these in an effect and calling
 * `setState` would produce the same pixels and a lint error, and would be a second render for
 * something the first render can already answer.
 */
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(`(min-width: ${mobileBreakpoint}px)`);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const readWide = () => window.matchMedia(`(min-width: ${mobileBreakpoint}px)`).matches;

// sessionStorage fires no event in the tab that wrote it, so dismissing has to tell its own
// subscribers. One module-level set, because there is one bar.
const dismissListeners = new Set<() => void>();
// In-memory mirror. Private mode throws on `setItem` as well as on `getItem`, so without this a
// visitor there could press the close button and watch nothing happen.
let dismissedHere = false;
const subscribeDismissed = (cb: () => void) => {
  dismissListeners.add(cb);
  return () => void dismissListeners.delete(cb);
};
const readDismissed = () => {
  if (dismissedHere) return true;
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    // Private mode throws on access. Treat it as "not dismissed": the bar shows, and dismissing it
    // works for this page view even though the choice cannot be stored.
    return false;
  }
};

function Bar({
  children,
  hiddenOn,
  threshold,
  label,
}: {
  children: ReactNode;
  hiddenOn: string[];
  threshold: number;
  label: string;
}) {
  const path = usePathname();
  const reduce = useReducedMotion();
  const [past, setPast] = useState(false);
  const { scrollYProgress } = useScroll();
  const wide = useSyncExternalStore(subscribeWide, readWide, () => false);
  const dismissed = useSyncExternalStore(subscribeDismissed, readDismissed, () => true);

  useMotionValueEvent(scrollYProgress, "change", (v) => setPast(v >= threshold));

  const blocked = hiddenOn.some((p) => path === p || path.startsWith(p));
  const show = wide && past && !dismissed && !blocked;

  const close = () => {
    dismissedHere = true;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode: the bar comes back on the next navigation, which is the harmless failure */
    }
    dismissListeners.forEach((l) => l());
  };

  return (
    <AnimatePresence>
      {show && (
        <m.div
          key="sticky-cta"
          aria-label={label}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: reduce ? 0 : duration.smallUi, ease: [...easing] }}
          className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-[14px] border border-line-strong bg-surface p-3 pl-5 shadow-lift"
        >
          {children}
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-[14px] border border-line text-muted transition-colors duration-150 hover:text-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] motion-reduce:transition-none"
          >
            <XIcon weight="bold" aria-hidden className="size-4" />
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}
