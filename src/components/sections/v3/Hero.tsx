import { Illustration } from "@/components/sections/v3/Photo";
import { BookLink, ChatButton } from "@/components/Cta";
import { brand } from "@/config/brand";

/**
 * The hero asserts five claims, and every one of them reads its gate in brand.claims (src/config/brand.ts), so a
 * claim the owner turns off loses its words here rather than only failing the build: `sameDay` is the headline's
 * "today", and `vetted`, `bookingMinutes`, `fixedPrice` and `backupFirst` are the four halves of the subtext.
 * Composed at module scope, so this stays a Server Component with no client JS in the LCP path (rule 13), and
 * the headline is still one string the h1 splits per word for the CSS `rise` stagger.
 * `bookingMinutes` is interpolated rather than spelled out, the pattern `checkTurnaround` already uses, so the
 * number on screen is the gated value itself. Each claim off leaves a shorter sentence that still reads:
 * "Your WordPress site, back online." / "Book a WordPress engineer. Full backup first."
 */
const { sameDay, vetted, bookingMinutes, fixedPrice, backupFirst } = brand.claims;

const HEADLINE = sameDay ? "Your WordPress site, back online today." : "Your WordPress site, back online.";

const booking = `Book a ${vetted ? "vetted " : ""}WordPress engineer${bookingMinutes ? ` in ${bookingMinutes} minute${bookingMinutes === 1 ? "" : "s"}` : ""}.`;
const assurance = [fixedPrice && "fixed price", backupFirst && "full backup first"].filter(Boolean).join(", ");
const SUBTEXT = assurance ? `${booking} ${assurance[0].toUpperCase()}${assurance.slice(1)}.` : booking;

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
            {/* The plate the whole site now uses. It replaced the one daylight photograph in the library,
                which was the last photograph in a hero anywhere. */}
            <Illustration id="working-at-laptop" preload sizes="(min-width: 1152px) 528px, (min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
