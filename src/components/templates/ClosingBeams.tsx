"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The closing band's background: a fan of swept beams with ember trails running along a scattered
 * handful of them.
 *
 * The artwork was supplied by the owner as ~8KB of literal SVG and is rendered here as a loop,
 * because it is **entirely generative**: every curve is the first one translated by a fixed step.
 * Verified against three samples from the original (n = 0, 1 and 57) before relying on it. Eight
 * kilobytes of coordinates inlined into twelve routes is eight kilobytes in which a typo is
 * indistinguishable from a curve.
 *
 * **The fan is thinned, which is a deliberate departure from the source.** The original is 58
 * curves at `(+7n, -8n)`, and stretched onto a band this wide it reads as crowded: the owner asked
 * for more air between the lines. This is 39 curves at `(+10.5n, -12n)`, which is **exactly the
 * same overall spread** (399 across, 456 down, because 38 x 10.5 equals 57 x 7) with half again
 * the gap between neighbours. So the artwork occupies the same box and is simply less dense; the
 * emitted paths no longer match the pasted file byte for byte, and that is the one place they
 * deliberately differ.
 *
 * **Retoned for this site.** The source is drawn for a light page in three reds over `#d4d4d4`
 * hairlines at `0.04` opacity. Hardcoded hex is banned here and the variation is accent-locked, so
 * the hairlines take `--text` and the trails take `--accent`; `0.04` is a visible hairline on white
 * and nothing at all over `--surface`, so the base curves sit at `0.1`, about the weight of
 * `--line`.
 *
 * **The static glows became trails.** The source's gradient coordinates were values like
 * `97.10166%`, which is one frame of an animation someone else was running: measured against this
 * viewBox, eleven of its thirteen glows fall outside the window entirely. Rather than freeze a
 * frame, the beams now carry a real travelling segment, which is what the artwork was always doing.
 * The thirteen per-beam gradients are gone with it and one ember falloff replaces them.
 *
 * `preserveAspectRatio="none"`: the band is about 6:1 and the viewBox is 2.2:1, so slicing crops
 * away most of the artwork including the falloff that does the fading. Stretching rakes the curves
 * shallower, which on a band this wide reads as light across it.
 *
 * It is a client component for one reason: the `IntersectionObserver` that stops the animation when
 * the band is off screen. Everything else here renders identically on the server, and the markup
 * does not depend on any client state, so there is nothing for hydration to disagree about.
 */

/** Curve n is curve 0 translated by (+7n, -8n). The seven points below are curve 0. */
const POINTS = [
  [-380, -189],
  [-380, -189],
  [-312, 216],
  [152, 343],
  [616, 470],
  [684, 875],
  [684, 875],
] as const;

/** Gap between neighbouring curves. 1.5x the source's `(7, -8)`; see the note above. */
const STEP = { x: 10.5, y: -12 } as const;

const curve = (n: number) => {
  const [m, c1, c2, c3, c4, c5, c6] = POINTS.map(([x, y]) => [x + STEP.x * n, y + STEP.y * n]);
  return `M${m[0]} ${m[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${c3[0]} ${c3[1]}C${c4[0]} ${c4[1]} ${c5[0]} ${c5[1]} ${c6[0]} ${c6[1]}`;
};

// 39 holds the source's full spread at the wider step: 38 x 10.5 is the same 399 as 57 x 7.
const CURVES = Array.from({ length: 39 }, (_, n) => curve(n));

/**
 * Which curves carry a trail.
 *
 * Scattered by hand rather than taken at a regular interval, because evenly spaced trails read as a
 * mechanism and the owner asked for these to feel random. Never two trails on neighbouring curves
 * either: that puts two lit lines a pixel apart and they read as one thick one, which is what an
 * earlier draft ending 55, 56, 57 did.
 *
 * Carried across from the 58-curve fan by scaling each index by 38/57, so the spacing is unchanged
 * in the artwork's own units: the gaps now run 2, 4, 2, 5, 2, 3, 5, 2, 5, 3, 2, 3, and the tightest
 * of them is 2 x 10.5 = 21 units, exactly the 3 x 7 the tightest pair had before.
 */
const TRAILS = [0, 2, 6, 8, 13, 15, 18, 23, 25, 30, 33, 35, 38];

/**
 * Period and phase per trail.
 *
 * Deterministic, never `Math.random()`: a random value picked during render is a different number
 * on the server than on the client, which is a hydration mismatch on twelve routes. These two
 * expressions are coprime-ish against the trail count, so the set takes a long time to repeat a
 * configuration while every visitor sees the same one.
 *
 * The delay is negative so each trail starts part-way through its own cycle. Without it all thirteen
 * would set off together on the first frame and the band would open with a single visible pulse.
 */
const period = (i: number) => 9 + ((i * 7) % 8);
const phase = (i: number) => -((i * 11) % 17);

export function ClosingBeams() {
  const box = useRef<SVGSVGElement>(null);
  const [offScreen, setOffScreen] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffScreen(!e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={box}
      aria-hidden
      focusable="false"
      data-beams-paused={offScreen}
      className="pointer-events-none absolute inset-0 -z-10 size-full"
      viewBox="0 0 696 316"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* The artwork's own falloff: opaque through the middle of the panel, gone by 43.6%. This is
            what clears the edges and the corners, so nothing here needs a CSS mask. */}
        <radialGradient
          id="closing-beam-fade"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
        >
          <stop offset="0.0666667" stopColor="var(--text)" />
          <stop offset="0.243243" stopColor="var(--text)" />
          <stop offset="0.43594" stopColor="var(--text)" stopOpacity="0" />
        </radialGradient>
        {/* The same falloff in ember, so a trail dims as it runs out towards the panel's edge
            instead of stopping at it. One gradient for all thirteen, where the source had one each. */}
        <radialGradient
          id="closing-beam-ember"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
        >
          <stop offset="0.0666667" stopColor="var(--accent)" />
          <stop offset="0.243243" stopColor="var(--accent)" />
          <stop offset="0.43594" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Every curve in one path, which is one node for the renderer rather than 39. */}
      <path d={CURVES.join("")} stroke="url(#closing-beam-fade)" strokeOpacity="0.1" strokeWidth="0.5" />

      {/* The trails, drawn over the base so each one reads as one of the set catching light rather
          than as a separate stroke beside it. `strokeWidth` is a touch heavier than the base and the
          opacity a good deal higher, which is what separates a lit segment from a hairline without
          putting a glow on the page (MASTER bans those outright). */}
      {TRAILS.map((n, i) => (
        <path
          key={n}
          className="beam-trail"
          d={CURVES[n]}
          stroke="url(#closing-beam-ember)"
          strokeOpacity="0.55"
          strokeWidth="0.75"
          style={{ animationDuration: `${period(i)}s`, animationDelay: `${phase(i)}s` }}
        />
      ))}
    </svg>
  );
}
