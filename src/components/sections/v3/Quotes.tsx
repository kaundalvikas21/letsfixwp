import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { routes } from "@/config/routes";
import { testimonials } from "@/content/testimonials";

// Initials on a tinted disc: identifies the person without a stock face or a generic silhouette.
const Monogram = ({ name }: { name: string }) => {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden>
      <circle cx="24" cy="24" r="24" className="fill-accent-tint" />
      <circle cx="24" cy="24" r="23.5" fill="none" className="stroke-line" />
      <text x="24" y="24" dy="0.35em" textAnchor="middle" className="fill-accent-text font-display text-[17px] font-bold">
        {initials}
      </text>
    </svg>
  );
};

const card = "mb-5 break-inside-avoid rounded-[20px] border border-line bg-surface p-6 shadow-card md:p-8";

/**
 * v3 home: masonry of quote cards, heights set by content (CSS columns: 2 from 768px, 3 from 1280px so quotes keep to three lines). Only what exists: the quotes in
 * src/content/testimonials.ts, plus a card to the case studies page. Placeholder quotes say so on the card, and
 * next.config.ts fails a production deploy while any remain.
 */
export function Quotes() {
  return (
    <section aria-labelledby="quotes" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <h2 id="quotes" className="font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        In our clients&rsquo; words
      </h2>
      <div className="mt-10 md:columns-2 md:gap-5 xl:columns-3">
        {testimonials.map((t) => (
          <figure key={t.name} className={card}>
            {"placeholder" in t && t.placeholder && (
              <p className="mb-4 rounded-[12px] border border-dashed border-line-strong px-3 py-2 text-sm text-muted">
                Placeholder, not a client quote. Replace before launch.
              </p>
            )}
            {/* 3-line cap lives in the content (about 15 words, see testimonials.ts): a client's words are never cut. */}
            <blockquote className="font-display text-lg leading-snug font-bold md:text-xl">
              <p>&ldquo;{t.excerpt}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <Monogram name={t.name} />
              <span>
                <span className="block font-semibold">{t.name}</span>
                <span className="block text-sm text-muted">
                  {t.role}, {t.org}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
        <Link href={routes.reviews} className={`${card} group flex flex-col transition-shadow hover:shadow-lift`}>
          <ArrowUpRightIcon weight="duotone" className="size-6 self-end text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden />
          <span className="mt-10 font-display text-2xl leading-tight font-bold">Read the case studies</span>
          <span className="mt-2 text-muted">Write-ups of WordPress sites we have repaired, secured and built.</span>
        </Link>
      </div>
    </section>
  );
}
