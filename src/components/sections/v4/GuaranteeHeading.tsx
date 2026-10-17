"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

const FONT = { fontFamily: "var(--font-bricolage)", fontSize: "128px", fontWeight: 800, letterSpacing: "-5px" } as const;

// The pattern is only painted from md up, so the frame behind it must not be in the DOM below that:
// an <image> inside an unused <pattern> is still fetched, which would put the 76KB back on every
// phone. Same store pattern as Magnetic's pointer check; the server assumes small and adds the
// pattern after mount, which is also when the fill switches to it.
const WIDE = "(min-width: 48rem)";
const useWide = () =>
  useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );

/**
 * The guarantee drawn on: an ember outline traces each letter, then the photograph floods in behind
 * the words.
 *
 * Why SVG rather than the CSS mask this replaced: a stroke cannot be drawn on HTML text. The
 * photograph survives the move as an SVG pattern (the cables frame with the same 0.72 ember veil
 * over it), so the section keeps the one treatment that is only here, and the words stay real text
 * in the DOM rather than becoming an image of text.
 *
 * This is a deliberate third exception to contract rule 10, which otherwise allows transform and
 * opacity only: stroke-dashoffset is the whole effect and nothing else can express it. It is one
 * short heading, it runs once, and it is bounded by its own viewBox.
 *
 * The fill does not fade in, it is uncovered: a clip rectangle scales from the heading's left edge,
 * so the photograph arrives behind the letters in the same direction the outline was drawn and a
 * beat behind it, as though the ink were following the pen. The wipe is scaleX on the clip rect
 * rather than an animated width attribute, which keeps it inside transform and leaves
 * stroke-dashoffset as this component's only exception.
 *
 * Reduced motion draws nothing: the outline is already retracted and the fill already uncovered on
 * the first frame, which is the finished state rather than a hidden one.
 */
export function GuaranteeHeading({ text }: { text: string }) {
  const root = useRef<SVGSVGElement>(null);
  const outline = useRef<SVGTextElement>(null);
  const wipe = useRef<SVGRectElement>(null);
  const [box, setBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const wide = useWide();
  const chars = Array.from(text);

  // getBBox is meaningless until Bricolage has loaded, and the heading would measure against the
  // fallback face and keep a viewBox sized for the wrong letterforms.
  useLayoutEffect(() => {
    let live = true;
    const measure = () => {
      if (!live || !outline.current) return;
      try {
        const b = outline.current.getBBox();
        if (b.width) setBox({ x: b.x - 10, y: b.y - 10, width: b.width + 20, height: b.height + 20 });
      } catch {
        /* not laid out yet */
      }
    };
    measure();
    void document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      live = false;
    };
  }, [text]);

  useGSAP(
    () => {
      if (!box) return;
      const strokes = gsap.utils.toArray<SVGTSpanElement>("[data-ink]", root.current);
      const curtain = wipe.current;
      if (!strokes.length || !curtain) return;
      const len = 900;
      const origin = `${box.x} ${box.y}`;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(strokes, { strokeDasharray: len, strokeDashoffset: 0, opacity: 0 });
        gsap.set(curtain, { scaleX: 1, svgOrigin: origin });
        return;
      }

      gsap.set(strokes, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(curtain, { scaleX: 0, svgOrigin: origin });
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } })
        .to(strokes, { strokeDashoffset: 0, duration: 0.95, ease: "power2.out", stagger: 0.04 }, 0)
        // Starts a beat into the draw and runs a little longer, so the fill trails the outline across
        // the word rather than arriving after it.
        .to(curtain, { scaleX: 1, duration: 1.25, ease: "power1.inOut" }, 0.4)
        .to(strokes, { opacity: 0, duration: 0.45, ease: "power1.out" }, 1.5);
    },
    { scope: root, dependencies: [box] },
  );

  const vb = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : "0 -128 900 170";

  return (
    <svg
      ref={root}
      aria-hidden
      viewBox={vb}
      preserveAspectRatio="xMidYMid meet"
      className="block w-full overflow-visible"
      style={box ? undefined : { visibility: "hidden" }}
    >
      {box && (
        <defs>
          {/* The reveal. A full-size rectangle scaled from the left edge, so the clip grows with a
              transform instead of an animated width. */}
          <clipPath id="guarantee-wipe">
            <rect ref={wipe} x={box.x} y={box.y} width={box.width} height={box.height} />
          </clipPath>
          {/* The same frame and the same 0.72 ember veil the CSS mask used, so the luminance floor
              measured for that treatment still holds. */}
          {wide && (
          <pattern id="guarantee-photo" patternUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.width} height={box.height}>
            {/* Children of a pattern are placed in the tile's own space, not user space: giving these
                the box's x/y pushed the frame outside the tile and left the letters nearly empty. */}
            <image href="/site_images/services/cables.jpg" x="0" y="0" width={box.width} height={box.height} preserveAspectRatio="xMidYMid slice" />
            <rect x="0" y="0" width={box.width} height={box.height} fill="var(--accent)" opacity="0.72" />
          </pattern>
          )}
        </defs>
      )}

      {/* Solid ember below md and wherever the pattern cannot paint: the same fallback the CSS mask
          had, which also keeps the 76KB frame off a phone. */}
      <text data-fill x="0" y="0" style={FONT} className="guarantee-fill" clipPath={box ? "url(#guarantee-wipe)" : undefined}>
        {text}
      </text>

      <text ref={outline} x="0" y="0" fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" style={FONT}>
        {chars.map((c, i) => (
          <tspan data-ink key={i}>
            {c}
          </tspan>
        ))}
      </text>
    </svg>
  );
}
