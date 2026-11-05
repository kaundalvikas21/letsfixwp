import { Stagger } from "@/components/motion";

/**
 * The section's words, centred on the frame and arriving the first time it comes into view: headline,
 * then the line under it. Same spring and stagger as the quote pair, so the page has one reveal
 * rather than two dialects of one.
 *
 * A flat --photo-scrim, never a gradient, and --on-photo rather than --muted: muted over a
 * photograph measures 2.55:1, the pairing the critical problem tiles rejected for the same reason.
 * pointer-events-none throughout, so copy on the frame never costs a drag on the comparison.
 *
 * **A Server Component.** Its only use of Motion was the two-step stagger, and the server was
 * shipping both of these lines at `opacity: 0`: with JS off, the one section that tells you the
 * site came back said nothing at all. `Stagger` runs the same arrival through the stylesheet, so
 * the words are in the HTML whether or not the bundle ever lands.
 */
export function RestoredOverlay() {
  return (
    <>
      <span aria-hidden className="absolute inset-0 bg-photo-scrim" />
      <Stagger className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center md:p-10">
        <h2
          id="same-site"
          className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] text-on-photo [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
        >
          Same site. Working again.
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg text-on-photo">
          The same pages, the same content, the same theme. Nothing rebuilt, nothing redesigned.
        </p>
      </Stagger>
    </>
  );
}
