import dynamic from "next/dynamic";
import type { PhotoId } from "@/content/photos";
import { hasScreen, Photo, Screen } from "./Photo";
const StepsTabs = dynamic(() => import("./StepsTabs").then((m) => m.StepsTabs));

// Each step shows its real capture in a device frame once the file exists; until then a stand-in photo
// (docs/image-todo.md). booking and quote: screenshots of /contact once v3 styles it. before and after:
// `npm run capture` (needs Docker). Stand-ins avoid frames the hero and bento already use on this page.
// Copy leans only on claims gated in brand.claims (fixed price, backup first).
const STEPS: { verb: string; text: string; capture: string; alt: string; standIn: PhotoId }[] = [
  {
    verb: "Describe",
    text: "Tell us what your site is doing and where it lives. Not sure what broke? Describe what you see.",
    capture: "/screens/booking.png",
    alt: "The booking form asking what the site is doing and which site it is",
    standIn: "terminal",
  },
  {
    verb: "Approve",
    text: "An engineer looks at the problem and quotes a fixed price. No work starts until you approve it.",
    capture: "/screens/quote.png",
    alt: "A fixed-price quote waiting for approval",
    standIn: "emergency",
  },
  {
    verb: "Fix",
    text: "We take a full backup, then fix the cause, not the symptom. Your content, settings and design stay as they were.",
    capture: "/screens/critical-error-on-this-website.png",
    alt: 'Before: the WordPress page reading "There has been a critical error on this website."',
    standIn: "racks",
  },
  {
    verb: "Verify",
    text: "We test the home page, forms, logins and checkout before calling it done. You get a note of what changed.",
    capture: "/screens/restored.png",
    alt: "After: the same WordPress site loading normally",
    standIn: "workspace",
  },
];

const sizes = "(min-width: 1152px) 620px, (min-width: 768px) 58vw, 100vw";

/** v3 home: tabbed showcase of the four moves from broken to fixed. */
export function Steps() {
  const steps = STEPS.map((s) => ({
    verb: s.verb,
    text: s.text,
    media: hasScreen(s.capture) ? (
      <Screen src={s.capture} alt={s.alt} sizes={sizes} />
    ) : (
      <div className="aspect-[16/10] overflow-hidden rounded-[20px] shadow-card">
        <Photo id={s.standIn} decorative sizes={sizes} />
      </div>
    ),
  }));

  return (
    <section aria-labelledby="four-moves" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <h2 id="four-moves" className="max-w-[18ch] font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        From broken to fixed in four moves
      </h2>
      <div className="mt-8">
        <StepsTabs steps={steps} />
      </div>
    </section>
  );
}
