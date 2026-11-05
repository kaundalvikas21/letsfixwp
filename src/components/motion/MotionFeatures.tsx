"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * The `LazyMotion` boundary every Motion-driven primitive in this folder sits inside.
 *
 * `domAnimation` is the small feature set: transforms, opacity, exit animations, variants and
 * gestures, and no layout projection. That last omission is the point rather than a compromise,
 * because brief rule 1 bans the `layout` prop on scroll-triggered elements anyway, and `domMax`
 * would add the projection engine to the bundle to support a feature nothing here is allowed to
 * use.
 *
 * Every primitive wraps itself rather than expecting the app to provide a provider. Nesting
 * `LazyMotion` is safe and the feature bundle is loaded once, so two primitives on one page cost
 * what one does; the alternative is a provider in the root layout, which would put Motion on all 99
 * routes including the ~90 that use no Motion primitive at all.
 *
 * Only `m` components may be used inside this boundary. A `motion.*` component pulls the full
 * feature set back in and defeats the whole arrangement, which is what the `check:motion` script
 * greps for.
 */
export function MotionFeatures({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
