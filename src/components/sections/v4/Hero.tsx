import { BookLink, ChatButton } from "@/components/Cta";
import { Photo } from "@/components/Photo";
import { brand } from "@/config/brand";
import { HeroRays } from "@/components/motion/interactions/HeroRays";
import { HeroWords } from "./HeroWords";

// The guarantee clause renders only once the owner sets a real guarantee (contract rule 8: a null
// value renders nothing). brand.legacy.facts.guaranteeDays is the old business's promise, not this
// one's, and brand.guarantee is a placeholder until it is confirmed, so today the sentence stops
// after "safely".
const g = brand.guarantee;
const SUBTEXT =
  g && !g.placeholder
    ? `Show us the error. We find the cause, fix it safely, and guarantee the result for ${g.days} days.`
    : "Show us the error. We find the cause and fix it safely.";

/**
 * v4 home hero: kinetic type over a night photograph that bleeds off the right edge.
 * Type sits on columns 1 to 8, the photograph on 7 to 12 and beyond the edge, with a --bg scrim
 * between them so every word keeps the contrast measured in the MASTER table.
 * Under 768px the photograph drops below the CTAs and bleeds right only.
 */
export function Hero() {
  /* `lg:min-h-[100dvh]`, not `min-h-[100dvh]`. Contract rule 4 asks a hero to fill the screen, and
  on a wide window this one does. On a phone it cannot: the content is about 565px and the
  screen is 812, so `items-center` was splitting the 250px difference above and below and the
  section read as a hole with a picture in it. Measured at 375 before this: 94px above the
  photograph, 126px below, 65% of the viewport used. Padding cannot fix that, it makes it
  worse, because shrinking the padding hands the difference straight back to the centring.

  Sizing to its content below lg leaves 32px under the fixed header and 64px before the next
  section, and the next section now peeks above the fold, which says the page scrolls. Rule
  4's actual requirement, the CTA visible without scrolling, is better served than before.
  Logged as a deliberate deviation in docs/layout-ledger.md Task 27; one token to revert. **/
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex items-center overflow-hidden lg:min-h-[100dvh]">
      <div className="mx-auto w-full max-w-page px-4 pt-20 pb-16 [@media(min-height:700px)]:pt-24 md:px-6">
        {/* The photograph leads on a phone and a tablet, then the words; at lg it stops being a
            block in the reading order and becomes the background behind them.

            Below lg it is cropped in a little rather than run at the source's own 3.4:1. Two
            reasons, and the second is the real one. The source at full width is 106px tall on a
            360px screen, a letterbox strip; and the hero is `min-h-[100dvh]` with `items-center`,
            so every pixel the content does not use is split above and below it as dead space. At
            3.4:1 that was about 118px top and bottom. Padding cannot fix that, it makes it worse:
            shrinking the padding shrinks the content and hands the difference straight back to the
            centring. The only lever is a taller content block, so the picture earns its height.

            3/2 keeps the middle 44% of the frame: the mug, the lit monitor with the mark on it and
            the person, which is the part of this picture that says what the page is about. 2/1
            from md up, where the screen is wide enough to open back out.

            Measured at 375, going from the source's own 3.4:1 to 3/2 takes the photograph from
            106px to 240px and the dead space above the fold from 118px to about 65px. What is
            left is structural: the hero is min-h-[100dvh] by contract rule 4 and this content does
            not fill a phone screen, so the remainder is split above and below by `items-center`.
            Only dropping the min-height on small screens removes it completely, and that is a
            contract change rather than a tuning one.

            At lg the window is wide enough to be worth filling: `lg:absolute lg:inset-0` against
            the section, which is the nearest positioned ancestor, and `lg:mx-0` because an
            absolutely positioned box with both insets set still answers its margins and the
            full-bleed negatives would push it past the viewport. 45% keeps the monitors and the
            desk in the middle 47% that survives there. */}
        <div className="-mx-4 aspect-[3/2] overflow-hidden md:-mx-6 md:aspect-[2/1] lg:absolute lg:inset-0 lg:mx-0 lg:aspect-auto">
          <Photo id="hero-background" preload sizes="100vw" className="lg:object-[45%_50%]" />
        </div>

        <div className="mt-10 grid grid-cols-4 gap-x-6 md:grid-cols-12 lg:mt-0">
          <div className="relative z-10 col-span-4 md:col-span-8">
            <h1
              id="hero-title"
              className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] min-[420px]:text-4xl min-[420px]:[font-variation-settings:'opsz'_36] sm:text-5xl sm:[font-variation-settings:'opsz'_48] lg:text-6xl lg:[font-variation-settings:'opsz'_60] xl:text-7xl xl:[font-variation-settings:'opsz'_72]"
            >
              <span className="block">Broken WordPress? </span>
              <HeroWords line="Back online today." ember="today." />
            </h1>
            <p className="mt-6 max-w-[42ch] text-lg text-muted">{SUBTEXT}</p>
            {/* Stacked and full width on a phone, a row from sm up. Two content-width buttons on
                separate lines read as a ragged edge, and the primary is the page's whole job here,
                so it gets the column. `w-full` is safe on both utilities: each is an inline-flex
                box that already centres its own label and chip. */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BookLink location="home:hero" className="btn-primary w-full sm:w-auto" />
              <ChatButton location="home:hero" className="btn-secondary w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* The one gradient in this variation: a legibility scrim, not decoration, and lg-only again.
          Below lg the photograph is a band above the words rather than behind them, so there is
          nothing to veil and the type is back on solid --bg. */}
      <div aria-hidden className="hero-scrim absolute inset-0 hidden lg:block" />

      {/* Light raking in from the top-right corner.

          It has to come after the scrim and the photograph, and that is the whole placement. The
          scrim is `linear-gradient(to right, var(--bg) 0%, var(--bg) 68%, transparent 96%)`, opaque
          --bg across the left two thirds, and the photograph fills the right half at lg, which is
          the corner the light enters from. Put the rays at -z-10, as the closing CTA's field is,
          and both paint straight over them and there is nothing to see. So they sit above the pair,
          in DOM order with no z-index of their own.

          They still never reach the type. The heading column is `relative z-10` and this is at the
          auto level, so the h1 stays on top: it is the LCP element on this route and the one thing
          in the hero that nothing is allowed to cross. */}
      <HeroRays />
    </section>
  );
}
