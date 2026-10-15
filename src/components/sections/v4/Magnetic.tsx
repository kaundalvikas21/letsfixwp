"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

const COARSE = "(pointer: coarse)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(COARSE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** True until the client says otherwise, so the server never ships a magnet a touch device cannot use. */
const useCoarsePointer = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(COARSE).matches,
    () => true,
  );

const MAX = 8;
const clamp = (n: number) => Math.max(-MAX, Math.min(MAX, n));

/**
 * The closing CTA leans towards the pointer by at most 8px and springs back when it leaves: feedback,
 * the button answers the hand. Off entirely under reduced motion and on coarse pointers, where there is
 * no hover to answer and the pull would only fight the tap.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const off = reduce || coarse;

  return (
    <motion.span
      ref={ref}
      style={off ? undefined : { x, y }}
      // The field reaches a little past the button, so the pull starts as the pointer arrives rather
      // than only once it is inside. Negative margin keeps the layout where it was.
      className="-m-3 inline-block p-3"
      onPointerMove={(e) => {
        if (off || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(clamp((e.clientX - (r.left + r.width / 2)) * 0.35));
        y.set(clamp((e.clientY - (r.top + r.height / 2)) * 0.35));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
