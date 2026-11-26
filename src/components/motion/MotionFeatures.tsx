"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * The `LazyMotion` boundary every Motion-driven primitive in this folder sits inside.
 *
 * `domAnimation` is the small feature set: transforms, opacity, exit animations, variants and
 * gestures, and no layout projection. That omission costs one component. Brief rule 1 bans the
 * `layout` prop on scroll-triggered elements, which covers everything in this folder except
 * `TileGrid`, whose layout animation follows a tile through a filter change and is not scroll
 * triggered at all. That file keeps the full import and says why; `domMax` here would put the
 * projection engine in front of every other primitive to serve it.
 *
 * Every primitive wraps itself rather than expecting the app to provide a provider. Nesting
 * `LazyMotion` is safe and the feature bundle is loaded once, so two primitives on one page cost
 * what one does; the alternative is a provider in the root layout, which would put Motion on all 99
 * routes including the ~90 that use no Motion primitive at all.
 *
 * Only `m` components may be used inside this boundary. A `motion.*` component pulls the full
 * feature set back in and defeats the whole arrangement.
 *
 * `check:motion` greps for that, and did not until Task 107: this paragraph named a check that was
 * only ever looking at import paths outside this folder. Every file in `interactions/` used
 * `motion.*` and none of them wrapped itself here, so on all 99 routes the full feature set shipped
 * and `LazyMotion` saved nothing. The grep is rule 3 in that script now, with `TileGrid` as its one
 * named exception.
 */
export function MotionFeatures({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
