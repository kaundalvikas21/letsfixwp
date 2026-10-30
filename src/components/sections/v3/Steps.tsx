import dynamic from "next/dynamic";
import { jobSteps } from "@/content/notices";
import type { IllustrationId } from "@/content/photos";
import { hasScreen, Illustration, Screen } from "./Photo";
const StepsTabs = dynamic(() => import("./StepsTabs").then((m) => m.StepsTabs));


// Which plate stands behind each tab until `npm run capture` has written the real screenshot. Keyed by verb
// rather than index, so reordering the steps cannot silently repoint the images.
const stepArt: Record<string, IllustrationId> = {
  Describe: "working-at-laptop",
  Approve: "charts-and-plans",
  Fix: "settings-and-gears",
  Verify: "browser-with-code",
};

const sizes = "(min-width: 1152px) 620px, (min-width: 768px) 58vw, 100vw";

/** v3 home: tabbed showcase of the four moves from broken to fixed. */
export function Steps() {
  const steps = jobSteps.map((s) => ({
    verb: s.verb,
    text: s.text,
    media: hasScreen(s.capture) ? (
      <Screen src={s.capture} alt={s.alt} sizes={sizes} />
    ) : (
      <div className="aspect-[16/10] overflow-hidden rounded-[20px] shadow-card">
        <Illustration id={stepArt[s.verb] ?? "working-at-laptop"} sizes={sizes} />
      </div>
    ),
  }));

  return (
    <section data-reveal aria-labelledby="four-moves" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <h2 id="four-moves" className="max-w-[18ch] font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        From broken to fixed in four moves
      </h2>
      <div className="mt-8">
        <StepsTabs steps={steps} />
      </div>
    </section>
  );
}
