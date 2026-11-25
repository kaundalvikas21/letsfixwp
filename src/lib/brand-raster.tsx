/**
 * The palette and the mark, for the three images rendered by `ImageResponse` (the OG card, the favicon and
 * the touch icon).
 *
 * **Why the hex values are repeated here and nowhere else.** `ImageResponse` runs Satori with no document
 * and no stylesheet, so `var(--accent)` resolves to nothing and a token class does nothing. The values
 * below are copies of the `:root` block in `src/app/globals.css` and have to move with it. That is one
 * duplication in one file, which is the smallest version of this that works: every page component still
 * reads the tokens.
 *
 * Satori draws inline SVG, so the mark is the same geometry the site uses rather than a second drawing of
 * it. It cannot resolve `currentColor`, so the path carries an explicit fill.
 *
 * **The monogram, not the wordmark, is what these images carry.** The drop in "Fix" is placed in `em`
 * against the letter it belongs to, and Satori has neither `em` in SVG attributes nor a baseline to hang
 * it from. On the OG card the name is set at 32px, where a drop that size would be about five pixels tall
 * and lost. The monogram says the same thing at any size and needs no type metrics to sit right.
 */
export const V4 = { bg: "#0c0c0e", text: "#f1f0ee", muted: "#a3a3ad", accent: "#ff5a36" } as const;

/** Mirrors `MONOGRAM_D` in `src/components/Logo.tsx`. */
const MONOGRAM_D =
  "M50 4C50 4 96 54 96 74A46 46 0 1 1 4 74C4 54 50 4 50 4ZM17.6 54H29.6L38.5 83.9L45.7 63.6H54.3L61.5 83.8L70.4 54H82.4L68 102H56L50 85.2L44 102H32Z";

export function RasterMonogram({ width }: { width: number }) {
  return (
    <svg width={width} height={(width * 120) / 100} viewBox="0 0 100 120">
      <path fill={V4.accent} fillRule="evenodd" d={MONOGRAM_D} />
    </svg>
  );
}
