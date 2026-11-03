// Run: npm run check
// The rules a build cannot see: dashes, banned words, CTA wording, legacy claims, hardcoded links, finder matching.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { brand } from "../src/config/brand";
import { CTA } from "../src/config/cta";
import { matchIndex } from "../src/content";
import { matchProblem } from "../src/lib/match-problem";
import { pngSize } from "../src/lib/png-size";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });

const files = walk("src");
const is = (f: string, ...parts: string[]) => f.endsWith(join(...parts));
const fail: string[] = [];
// Words a model reaches for and this business does not. The first thirteen were the original list;
// the rest came from auditing all 70,879 visible words the site renders against Wikipedia's "Signs
// of AI writing" (docs/layout-ledger.md, Task 71). None of them appeared anywhere in src when they
// were added, so this is a guard against drift rather than a cleanup.
//
// Deliberately absent: "key", "gate" and "critical" have real technical senses here (an API key, a
// gated claim, a critical error), and "not just" is left to judgement, because the five places the
// site uses it are ordinary English, including two questions a customer actually asks.
const banned =
  /\b(elevate|seamless(ly)?|unleash|revolutionize|robust|leverage|cutting-edge|delve|empower(s|ed)?|streamline[sd]?|unlock[sd]?|supercharge|game-changer|showcase[sd]?|testament|underscore[sd]?|tapestry|vibrant|nestled|boasts|breathtaking|groundbreaking|meticulous(ly)?|pivotal|crucial|bolster(s|ed)?|garner(s|ed)?|foster(s|ed|ing)?|enhance[sd]?|enhancing|interplay|deep dive)\b/i;
const legacyClaim = /day or less|30[- ]day|\$150|Garrity|Kwak|Eugene|fixmywp\.com/i;
// "/something/..." string literal. Page links must come from routes.ts; public asset folders are not page links.
const hardcodedPath = /["'`]\/(?!screens\/|previews\/)[a-z][a-z0-9-]*\//;

for (const f of files) {
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      const at = `${f}:${i + 1}`;
      const code = !/^\s*(\/\/|\*|\/\*)/.test(line) && !/(Page|Layout)Props<"/.test(line); // skip comments and route-type args
      if (/[\u2013\u2014]/.test(line)) fail.push(`${at} em/en dash`);
      // Every file, not just src/content: headings, leads, empty states and button copy are written
      // straight into the components and the page files, and those are read by visitors too.
      if (banned.test(line)) fail.push(`${at} banned word: ${line.match(banned)![0]}`);
      if (!is(f, "config", "cta.ts"))
        for (const label of Object.values(CTA))
          if (line.includes(`"${label}"`) || line.includes(`>${label}<`)) fail.push(`${at} CTA label outside cta.ts`);
      // Legacy business claims may live only in brand.ts (gated) and testimonials.ts (rendered only when gated on).
      if (!brand.legacy.enabled && !is(f, "config", "brand.ts") && !is(f, "content", "testimonials.ts") && !is(f, "config", "redirects.ts") && code && legacyClaim.test(line))
        fail.push(`${at} legacy claim while brand.legacy.enabled is false: ${line.match(legacyClaim)![0]}`);
      // Links come only from routes.ts (contract rule 16). Content data is validated against SITEMAP in src/content/index.ts.
      if (!f.includes(`${sep}content${sep}`) && !is(f, "config", "routes.ts") && !is(f, "config", "sitemap.ts") && !is(f, "config", "redirects.ts") && code && hardcodedPath.test(line))
        fail.push(`${at} hardcoded internal path, use routes.ts`);
    });
}
// Markdown under src, which the walker above skips because it only collects .ts and .tsx. Only the
// dash and word rules apply: the others are about page links and CTA wording, and a README quoting
// a path or a label is documenting it rather than shipping it.
const mdFail: string[] = [];
const walkMd = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walkMd(p) : /\.md$/.test(f) ? [p] : [];
  });
for (const f of walkMd("src")) {
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (/[–—]/.test(line)) mdFail.push(`${f}:${i + 1} em/en dash`);
      if (banned.test(line)) mdFail.push(`${f}:${i + 1} banned word: ${line.match(banned)![0]}`);
    });
}
assert.deepEqual([...fail, ...mdFail], [], [...fail, ...mdFail].join("\n"));

const top = (q: string) => matchProblem(q, matchIndex)[0];
assert.equal(top("white screen blank page")?.serviceSlug, "white-screen");
assert.ok(matchProblem("white screen blank page", matchIndex).some((r) => r.guideSlug === "white-screen-of-death"));
assert.equal(top("error establishing a database connection")?.guideSlug, "error-establishing-database-connection");
assert.equal(top("woocommerce checkout broken")?.serviceSlug, "woocommerce-fixes");
assert.ok(matchProblem("my site redirects visitors to spam", matchIndex).some((r) => r.serviceSlug === "malware-removal"));
assert.ok(matchProblem("ERR_TOO_MANY_REDIRECTS", matchIndex).some((r) => r.guideSlug === "too-many-redirects"));
assert.ok(matchProblem("502 bad gateway", matchIndex).some((r) => r.serviceSlug === "server-errors"));
for (const r of matchProblem("site hacked malware", matchIndex)) assert.ok(r.serviceSlug, "every result resolves to a service");
assert.deepEqual(matchProblem("", matchIndex), []);

// RealScreen sizes its box from the PNG header: a real capture must report its own shape, a bad file the fallback.
assert.deepEqual(pngSize(join("public", "screens", "white-screen-of-death.png")), { width: 2736, height: 1536 });
assert.deepEqual(pngSize("package.json"), { width: 1600, height: 1000 });

console.log(`ok: ${matchIndex.length} match candidates, ${files.length} files scanned, legacy ${brand.legacy.enabled ? "on" : "off"}`);
