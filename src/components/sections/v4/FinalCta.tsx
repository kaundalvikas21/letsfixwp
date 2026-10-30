import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { BookLink, ChatButton } from "@/components/Cta";
import { brand } from "@/config/brand";
import { CtaReveal } from "./CtaReveal";
import { CtaShader } from "./CtaShader";
import { MaskRise } from "./MaskRise";
import { Magnetic } from "./Magnetic";

// brand.claims.bookingMinutes: gated like every other claim, so a production deploy fails until the
// owner confirms it.
const minutes = brand.claims.bookingMinutes;

/**
 * The closing banner: one photograph across the full width with the last thing the page says on top
 * of it. Height comes from the content, not from a viewport unit, so the section is dense instead of
 * leaving a screen of empty page under the ask.
 *
 * The background is a shader now, not a photograph. It was `emergency`, mirrored so its light fell
 * away from the type; that reasoning is kept in the ledger because it was sound and because this is
 * reversible in one line. The owner asked for the field here, and the two cannot both be the
 * background: a photograph under a flowing field is two backgrounds competing, and the scrim that
 * makes either legible would flatten both.
 *
 * The flat scrim stays exactly where it was. It is what the section's contrast is measured against,
 * and it does not care what is underneath it.
 */
export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta"
      // No min-height: the banner is exactly as tall as what it holds, plus its padding.
      className="relative isolate overflow-hidden py-20 md:py-32"
    >
      {/* `--bg` under the shader so the section is never bare while the client leaf is deciding its
          colours, and so a visitor with WebGL unavailable gets the page's own black rather than a
          white rectangle. */}
      <span aria-hidden className="absolute inset-0 -z-20 bg-bg" />
      <CtaShader />
      {/* The flat scrim, never a gradient. It measured 5.6:1 for --text against the brightest pixel a
          photograph could hold, and the shader's brightest pixel is darker than that, so the
          guarantee is unchanged and both lines here stay --text rather than --muted (2.55:1). */}
      <span aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        {/* The last thing the page says, and the only line on it, so it is set at the scale that
            earns: 128px at 1440 against the 112px it ran at, filling the spine rather than a third
            of it. It stays one line at every width, which is what the ch cap is holding. It is also
            the one place on this section with an authored moment, so it is outside CtaReveal and
            rises out of a clip box of its own rather than taking the block's 14px nudge. */}
        <h2
          id="final-cta"
          className="max-w-[11ch] font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_96]"
        >
          {/* The clip box needs the descender room the line-height does not give it, or the comma
              and the dot are shaved off the bottom of the mask. */}
          <MaskRise className="pb-[0.08em]">Let&rsquo;s fix it.</MaskRise>
        </h2>

        <CtaReveal>
          <p className="mt-6 max-w-[34ch] text-lg text-text">
            Describe what your site is doing. Booking takes about {minutes} minutes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Magnetic>
              {/* The arrow sits in its own chip inside the button, flush with the inner padding, and
                  moves on hover while the label stays put.

                  Its own chip rather than the shared `.cta-chip`, because this button is h-14 at
                  text-lg and a 28px mark inside it would read as a mark that did not grow with the
                  button. `transition-[translate]`, not `transition-transform`: Tailwind writes
                  `translate-x-0.5` to the standalone `translate` property, so naming `transform`
                  moved nothing and this chip had been snapping its 2px. */}
              <BookLink
                location="home:final"
                className="btn-primary group h-14 gap-3 pr-2 pl-6 text-lg"
                icon={
                  <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-on-accent/10 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:translate-none!">
                    <ArrowRightIcon weight="duotone" className="size-5" aria-hidden />
                  </span>
                }
              />
            </Magnetic>
            {/* No chip: this one is a run of underlined text, not a button, and a chip inside it
                reads as a bullet that wandered in. */}
            <ChatButton
              location="home:final"
              icon={null}
              className="min-h-11 cursor-pointer text-lg font-semibold text-text underline underline-offset-4 hover:no-underline"
            />
          </div>
        </CtaReveal>
      </div>
    </section>
  );
}
