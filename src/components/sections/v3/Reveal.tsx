"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The site's entrance: every element carrying `data-reveal` rises and fades once, the first time it
 * enters the viewport.
 *
 * The mechanism is taken from the reference the brief names (gotechark.com), which runs WOW.js over
 * animate.css: an entry trigger that fires once per element and then stops watching it. That is the part
 * worth copying. What makes it feel alive is granularity, not the effect: 50 separate elements each
 * arriving on their own, rather than a handful of whole sections arriving as blocks.
 *
 * Three things are deliberately not copied. animate.css `fadeInUp` travels translate3d(0, 100%, 0), a
 * full element height, which on a tall card is hundreds of pixels of float; ours travels 16px. Its
 * duration is 1s on the browser default ease; ours is 600ms on the site's own spring, so the page
 * settles rather than drifts. And WOW.js ships a library plus a stylesheet to do it; this is one
 * observer and a CSS rule, with no dependency added.
 *
 * One observer for the whole document rather than a component per element: an element only needs to
 * carry an attribute, so every template stays a Server Component and nothing is wrapped. Re-runs on
 * pathname change because an App Router navigation swaps the content under a shell that never unmounts.
 *
 * The CSS hides `[data-reveal]` before this runs, so the three ways that could strand content are all
 * closed: `prefers-reduced-motion` reveals everything immediately and never observes, a `<noscript>`
 * rule in the document head keeps it visible when scripts never run, and the failsafe below reveals
 * anything still hidden if the observer has not fired, so a stalled script cannot leave a blank page.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const show = (el: Element) => el.classList.add("revealed");
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.revealed)");
    if (els.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(show);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          io.unobserve(entry.target); // once, like the reference: no exit animation, no re-trigger
        }
      },
      // A sliver is enough to count as arrived, and -8% holds the entrance back until the element is
      // properly on screen rather than clipped by the bottom edge.
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));

    const failsafe = window.setTimeout(() => {
      document.querySelectorAll("[data-reveal]:not(.revealed)").forEach(show);
    }, 3000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
