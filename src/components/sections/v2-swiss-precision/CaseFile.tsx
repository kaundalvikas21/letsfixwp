import { existsSync } from "node:fs";
import { join } from "node:path";
import { BeforeAfter } from "./BeforeAfter";

// Layout family: before/after comparison slider plus a short narrative. 8 / 4 of 12.
//
// Contract rule 7: every visual is real. Both halves of the slider are captures produced by
// `npm run capture` (scripts/capture-errors.mjs, needs Docker). Until those files exist this
// section renders nothing rather than ship a stand-in photograph dressed up as a screenshot, which
// rule 6 bans outright. Logged in docs/image-todo.md.
//
// The narrative stays generic and names nobody until a real, consented customer case is approved.

const BROKEN = "/screens/critical-error-on-this-website.png";
const RESTORED = "/screens/restored.png";

const hasCapture = (webPath: string) => existsSync(join(process.cwd(), "public", webPath));
const capturesReady = hasCapture(BROKEN) && hasCapture(RESTORED);

const narrative = [
  { label: "Problem", body: "The site returned a critical error and no page would load for visitors." },
  { label: "What we did", body: "We traced the fatal error to a single plugin and restored the site from a backup." },
  { label: "Outcome", body: "The site was serving pages again on the same visit." },
];

export function CaseFile() {
  if (!capturesReady) return null;

  return (
    <section aria-labelledby="case" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">Case file</p>
        <h2 id="case" className="mt-3 max-w-[20ch] text-[clamp(1.75rem,3vw,2.5rem)]">
          What a repair looks like.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          <figure className="md:col-span-8">
            <BeforeAfter
              before={BROKEN}
              after={RESTORED}
              beforeAlt="The site showing the WordPress critical error page instead of its home page"
              afterAlt="The same site restored and serving its home page normally"
            />
            <figcaption className="mt-3 text-sm text-muted">A typical critical-error repair</figcaption>
          </figure>

          <dl className="md:col-span-4">
            {narrative.map((n) => (
              <div key={n.label} className="border-t border-line py-4 first:border-t-0 first:pt-0">
                <dt className="font-medium">{n.label}</dt>
                <dd className="mt-1 text-muted">{n.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
