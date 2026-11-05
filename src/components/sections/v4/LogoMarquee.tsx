"use client";

import type { ReactNode } from "react";
import { Marquee } from "@/components/motion";

/**
 * The home page's logo strip.
 *
 * Everything this used to implement by hand (the three-copy track, the pause button, the hover,
 * focus and off-screen stops, the static wrapped row under reduced motion) is now the `Marquee`
 * primitive, and the reasoning for each of those lives on it. What is left here is the call site
 * and the one rule that belongs to the page rather than to the component: contract rule 3 allows
 * one marquee per page, and this is it.
 */
export function LogoMarquee({ logos }: { logos: ReactNode }) {
  return <Marquee label="Platforms we repair">{logos}</Marquee>;
}
