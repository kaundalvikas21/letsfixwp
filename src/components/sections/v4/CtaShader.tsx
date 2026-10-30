"use client";

import { NeuroNoise } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

/**
 * The flowing field behind the home page's closing CTA (`@paper-design/shaders-react`).
 *
 * An isolated `'use client'` leaf, which contract rule 2 requires of anything that animates, and
 * the only WebGL on the site. It is deliberately on this one section: `ClosingBand` carries the
 * same job on about 99 routes, and a render loop on every page of the site is a different
 * proposition from one on the home page's final moment. Measured before it was written: the shader
 * code-splits to 37KB raw / 12KB gzipped and that chunk loads only on routes that use it.
 *
 * **Colours come from the tokens, not from literals.** A WebGL uniform cannot read a CSS variable,
 * and the obvious shortcut is to paste `#FF5A36` into the props, which puts the accent in two
 * places and quietly breaks the next time a token moves. So the values are read off
 * `document.documentElement` and handed to the shader. The one-accent lock is the
 * reason only `colorMid` is ember: back and front are the page's own dark tones, so the accent
 * reads as filaments through the field rather than as a wash competing with the button.
 *
 * Nothing renders until the tokens are read. A single paint at the shader's own defaults would be
 * a flash of the wrong palette, and the section already has its flat scrim and `--bg` underneath,
 * so there is nothing missing in that first frame.
 *
 * `useSyncExternalStore` rather than `useState` in an effect, which is the same choice `Magnetic`
 * makes two files over and for the same two reasons: writing state from an effect body is the
 * cascading render `react-hooks/set-state-in-effect` exists to stop, and a `useState` initializer
 * that read the tokens would render the shader on the client's first pass while the server rendered
 * nothing, which is a hydration mismatch. The server snapshot is `null`, so both agree on the first
 * frame and the shader arrives on the second.
 */

const TOKENS = ["--bg", "--accent", "--surface-2"] as const;

/** Tokens do not change at runtime here, so there is nothing to subscribe to. */
const subscribe = () => () => {};

/**
 * Whether this browser can actually run the thing, checked before it is mounted.
 *
 * Without this the library throws `Paper Shaders: WebGL is not supported in this browser` as an
 * **uncaught promise rejection**, which no error boundary catches because it is not a render error.
 * Observed here: the browser these changes were checked in has no WebGL, and so does any visitor
 * whose GPU is on a driver blocklist, who has hardware acceleration off, or who is behind a privacy
 * setting that disables the context. They would get a console error and a blank canvas.
 *
 * Detecting first means they get neither: the component renders nothing, and the section falls back
 * to the `--bg` layer and the scrim already underneath it, which is a complete design on its own.
 * The probe canvas is never attached to the document and is collected straight after.
 */
const hasWebGl = () => {
  try {
    const probe = document.createElement("canvas");
    return !!(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
};

let cached: string | null = null;
const readTokens = () => {
  if (cached === null) {
    if (!hasWebGl()) return (cached = "");
    const style = getComputedStyle(document.documentElement);
    // One string rather than an object: `useSyncExternalStore` compares snapshots by identity, and
    // a fresh object every call is an infinite re-render.
    cached = TOKENS.map((t) => style.getPropertyValue(t).trim()).join("|");
  }
  return cached;
};

export function CtaShader() {
  const reduce = useReducedMotion();
  const snapshot = useSyncExternalStore(subscribe, readTokens, () => null);

  if (!snapshot) return null;
  const [back, mid, front] = snapshot.split("|");

  return (
    <NeuroNoise
      // Decoration with no meaning of its own: there is nothing here for a screen reader to be told.
      aria-hidden
      className="absolute inset-0 -z-10 size-full"
      colorBack={back}
      colorMid={mid}
      colorFront={front}
      brightness={0}
      contrast={1}
      scale={0.55}
      // The reference runs this at 1. A third of that here, because MASTER's motion table ends with
      // "nothing else moves" and a field that visibly churns behind the last thing the page says
      // competes with it. Reduced motion stops the clock outright: `speed: 0` holds frame one, so
      // the field is still there and simply still.
      speed={reduce ? 0 : 0.32}
    />
  );
}
