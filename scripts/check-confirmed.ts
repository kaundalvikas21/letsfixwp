/**
 * Fails a production build while any value is still waiting on the owner.
 *
 * **This exists because the same check inside `next.config.ts` does not work.** That file still
 * prints the warning, which is useful in dev, but its `process.env.VERCEL_ENV === "production" ||
 * process.env.BRAND_STRICT === "1"` arm never fires: Next loads the compiled config in a context
 * that does not carry the shell environment. Probed directly on Next 16.3.8 by logging
 * `process.env` from inside the config during `next build` with both variables set on the command
 * line, and both read `undefined`. So `BRAND_STRICT=1 next build` exited 0 with three unconfirmed
 * stats, a placeholder-ridden testimonials file and an unconfirmed support email.
 *
 * A gate that reports a problem and then lets the deploy through is worse than no gate, because it
 * is the thing everyone points at when asking whether this can ship. This runs as the first step of
 * `npm run build`, in an ordinary Node process where the environment is the one the shell set.
 *
 * **The trigger is a flag, not only an environment variable, and that is deliberate.** Measured in
 * this setup: `tsx` does not pass the shell environment to the script it runs. `BRAND_STRICT=1 npx
 * tsx -e "console.log(process.env.BRAND_STRICT)"` prints `undefined`, with or without `export`,
 * while the same line under plain `node` prints `1`. So an environment-only gate run through `tsx`
 * is unreliable by construction here. `--strict` is passed by `npm run build:prod` and cannot be
 * lost. The two environment arms are kept for CI that sets them and does reach the process.
 */
import assert from "node:assert";
import { unconfirmedBrandFields } from "../src/config/brand";
import { testimonials } from "../src/content/testimonials";

const placeholders = testimonials.filter((t) => "placeholder" in t && t.placeholder).length;
const unconfirmed = [
  ...unconfirmedBrandFields,
  ...(placeholders ? [`${placeholders} placeholder testimonial(s) in src/content/testimonials.ts`] : []),
];

const strict =
  process.argv.includes("--strict") || process.env.VERCEL_ENV === "production" || process.env.BRAND_STRICT === "1";

if (!unconfirmed.length) {
  console.log("confirmed ok: every brand value and testimonial is the owner's own");
} else if (strict) {
  assert.fail(
    `Unconfirmed values, and this is a production build:\n  - ${unconfirmed.join("\n  - ")}\n` +
      `\nReplace each confirm("...", value) in src/config/brand.ts with the real value, and each\n` +
      `placeholder quote in src/content/testimonials.ts with a real one, then build again.`,
  );
} else {
  console.log(
    `confirmed: ${unconfirmed.length} value(s) still unconfirmed; a production build ` +
      `(npm run build:prod, VERCEL_ENV=production or BRAND_STRICT=1) will fail until they are real.`,
  );
}
