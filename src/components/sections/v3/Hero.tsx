import { BookLink, ChatButton } from "@/components/Cta";
import { Photo } from "./Photo";

// Each claim here is gated by brand.claims (src/config/brand.ts): a production deploy fails until all are confirmed.
const HEADLINE = "Your WordPress site, back online today.";
const SUBTEXT = "Book a vetted WordPress engineer in two minutes. Fixed price, full backup first.";

/**
 * v3 home hero: 6/6 split at lg, the photo offset down so it overlaps the next section by 48px.
 * Entrance is CSS only (no client JS): headline words rise 12px with a 40ms stagger, the photo settles from
 * 0.98. Both use the contract spring (--ease-spring) and run only under motion-safe, so reduced motion is static.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-4 pt-12 pb-16 md:px-6 md:pt-16 lg:pb-0">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h1
            id="hero-title"
            className="font-display text-[2.125rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance sm:text-5xl xl:text-[3.25rem]"
          >
            {HEADLINE.split(" ").map((word, i) => (
              <span key={i}>
                <span
                  className="inline-block motion-safe:animate-[rise_600ms_var(--ease-spring)_both]"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {word}
                </span>{" "}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-muted">{SUBTEXT}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookLink location="home:hero" className="btn-primary" />
            <ChatButton location="home:hero" className="btn-secondary" />
          </div>
        </div>

        <div className="relative z-10 lg:col-span-6 lg:-mb-12 lg:self-end">
          <div className="aspect-[4/3] overflow-hidden rounded-[20px] shadow-lift motion-safe:animate-[settle_600ms_var(--ease-spring)_both]">
            {/* The only daylight frame in the set; still short of the brief, see docs/image-todo.md. */}
            <Photo id="drafting" decorative preload sizes="(min-width: 1152px) 528px, (min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
