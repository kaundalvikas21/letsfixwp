// Run: npm run check
// The rules a build cannot see: dashes, banned words, CTA wording, legacy claims, hardcoded links, finder matching.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { brand } from "../src/config/brand";
import { CTA } from "../src/config/cta";
import { matchIndex, services } from "../src/content";
import { bentoSpans } from "../src/lib/bento";
import { matchProblem } from "../src/lib/match-problem";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });

const files = walk("src");
const is = (f: string, ...parts: string[]) => f.endsWith(join(...parts));
const fail: string[] = [];
const banned = /\b(elevate|seamless|unleash|revolutionize|robust|leverage|cutting-edge|delve|empower|streamline|unlock|supercharge|game-changer)\b/i;
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
      if (f.includes(`${sep}content${sep}`) && banned.test(line)) fail.push(`${at} banned word: ${line.match(banned)![0]}`);
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
assert.deepEqual(fail, [], fail.join("\n"));

// The service bento packs rows of 6 columns. Every row must fill the row and never read as equal cards, at
// every step count the schema allows, and the longer step of a pair must get the wider cell.
for (const s of services) {
  const spans = bentoSpans(s.whatWeDo.map((w) => w.detail.length));
  assert.equal(spans.length, s.whatWeDo.length, `${s.id}: one span per step`);
  for (let i = 0; i < spans.length; i += 2) {
    if (i + 1 === spans.length) {
      assert.equal(spans[i], 6, `${s.id}: a lone last step fills its row`);
      break;
    }
    assert.equal(spans[i] + spans[i + 1], 6, `${s.id}: row ${i / 2 + 1} fills 6 columns`);
    assert.notEqual(spans[i], spans[i + 1], `${s.id}: row ${i / 2 + 1} is two equal cards`);
    const wider = spans[i] > spans[i + 1] ? i : i + 1;
    const other = wider === i ? i + 1 : i;
    assert.ok(s.whatWeDo[wider].detail.length >= s.whatWeDo[other].detail.length, `${s.id}: the longer step takes the wider cell`);
  }
}

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

console.log(`ok: ${services.length} service bentos, ${matchIndex.length} match candidates, ${files.length} files scanned, legacy ${brand.legacy.enabled ? "on" : "off"}`);
