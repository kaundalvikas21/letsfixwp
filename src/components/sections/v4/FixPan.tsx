import { BookLink } from "@/components/Cta";
import { hasScreen, Photo } from "@/components/Photo";
import type { PhotoId } from "@/content/photos";
import { FixRail } from "./FixRail";
import { Screen } from "./Screen";

// Every "you get" line is a claim gated in brand.claims (src/config/brand.ts), or the note of what
// changed that the v3 page already promises: a production deploy fails until the owner confirms each
// one. No move is numbered (contract rule 6). Captures render the moment they exist; until then a
// night frame stands in, chosen so the pan reuses nothing the hero or the error cards already show.
const PANELS: {
  verb: string;
  happens: string;
  gets: string;
  capture?: string;
  alt?: string;
  standIn: PhotoId;
}[] = [
  {
    verb: "Diagnose",
    happens: "An engineer reproduces the error and reads the logs until the cause is named, not guessed.",
    gets: "A fixed price, agreed before any work starts.",
    capture: "/screens/critical-error-on-this-website.png",
    alt: 'Before: the WordPress page reading "There has been a critical error on this website."',
    standIn: "terminal",
  },
  {
    verb: "Back up",
    happens: "Files and database are copied in full before anything on the site is touched.",
    gets: "A restore point taken before the first change.",
    standIn: "racks",
  },
  {
    verb: "Repair",
    happens: "We fix the cause rather than hiding the symptom, and leave the rest of the site alone.",
    gets: "Your content, settings and design, as they were.",
    standIn: "keys",
  },
  {
    verb: "Verify",
    happens: "The home page, forms, logins and checkout are all tested before the job is called done.",
    gets: "A note of what changed.",
    capture: "/screens/restored.png",
    alt: "After: the same WordPress site loading normally",
    standIn: "workspace",
  },
  {
    verb: "Harden",
    happens: "Whatever let the fault in gets closed, and what was out of date gets updated.",
    gets: "Our access removed when the work is done.",
    standIn: "cables",
  },
];

// min-h so the row shares one baseline: the panels measured 431, 431, 455, 431, 431, and a rail of
// unequal cards misaligns top and bottom by 12px as it moves past.
const panel =
  "flex shrink-0 flex-col rounded-[14px] border border-line bg-surface p-5 shadow-card md:min-h-[29rem] md:p-6 w-[84vw] max-w-[26rem] md:w-[26rem]";
const sizes = "(min-width: 768px) 26rem, 84vw";

/**
 * Funnel stage two, the fix: the five moves on one line that walks sideways as the page scrolls
 * past it, and the ask on the heading's line.
 *
 * It was a pinned GSAP scene that converted 1528px of vertical scroll into the same sideways move.
 * The content is unchanged and so is the sideways move; what went is the scroll hijack. The section
 * is an ordinary block in the flow now, the page keeps scrolling vertically the whole way through
 * it, and the rail reads that scroll rather than taking it. FixRail holds the mapping.
 */
export function FixPan() {
  return (
    // Full width, so the rail can run off the right edge of the window rather than stopping at the
    // 72rem container. Only the heading block is held to the spine.
    <section aria-labelledby="the-fix" className="py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:gap-10 md:px-6">
        <h2
          id="the-fix"
          className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
        >
          Here is what we do next.
        </h2>
        {/* The ask was the last beat of the track, which meant reaching the end of the row to find
            it. On the heading's line it is there from the first glance. */}
        <BookLink location="home:fix-pan" className="btn-primary shrink-0" />
      </div>

      <FixRail label="The five moves of a fix">
        {PANELS.map((p) => (
          <article key={p.verb} className={panel}>
            {p.capture && hasScreen(p.capture) ? (
              // The capture carries its own frame, so it is not boxed into an aspect ratio twice.
              <Screen src={p.capture} alt={p.alt!} sizes={sizes} />
            ) : (
              <div className="aspect-[16/10] overflow-hidden rounded-[14px]">
                <Photo id={p.standIn} decorative sizes={sizes} />
              </div>
            )}
            <h3 className="mt-5 font-display text-2xl leading-tight font-extrabold tracking-[-0.04em]">{p.verb}</h3>
            <p className="mt-2 text-muted">{p.happens}</p>
            <p className="mt-4 text-[15px]">
              <span className="text-muted">You get </span>
              {p.gets}
            </p>
          </article>
        ))}
      </FixRail>
    </section>
  );
}
