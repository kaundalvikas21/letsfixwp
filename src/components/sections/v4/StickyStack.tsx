"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned scene 1 of 2 on this page (taste-skill skeleton 5.A). Every card but the last pins at the
 * top of the viewport, and each one is scaled and dimmed by the NEXT card's trigger, so the card you
 * have read shrinks back as the next arrives: recognition, one screen at a time.
 *
 * Two deviations from the skeleton, both required by the brief: gsap.matchMedia gates the whole scene
 * on 768px and up with motion allowed (under that, and under reduced motion, the cards are a plain
 * vertical list, which is also what the CSS does on its own), and useGSAP owns the cleanup.
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
          ScrollTrigger.create({
            trigger: card,
            start: "top top",
            endTrigger: cardEls[cardEls.length - 1],
            end: "top top",
            pin: true,
            pinSpacing: false,
          });
          gsap.to(card, {
            scale: 0.92,
            opacity: 0.55,
            ease: "none",
            scrollTrigger: { trigger: cardEls[i + 1], start: "top bottom", end: "top top", scrub: true },
          });
        });
        // The captures and the display font both change the scene's height after first paint.
        void document.fonts.ready.then(() => ScrollTrigger.refresh());
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
          className="stack-card flex items-center justify-center py-10 motion-safe:md:sticky motion-safe:md:top-0 md:min-h-[100dvh] md:py-0"
        >
          {card}
        </div>
      ))}
    </div>
  );
}
