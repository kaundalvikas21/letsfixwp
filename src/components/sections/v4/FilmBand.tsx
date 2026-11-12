import { Stagger } from "@/components/motion";
import { VideoFrame } from "@/components/VideoFrame";

const ID = "what-a-fix-looks-like" as const;

/**
 * The brand film, on the spine like every other section.
 *
 * **Where it sits, and why.** Between "Same site. Working again." and "Choose how you want help":
 * after the triage path, before the commercial ask. `ProblemTiles` is the section that converts a
 * visitor whose site is down right now, and nothing may come between them and it, so a forty-five second
 * commitment belongs below it. `Plans` is the decision, and trust should be highest in the section
 * immediately before a decision rather than twenty sections earlier.
 *
 * **Layout family: one framed media block on the spine, copy above it, caption under the frame.**
 * `Restored` directly above is also a single framed visual, but it holds its copy *on* the frame
 * (`RestoredOverlay`, on the one scrim pairing this site has measured for text over photography),
 * which is the thing that makes it that section rather than this one. Nothing else on this page is a
 * framed media block, so contract rule 3 holds.
 *
 * It replaced a full-bleed band, and then a chapter index beside the film. Edge to edge made the
 * film the loudest thing on a page whose job is triage; the index added four more controls to a page
 * that already asks the visitor to choose a problem, a plan and a way to get in touch. A poster, a
 * sentence and one play control is the whole section, and it is enough.
 *
 * **LCP.** `VideoFrame` renders the poster through `next/image` and there is no media element at all
 * until `ClipPlayer` mounts one on a click. This page was measured at LCP 5.2s against contract rule
 * 13's 2.5s budget, which is the reason that facade exists.
 *
 * A Server Component; `ClipPlayer` inside the frame is the isolated client leaf. `VideoFrame` also
 * carries the existence gate, so a slot whose files are not on disk falls back to the composed empty
 * state rather than shipping a broken source.
 */
export function FilmBand() {
  return (
    <section aria-labelledby="watch-a-fix" className="reveal mx-auto max-w-page px-4 py-16 md:px-6 md:py-24">
      <Stagger>
        <h2
          id="watch-a-fix"
          className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
        >
          Watch a fix, start to finish.
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg text-muted">
          What happens when your site is down: a fixed price, a backup first, and the site back online.
        </p>
      </Stagger>

      <VideoFrame id={ID} className="mt-10 md:mt-12" />
    </section>
  );
}
