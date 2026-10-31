"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import { SideRays } from "./SideRays";

/**
 * Light raking across the home hero from the top-right corner, down toward the headline.
 *
 * What it communicates: state. The page opens on a site that has gone dark, and the first thing in
 * the frame is light arriving from off-stage. It is the hero's half of the same sentence the
 * closing CTA's field finishes, which is why both are WebGL and nothing between them is.
 *
 * **Colours come from the tokens, not from literals,** for the reason written out in `CtaShader`:
 * a WebGL uniform cannot read a CSS variable, so pasting `#ff5a36` into the props would put the
 * accent in two places and break the next time a token moves. They are read off
 * `document.documentElement` and handed down.
 *
 * **The one-accent lock decides the palette.** The vendored component ships two ray colours, amber
 * and blue, which is a second accent and is stripped on sight (CLAUDE.md). Here it is `--accent`
 * against `--text`: one ember edge riding a near-white core, which is the shape of the light in
 * the reference the owner gave rather than two colours competing. White is not an accent, so the
 * lock holds.
 *
 * **It reaches toward the headline, so the dials are held under the component's defaults.** The
 * h1, the subtext and both buttons are on top of this. `--text` on `--bg` measures about 17:1 and
 * `--muted` about 7.3:1, so there is real headroom, but light landing behind them spends it, and
 * the brightest moment is the first second after mount while the intro is still growing. Roughly
 * two thirds of the component's `intensity`, `glow` and `opacity`, and the brightness lives in
 * these three numbers alone: raise or lower them together and nothing else needs to move.
 *
 * Not verified by eye. The browser available here reports no WebGL at all, so the canvas renders
 * nothing in it and the numbers above are reasoned from the token contrast rather than looked at.
 * They want one pass from someone with a GPU, and the axe check that would settle it has to be run
 * there too: a contrast scan in a browser without WebGL is measuring the unlit page.
 *
 * **The headline is never covered.** This paints at the auto level inside the hero's own `isolate`,
 * above the photograph and the scrim, and the heading column is `relative z-10`, so the h1 stays on
 * top. It is the LCP element on this route. `min-h-[100dvh]` on the hero gives the canvas a real
 * box without a height of its own.
 *
 * It is deliberately not `-z-10`, which is where the closing CTA's field sits and where this
 * started. Two opaque layers are in the way down there: the hero scrim is `--bg` across its left
 * two thirds, and the photograph fills the right half at lg, which is the corner this light enters
 * from. Underneath both, there was nothing to see at any width.
 *
 * Reduced motion gets `speed: 0` and no pointer tracking: the rays are there, lit and still, which
 * is the final static state rule 10 asks for. The component's own reduced-motion branch only slows
 * the clock to 0.3x, so this does not rely on it.
 *
 * Nothing renders until the tokens are read, so there is no frame at the component's amber-and-blue
 * defaults. The server snapshot is `null` and both passes agree on the first frame.
 */

const TOKENS = ["--accent", "--text"] as const;

/** Tokens do not change at runtime here, so there is nothing to subscribe to. */
const subscribe = () => () => {};

let cached: string | null = null;
const readTokens = () => {
  if (cached === null) {
    const style = getComputedStyle(document.documentElement);
    // One string rather than an object: `useSyncExternalStore` compares snapshots by identity, and
    // a fresh object every call is an infinite re-render.
    cached = TOKENS.map((t) => style.getPropertyValue(t).trim()).join("|");
  }
  return cached;
};

export function HeroRays() {
  const reduce = useReducedMotion();
  const snapshot = useSyncExternalStore(subscribe, readTokens, () => null);

  if (!snapshot) return null;
  const [accent, text] = snapshot.split("|");

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <SideRays
        origin="top-right"
        // Warm fringe over a near-white core, which is what the reference image is: the ember edge
        // reads as the colour and the light itself stays light. `--text` rather than `--muted`
        // because the core in that image is bright, not grey.
        rayColor1={accent}
        rayColor2={text}
        // Past half, so the white core leads and the ember rides its edge.
        blend={0.55}
        // The reference component runs 2.5. A fraction of that: MASTER's motion table ends with
        // "nothing else moves", and light that visibly churns behind the one promise on the page
        // competes with it. Reduced motion holds frame one, lit and still.
        speed={reduce ? 0 : 1}
        // One broad beam with a couple of softer ones beside it, not a fan of thin shafts. Density
        // is what decides that: 4 cut the light into stripes, 2.6 leaves it whole. Sharpness low
        // and falloff low for the same reason, a soft edge that still reaches the far corner.
        intensity={2}
        spread={2.2}
        density={2.6}
        sharpness={0.22}
        falloff={1.15}
        glow={1.15}
        saturation={0.85}
        dust={0}
        // Low influence rather than off: the light leans toward the pointer about as far as the
        // closing CTA's button does, which is the same answer-the-hand idea at the other end of
        // the page. Off entirely under reduced motion, and the component ignores it on a pointer
        // that never enters the box.
        followMouse={!reduce}
        mouseInfluence={0.3}
        intro={!reduce}
        opacity={0.85}
      />
    </div>
  );
}
