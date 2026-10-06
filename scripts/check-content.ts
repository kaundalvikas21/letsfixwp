// Run: npx tsx scripts/check-content.ts
// One check for the rules a build cannot see: dashes, banned words, CTA wording, and triage matching.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { CTA } from "../src/config/cta";
import { problems } from "../src/content/problems";
import { matchProblem } from "../src/lib/match-problem";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) ? [p] : [];
  });

const files = walk("src");
const fail: string[] = [];
const banned = /\b(elevate|seamless|unleash|robust|leverage|cutting-edge|delve|empower|streamline|unlock|supercharge|game-changer)\b/i;

for (const f of files) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/[–—]/.test(line)) fail.push(`${f}:${i + 1} em/en dash`);
    if (f.includes("content") && banned.test(line)) fail.push(`${f}:${i + 1} banned word: ${line.match(banned)![0]}`);
    if (!f.endsWith(join("config", "cta.ts"))) {
      for (const label of Object.values(CTA)) if (line.includes(`"${label}"`) || line.includes(`>${label}<`)) fail.push(`${f}:${i + 1} CTA label outside cta.ts`);
    }
  });
}
assert.deepEqual(fail, [], fail.join("\n"));

const top = (q: string) => matchProblem(q, problems);
assert.equal(top("white screen blank page")[0], "white-screen-of-death");
assert.equal(top("error establishing a database connection")[0], "error-establishing-database-connection");
assert.equal(top("woocommerce checkout broken")[0], "woocommerce-checkout-not-working");
assert.ok(top("my site redirects visitors to spam").includes("redirect-hack"));
assert.ok(top("ERR_TOO_MANY_REDIRECTS").includes("too-many-redirects"));
assert.deepEqual(top(""), []);
assert.ok(top("x").length === 0);

console.log(`ok: ${problems.length} problems, ${files.length} files scanned`);
