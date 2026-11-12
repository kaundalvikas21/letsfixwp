"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

const COARSE = "(pointer: coarse)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(COARSE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** True on the server, so no tilt handler ships to a device that has no pointer to answer. */
const useCoarsePointer = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(COARSE).matches, () => true);

/** The resting angle: turned toward the reader, top and right faces showing. */
const REST = { x: -16, y: -26 };
/** How far the pointer can lean it from rest, in degrees. */
const REACH = { x: 10, y: 14 };
/** Contract rule 10's spring: stiffness 100, damping 20, critically damped enough that it never wobbles. */
const SPRING = { stiffness: 100, damping: 20 };
const SLICES = 12;

/**
 * The guide's "When to call us" block: an ember slab extruded from twelve slices (`tilt-slab` in
 * globals.css), holding the parent service's mark on its face. It leans after the pointer anywhere
 * over its own field and springs back to rest when the pointer leaves: feedback that the panel is the
 * live part of the page. Static at rest under reduced motion and on coarse pointers.
 *
 * Built from the motion-primitives Tilt pattern (21st.dev), rebuilt on the site's spring and tokens.
 */
export function TiltSlab({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const coarse = useCoarsePointer();
  const off = reduce || coarse;
  const rotateX = useSpring(REST.x, SPRING);
  const rotateY = useSpring(REST.y, SPRING);

  return (
    <div
      aria-hidden
      className="grid h-full min-h-44 place-items-center [perspective:50rem]"
      onPointerMove={(e) => {
        if (off) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotateY.set(REST.y + px * 2 * REACH.y);
        rotateX.set(REST.x - py * 2 * REACH.x);
      }}
      onPointerLeave={() => {
        rotateX.set(REST.x);
        rotateY.set(REST.y);
      }}
    >
      <motion.div className="tilt-slab" style={off ? { rotateX: REST.x, rotateY: REST.y } : { rotateX, rotateY }}>
        {Array.from({ length: SLICES }, (_, i) => (
          <span key={i} data-slice style={{ "--n": SLICES - i } as CSSProperties} />
        ))}
        <span data-face>{children}</span>
      </motion.div>
    </div>
  );
}
