import { BookLink, ChatButton } from "@/components/Cta";
import { Photo } from "@/components/Photo";
import { brand } from "@/config/brand";
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
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100dvh] items-center overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 pt-20 pb-16 [@media(min-height:700px)]:pt-24 md:px-6">
        <div className="grid grid-cols-4 gap-x-6 md:grid-cols-12">
          <div className="relative z-10 col-span-4 md:col-span-8">
            <h1
              id="hero-title"
              className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] min-[420px]:text-4xl min-[420px]:[font-variation-settings:'opsz'_36] sm:text-5xl sm:[font-variation-settings:'opsz'_48] lg:text-6xl lg:[font-variation-settings:'opsz'_60] xl:text-7xl xl:[font-variation-settings:'opsz'_72]"
            >
              <span className="block">Broken WordPress? </span>
              <HeroWords line="Back online today." ember="today." />
            </h1>
            <p className="mt-6 max-w-[42ch] text-lg text-muted">{SUBTEXT}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <BookLink location="home:hero" className="btn-primary" />
              <ChatButton location="home:hero" className="btn-secondary" />
            </div>
          </div>

          {/* One image, placed twice: a block that bleeds off the right edge under 1024px, the
              columns 7 to 12 panel above it. Two elements would preload two sizes of the LCP.
              sizes at lg is 83vw, not the 50vw the panel is wide: the panel is 50vw by 100dvh and
              object-cover scales a 4:3 source by its height, so the painted width is dvh * 1.333,
              which on a 16:10 window is about 83vw. Advertising 50vw made the browser fetch a 750px
              candidate and paint it across 1200px, and the preload link inherited the same number. */}
          <div className="col-span-4 mt-12 -mr-4 aspect-[4/3] overflow-hidden rounded-l-[14px] md:col-span-12 md:-mr-6 lg:absolute lg:inset-y-0 lg:right-0 lg:left-1/2 lg:mt-0 lg:mr-0 lg:aspect-auto lg:rounded-none">
            <Photo id="hero-console" preload sizes="(min-width: 1024px) 83vw, 100vw" className="object-[60%_50%]" />
          </div>
        </div>
      </div>

      {/* The one gradient in this variation: a legibility scrim, not decoration. After the photograph
          in the DOM so it veils it, before the type in stacking order so the type stays on solid --bg. */}
      <div aria-hidden className="hero-scrim absolute inset-0 hidden lg:block" />
    </section>
  );
}
