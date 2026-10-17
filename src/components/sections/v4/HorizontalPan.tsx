"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned scene 2 of 2 on this page (taste-skill skeleton 5.B). The section pins at the top of the
 * viewport and the track slides left as the page scrolls: the fix moving forward, one panel at a time.
 * The ember rail along the bottom is on the same scrubbed timeline, so it says how far through the
 * fix you are, which a hijacked scroll otherwise hides.
 *
 * Two deviations from the skeleton, both asked for by the brief: gsap.matchMedia gates the scene on
 * 768px and up with motion allowed, so under that, and under reduced motion, the panels are a plain
 * vertical list with no rail; and useGSAP owns the cleanup.
 */
export function HorizontalPan({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // Measured fresh every refresh rather than captured once. It used to be a const read at setup,
        // so invalidateOnRefresh re-ran `end` and the tween against a stale number: resize the window
        // and the track under- or over-travelled, leaving the last panel short of the viewport.
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        if (distance() <= 0) return;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: wrap.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              // ScrollTrigger pins by switching the element to position: fixed, and that switch is a
              // layout change the browser scores as a shift. This one scene was the whole page's CLS:
              // 1.84 against a 0.1 budget, in two jumps as the pin engaged and released. Pinning by
              // transform keeps the element in flow and moves it instead.
              pinType: "transform",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(track.current, { x: () => -distance(), ease: "none" }, 0)
          .fromTo(rail.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
        void document.fonts.ready.then(() => ScrollTrigger.refresh());
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="relative overflow-hidden">
      <div
        ref={track}
        className="flex flex-col gap-6 px-4 py-4 md:px-6 motion-safe:md:h-[100dvh] motion-safe:md:flex-row motion-safe:md:items-center motion-safe:md:gap-8 motion-safe:md:py-0"
      >
        {children}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-[2px] bg-line motion-safe:md:block">
        <div ref={rail} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
