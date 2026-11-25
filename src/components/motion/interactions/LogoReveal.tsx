"use client";

import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { Monogram, monogramSvg } from "@/components/Logo";
import { hasWebGl2 } from "@/lib/webgl";

/**
 * The mark arriving out of glass, on the 404 page and nowhere else.
 *
 * What it communicates: the fix arriving. The visitor is on the one page whose subject is something
 * broken, and the first thing in the frame is the mark forming out of a droplet and settling. It is the
 * same sentence the drop in the wordmark says, given the room to say it once.
 *
 * **Why this route and not the shared band.** Task 15 refused a shader in `ClosingBand` because that band
 * renders on about 99 routes, and that still holds. This is a single route that renders no closing band,
 * carries no other client island, and is not the home page (which already runs `HeroRays` and
 * `CtaShader`). The argument is written out in docs/layout-ledger.md Task 102.
 *
 * **Colours come from the tokens, not from literals,** for the reason written out in `CtaShader`: a WebGL
 * uniform cannot read a CSS variable, so pasting `#ff5a36` into the props would put the accent in two
 * places and break the next time a token moves. They are read off `document.documentElement` and handed
 * down. `useSyncExternalStore` with a `null` server snapshot rather than `useState` in an effect, which is
 * the choice `CtaShader` and `HeroRays` both make and for the same two reasons.
 *
 * **The glass is dialled down to hold the one-accent lock.** MASTER bans glass outside the scrolled nav
 * bar and bans a second hue, and the vendored component arrives with rainbow dispersion and a cool blue
 * rim. The rim is retinted to `--text` through the `uRimCol` uniform that replaced its two blue literals,
 * and dispersion and colour bleed are held low so the light the rim bends stays warm around the ember
 * rather than fanning into a spectrum. Logged as a narrow override in MASTER.
 *
 * **The renderer is fetched, not bundled.** This is the one `next/dynamic` on the site, and it is
 * here because the leaf boundary alone did not hold. Importing the renderer statically put it in the
 * same chunk as `motion/react`, which every route already loads, so the shader went out on all 99 of
 * them: 16.7KB gzipped of WebGL on about 23 routes that otherwise ship no client JS at all. An async
 * import puts it in a chunk of its own, fetched when this component mounts and nowhere else, which
 * is what contract rule 13 asks of a client island below the fold. `ssr: false` because the renderer
 * needs a canvas, and the static mark is what the server sends in its place.
 *
 * **The fallback is the design, not a placeholder.** Reduced motion, no WebGL 2, or tokens not yet read
 * all render the static monogram in ember, which is the reveal's own final state and what contract rule 10
 * asks for. The probe is WebGL 2 specifically, because that is what the renderer asks for: a browser with
 * version 1 and no 2 would pass a looser check and still get an empty box.
 */

const TOKENS = ["--bg", "--accent", "--text", "--surface"] as const;

/** Tokens do not change at runtime here, so there is nothing to subscribe to. */
const subscribe = () => () => {};

let cached: string | null = null;
const readTokens = () => {
  if (cached === null) {
    if (!hasWebGl2()) return (cached = "");
    const style = getComputedStyle(document.documentElement);
    // One string rather than an object: `useSyncExternalStore` compares snapshots by identity, and
    // a fresh object every call is an infinite re-render.
    cached = TOKENS.map((t) => style.getPropertyValue(t).trim()).join("|");
  }
  return cached;
};

/** The still mark, at the size the reveal leaves it. Also what the server renders. */
const Still = () => (
  <div className="flex aspect-square w-full items-center justify-center">
    <Monogram className="w-[38%]" />
  </div>
);

const GlassIconReveal = dynamic(() => import("@/components/ui/liquid-glass-logo-reveal").then((m) => m.GlassIconReveal), {
  ssr: false,
  loading: () => <Still />,
});

export function LogoReveal() {
  const reduce = useReducedMotion();
  const snapshot = useSyncExternalStore(subscribe, readTokens, () => null);

  if (!snapshot || reduce) return <Still />;
  const [bg, accent, text, surface] = snapshot.split("|");

  return (
    <GlassIconReveal
      label="LetsFixWP"
      className="aspect-square w-full rounded-[14px]"
      logo={monogramSvg()}
      background={bg}
      logoColor={accent}
      // The tile the glass sits on while it holds the mark. One step up from the page, which is what
      // every card on the site does.
      plateColor={surface}
      rimColor={text}
      // It plays once. A mark that re-forms every few seconds on a page the visitor is reading is a
      // loop asking to be watched, and MASTER's motion table ends with "nothing else moves".
      loop={false}
      // Low enough that the rim bends the light without splitting it into a spectrum.
      tuning={{ dispersion: 0.4, colorBleed: 0.3 }}
    />
  );
}
