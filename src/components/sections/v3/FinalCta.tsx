import { BookLink, ChatButton } from "@/components/Cta";

/**
 * v3 home: the closing panel, and the only gradient on the site (MASTER, Imagery). The mesh is static.
 * Contrast: the lightest point the mesh can reach is the accent itself, so --on-cta holds 4.89:1 in light and
 * 6.69:1 at the darkest-theme overlap. No scrim needed.
 */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta" className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:px-6 lg:pt-24">
      <div className="cta-mesh rounded-[20px] px-6 py-16 text-center text-on-cta shadow-card md:px-16 md:py-24">
        <h2 id="final-cta" className="mx-auto max-w-[16ch] font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
          Let&rsquo;s get you back online.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <BookLink location="home:final" className="btn-primary bg-on-cta text-cta-ink" />
          <ChatButton location="home:final" className="btn-secondary border-on-cta bg-transparent text-on-cta" />
        </div>
      </div>
    </section>
  );
}
