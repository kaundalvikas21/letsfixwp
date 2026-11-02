/**
 * Guards the animation system's two invariants. Run by `npm run check:motion`, and by `npm run check`.
 *
 * 1. **One source for the token values.** `src/components/motion/tokens.ts` is the source and
 *    `src/app/globals.css` mirrors the subset CSS needs, because `Reveal` and `Stagger` are Server
 *    Components that animate through the stylesheet rather than through Motion. Nothing links the
 *    two at build time, so this compares them and says which declaration is stale.
 * 2. **One place that imports Motion.** Brief rule: no page or section may import `motion/react`.
 *    Anything outside `src/components/motion/` that does is reported with its line.
 *
 * Deliberately a string comparison rather than a CSS parse: the values are five literals and a
 * parser would be more code than the thing it checks.
 */
import assert from "node:assert";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { duration, easingCss, distance, stagger } from "../src/components/motion/tokens";

const css = readFileSync("src/app/globals.css", "utf8");
const fail: string[] = [];

/** Every `--name: value;` declaration in the file, last one wins (which is what the cascade does). */
const declared = new Map<string, string>();
for (const [, name, value] of css.matchAll(/(--motion-[a-z-]+)\s*:\s*([^;]+);/g)) declared.set(name, value.trim());

const expected: Record<string, string> = {
  "--motion-ease": easingCss,
  "--motion-duration": `${duration.standard}s`,
  "--motion-duration-small": `${duration.smallUi}s`,
  "--motion-stagger": `${stagger.step}s`,
};
for (const [name, want] of Object.entries(expected)) {
  const got = declared.get(name);
  if (got !== want) fail.push(`globals.css ${name} is ${got ?? "missing"}, tokens.ts says ${want}`);
}

// `--motion-distance` is declared twice on purpose: the desktop value, then the mobile one inside
// the max-width block. Both are checked, in source order.
const distances = [...css.matchAll(/--motion-distance\s*:\s*([^;]+);/g)].map((m) => m[1].trim());
assert.deepStrictEqual(
  distances,
  [`${distance.desktop}px`, `${distance.mobile}px`],
  `globals.css --motion-distance declarations are ${JSON.stringify(distances)}, tokens.ts says ["${distance.desktop}px", "${distance.mobile}px"]`,
);

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });

const motionDir = join("src", "components", "motion") + sep;
for (const file of walk("src")) {
  if (file.startsWith(motionDir)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/^\s*import .*from ["']motion\/react["']/.test(line) || /from ["']framer-motion["']/.test(line))
      fail.push(`${file}:${i + 1} imports Motion directly; use @/components/motion`);
  });
}

assert.deepStrictEqual(fail, [], `\n  ${fail.join("\n  ")}\n`);
console.log(`motion ok: tokens mirrored in globals.css, no Motion imports outside ${motionDir}`);
