import dynamic from "next/dynamic";
import { getService } from "@/content";
import { Photo } from "./Photo";
const PlanToggle = dynamic(() => import("./PlanToggle").then((m) => m.PlanToggle));

// Every bullet is a deliverable from the content files, so nothing here is a new claim. Left out on purpose:
// the guarantee and the free-fix value (both are the old business's facts in brand.ts legacyFacts),
// and hosting (care-plans.ts says plans work with the client's existing host).
const oneTime = getService("emergency")!.deliverables;
const plan = getService("care-plans")!.deliverables.slice(0, 4);

const sizes = "(min-width: 1152px) 552px, (min-width: 768px) 50vw, 100vw";

/** v3 home: interactive toggle comparison, one-time fix vs care plan. */
export function PlanCompare() {
  return (
    <section aria-labelledby="prevent" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <p className="text-sm font-semibold text-accent-text">Prevent the next one</p>
      <h2 id="prevent" className="mt-2 font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        Fix it once, or keep it fixed
      </h2>
      <div className="mt-10">
        <PlanToggle
          modes={{
            fix: {
              label: "One-time fix",
              title: "One problem, found and fixed.",
              items: oneTime,
              image: <Photo id="night-desk" decorative sizes={sizes} />,
            },
            plan: {
              label: "Care plan",
              title: "Your site, looked after every month.",
              items: plan,
              image: <Photo id="cables" decorative sizes={sizes} />,
            },
          }}
        />
      </div>
    </section>
  );
}
