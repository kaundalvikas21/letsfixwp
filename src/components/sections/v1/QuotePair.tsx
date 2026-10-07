import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { ctaStyles } from "@/components/cta-styles";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { testimonials } from "@/content/testimonials";

/** Two-letter monogram on --surface-2. Neither company has a Simple Icons logo (checked: hostingadvice, denindustries 404). */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
  return (
    <svg viewBox="0 0 48 48" className="size-12 shrink-0" aria-hidden>
      <rect width="48" height="48" rx="8" className="fill-surface-2" />
      <text x="24" y="24" dominantBaseline="central" textAnchor="middle" className="fill-muted font-mono text-[15px]">
        {initials}
      </text>
    </svg>
  );
}

type Quote = { name: string; role?: string; org: string; excerpt: string };

/** Placeholder quotes carry the same visible marker as every other unconfirmed claim on the site. */
function Attribution({ q, pending }: { q: Quote; pending: boolean }) {
  return (
    <figcaption className="mt-6 flex items-center gap-4">
      <Monogram name={q.name} />
      <span className="text-[15px] leading-snug">
        <span className="block font-medium text-text">
          {q.name}
          {pending && <span className="ml-2 align-middle font-mono text-[13px] font-normal text-muted">{"{{CONFIRM}}"}</span>}
        </span>
        <span className="block text-muted">{[q.role, q.org].filter(Boolean).join(", ")}</span>
      </span>
    </figcaption>
  );
}

/**
 * V1.9. Layout family: asymmetric quote pair. Left quote 7 columns in large Geist 500, right quote 5 columns
 * sitting 64px lower (lg); stacked under 1024px with no offset. Verbatim excerpts, max 3 lines each. No carousel.
 *
 * Until brand.claims.testimonials is confirmed, src/content/testimonials.ts holds placeholders and every
 * attribution renders a {{CONFIRM}} marker. The section is shown that way on purpose so the layout can be
 * reviewed, and a production deploy fails while it is in that state. It never shows an invented endorsement.
 */
export function QuotePair() {
  const pending = !brand.claims.testimonials;
  const [left, right] = testimonials as readonly Quote[];

  return (
    <section aria-labelledby="quotes" className="border-t border-line py-20 md:py-28">
      <h2 id="quotes" className="sr-only">
        What clients say
      </h2>
      <div className="mx-auto grid max-w-7xl gap-14 px-4 md:px-6 lg:grid-cols-12 lg:gap-12">
        <figure className="lg:col-span-7">
          <blockquote className="text-[17px] leading-snug font-medium tracking-tight text-text md:text-[clamp(1.375rem,1.1rem+1vw,1.875rem)]">
            <p>&ldquo;{left.excerpt}&rdquo;</p>
          </blockquote>
          <Attribution q={left} pending={pending} />
        </figure>

        <figure className="lg:col-span-5 lg:mt-16">
          <blockquote className="text-[17px] leading-relaxed text-text md:text-[18px]">
            <p>&ldquo;{right.excerpt}&rdquo;</p>
          </blockquote>
          <Attribution q={right} pending={pending} />
        </figure>

        <p className="lg:col-span-12">
          <Link href={routes.reviews} className={ctaStyles.text}>
            Read all reviews
            <ArrowRight size={16} aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  );
}
