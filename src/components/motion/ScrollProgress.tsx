"use client";

import { m, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MotionFeatures } from "./MotionFeatures";

/**
 * A reading-progress rule across the top of an article.
 *
 * **Contract rule 6 bans scroll cues, and this is one.** The exception is owner-instructed and
 * scoped: article pages only, which on this site means `/guides/<slug>/`. It is recorded in
 * docs/layout-ledger.md with that scope, so the next person to read rule 6 finds the reason rather
 * than an apparent contradiction. Do not mount it on a hub, a service page or the home page.
 *
 * It tracks the visitor's own scrolling 1:1 and originates no motion of its own, which is why it
 * **keeps working under reduced motion** rather than switching off. That is the same call the nav
 * progress rail already makes, for the same reason: a reduced-motion reader still wants to know how
 * much of a 4,000px troubleshooting document is left. The spring only smooths the value.
 *
 * **It takes a selector, not a ref, and that is what keeps the caller a Server Component.** A ref
 * has to be created in a client component, so a `target` prop would force every page that wants a
 * progress bar to carry `"use client"`, which is exactly what brief rule 6 forbids. The element is
 * resolved here instead, after mount, and the bar renders only once it is found.
 *
 * `scaleX` on a fixed 2px layer: no width, no layout, nothing in flow, so it cannot shift the
 * document (rules 1 and 5). It sits under the 64px header rather than adding a second bar.
 */
export function ScrollProgress({
  target,
  className,
}: {
  /**
   * CSS selector for the element whose length the bar reports. Omit it and the bar tracks the whole
   * document, which on a page with a tall footer tells the reader the article is longer than it is.
   */
  target?: string;
  className?: string;
}) {
  return (
    <MotionFeatures>
      <Rule target={target} className={className} />
    </MotionFeatures>
  );
}

function Rule({ target, className }: { target?: string; className?: string }) {
  const el = useRef<HTMLElement | null>(null);
  const [found, setFound] = useState(!target);

  useEffect(() => {
    if (!target) return;
    el.current = document.querySelector<HTMLElement>(target);
    setFound(el.current !== null);
  }, [target]);

  if (!found) return null;
  return <Bar el={target ? el : undefined} className={className} />;
}

function Bar({ el, className }: { el?: React.RefObject<HTMLElement | null>; className?: string }) {
  const { scrollYProgress } = useScroll(el ? { target: el, offset: ["start start", "end end"] } : undefined);
  // Light damping only. The raw value steps with each scroll event and reads as a stutter on a
  // trackpad; this is not an animation in its own right, so it stays close to the input.
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className={className ?? "fixed inset-x-0 top-16 z-30 h-0.5 origin-left bg-accent"}
    />
  );
}
