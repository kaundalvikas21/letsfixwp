"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned scene 1 of 2 on this page (taste-skill skeleton 5.A). Every card but the last holds at the
 * top of the viewport, and each one is scaled and dimmed by the NEXT card's trigger, so the card you
 * have read shrinks back as the next arrives: recognition, one screen at a time.
 *
 * One mechanism owns the pinning, and it is CSS: `position: sticky` on the card, gated by
 * motion-safe and md. GSAP owns only the scale and dim. The scene used to declare both a sticky card
 * and a ScrollTrigger `pin: true` over the top of it, which is two systems moving one element and
 * the shape of a layout bug; sticky also keeps the stack working when the bundle does not.
 *
 * Deviations from the skeleton, required by the brief: gsap.matchMedia gates the whole scene on 768px
 * and up with motion allowed (under that, and under reduced motion, the cards are a plain vertical
 * list, which is what the CSS does on its own), and useGSAP owns the cleanup.
 */
export function StickyStack({ cards }: { cards: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card", ref.current);
        cardEls.forEach((card, i) => {
          if (i === cardEls.length - 1) return;
          gsap.to(card, {
            scale: 0.92,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: { trigger: cardEls[i + 1], start: "top bottom", end: "top top", scrub: true },
          });
        });
        // The captures and the display font both change the scene's height after first paint, so
        // wait for the images too: refreshing on fonts alone measures the scene before the captures
        // have laid out, and every trigger below is then computed against a stale height.
        const imgs = gsap.utils.toArray<HTMLImageElement>("img", ref.current);
        void Promise.all([
          document.fonts.ready,
          ...imgs.map((img) => (img.complete ? null : img.decode().catch(() => null))),
        ]).then(() => ScrollTrigger.refresh());
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <div
          key={i}
          className={cn(
            "stack-card flex items-center justify-center py-10 motion-safe:md:sticky motion-safe:md:top-0 md:py-0",
            // A full viewport per card, centred, is what makes the stack read: the card you have read
            // needs room to shrink and dim before the next one covers it, and both are centred so the
            // smaller one sits concentrically inside the arriving one. Shortening the box to roughly a
            // card's height leaves ~50px of travel, and the two cards then overlap by a hair instead
            // of replacing each other, which reads as a rendering fault.
            // The last card is the exception: nothing stacks over it, so a full viewport only centred
            // it and left ~180px of dead space before the section's closing CTA.
            i < cards.length - 1 && "md:min-h-[100dvh]",
          )}
        >
          {card}
        </div>
      ))}
    </div>
  );
}
