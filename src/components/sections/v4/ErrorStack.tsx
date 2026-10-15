import Image from "next/image";
import { BookLink } from "@/components/Cta";
import { hasScreen } from "@/components/Photo";
import { getGuide } from "@/content";
import { StickyStack } from "./StickyStack";

// What you see, in the software's own words. These are quotes of WordPress and Chrome, not our copy,
// which is why they are the only mono text here. The white screen has no words at all, so its line is
// the guide's first symptom instead, set in the body face.
// What it usually means is each guide's most likely cause, so this section cannot drift from the guide.
const CARDS = [
  { slug: "white-screen-of-death", quote: null },
  {
    slug: "critical-error-on-this-website",
    quote: "There has been a critical error on this website.",
  },
  {
    slug: "error-establishing-database-connection",
    quote: "Error establishing a database connection",
  },
  { slug: "google-deceptive-site-warning", quote: "Deceptive site ahead" },
] as const;

function Card({ slug, quote }: { slug: string; quote: string | null }) {
  const guide = getGuide(slug)!;
  const src = `/screens/${guide.image.slot}.png`;
  const captured = hasScreen(src);
  return (
    <article className="mx-auto w-full max-w-4xl px-4 md:px-6">
      <div className="rounded-[14px] border border-line bg-surface p-6 shadow-card md:p-10">
        {/* 70% of the card itself, so the padding does not eat into the capture's share. */}
        <div className="-mx-6 md:-mx-10">
          <div className="mx-auto w-[70%]">
            {captured ? (
              <Image
                src={src}
                alt={guide.image.alt}
                width={1600}
                height={1000}
                sizes="(min-width: 768px) 50vw, 70vw"
                className="rounded-[14px]"
              />
            ) : quote ? (
              // No capture written yet (docs/image-todo.md). Never a div-built browser window: the
              // error's own words, at the size the screen shows them, on a plain panel.
              <p className="flex aspect-[16/10] items-center justify-center rounded-[14px] bg-surface-2 p-6 text-center font-mono text-base leading-snug text-text md:text-xl">
                {quote}
              </p>
            ) : (
              // The white screen has nothing on it, so the panel has nothing on it.
              <div aria-hidden className="aspect-[16/10] rounded-[14px] bg-text" />
            )}
          </div>
        </div>
        {/* What you see, then what it usually means. The capture repeats the words, so the quoted
            line only appears once the capture is there to need a caption. */}
        {quote ? (
          captured && <p className="mt-8 font-mono text-base text-text md:text-lg">{quote}</p>
        ) : (
          <p className="mt-8 text-base text-text md:text-lg">{guide.symptoms[0]}</p>
        )}
        {/* --text, not --muted: this card dims to 0.55 as the next one arrives, and --muted at that
            opacity measures 2.99:1 while --text holds about 5.5:1. */}
        <p className="mt-3 max-w-[52ch]">{guide.likelyCauses[0]}</p>
      </div>
    </article>
  );
}

/**
 * Funnel stage one, the break: four full-viewport cards that stack as you scroll, so the visitor
 * recognises their own screen before anything is asked of them. Server component; the pinning is an
 * isolated GSAP leaf, and this section is the first of the page's two pinned scenes.
 */
export function ErrorStack() {
  return (
    <section
      aria-labelledby="sound-familiar"
      className="relative py-16 md:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2
          id="sound-familiar"
          className="text-sm font-semibold tracking-[0.02em] text-muted"
        >
          Sound familiar?
        </h2>
      </div>
      <a
        href="#seeing-one-of-these"
        className="sr-only focus:not-sr-only focus:mx-auto focus:mt-4 focus:block focus:w-fit focus:rounded-[14px] focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip the error screens
      </a>

      <div className="mt-8">
        <StickyStack
          cards={CARDS.map((c) => (
            <Card key={c.slug} slug={c.slug} quote={c.quote} />
          ))}
        />
      </div>

      <div
        id="seeing-one-of-these"
        className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center gap-4 px-4 md:px-6"
      >
        <p className="text-lg">Seeing one of these?</p>
        <BookLink location="home:error-stack" className="btn-primary" />
      </div>
    </section>
  );
}
