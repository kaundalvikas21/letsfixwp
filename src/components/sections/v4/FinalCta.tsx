import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { BookLink, ChatButton } from "@/components/Cta";
import { Photo } from "@/components/Photo";
import { brand } from "@/config/brand";
import { CtaReveal } from "./CtaReveal";
import { Magnetic } from "./Magnetic";

// brand.claims.bookingMinutes: gated like every other claim, so a production deploy fails until the
// owner confirms it.
const minutes = brand.claims.bookingMinutes;

/**
 * The closing banner: one photograph across the full width with the last thing the page says on top
 * of it. Height comes from the content, not from a viewport unit, so the section is dense instead of
 * leaving a screen of empty page under the ask.
 *
 * The frame is `emergency`, the brightest real scene in the library (mean luminance 56 against 13 to
 * 28 for the other night frames, measured). It is mirrored so its light, which sits in its left fifth,
 * falls on the side away from the type: better contrast for the words, better composition for the eye.
 */
export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta"
      // No min-height: the banner is exactly as tall as what it holds, plus its padding.
      className="relative isolate overflow-hidden py-20 md:py-24"
    >
      <Photo id="emergency" decorative sizes="100vw" className="absolute inset-0 -z-10 [transform:scaleX(-1)]" />
      {/* The flat scrim, never a gradient: --text over it measures 5.6:1 against the brightest pixel a
          photograph can hold, which is why both lines here are --text and neither is --muted (2.55:1). */}
      <span aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <CtaReveal>
          <h2
            id="final-cta"
            className="max-w-[9ch] font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_96]"
          >
            Let&rsquo;s fix it.
          </h2>

          <p className="mt-6 max-w-[34ch] text-lg text-text">
            Describe what your site is doing. Booking takes about {minutes} minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnetic>
              {/* The arrow sits in its own chip inside the button, flush with the inner padding, and
                  moves on hover while the label stays put. */}
              <BookLink
                location="home:final"
                className="btn-primary group h-14 gap-3 pr-2 pl-6 text-lg"
                icon={
                  <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-on-accent/10 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none">
                    <ArrowRightIcon weight="duotone" className="size-5" aria-hidden />
                  </span>
                }
              />
            </Magnetic>
            <ChatButton
              location="home:final"
              className="min-h-11 cursor-pointer text-lg font-semibold text-text underline underline-offset-4 hover:no-underline"
            />
          </div>
        </CtaReveal>
      </div>
    </section>
  );
}
