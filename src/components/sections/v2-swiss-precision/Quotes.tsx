import Link from "next/link";
import { routes } from "@/config/routes";
import { testimonials } from "@/content/testimonials";

// Layout family: single oversized quote, with a second smaller quote offset to column 6.
//
// The quotes come from src/content/testimonials.ts, which holds PLACEHOLDERS. That file's own
// instruction is that a variation rendering them must mark each one visibly as unconfirmed and gate
// publication on real quotes, so an unconfirmed entry carries a visible marker and
// brand.promises.testimonials fails a production build until real, consented quotes replace them.
//
// The two quotes this section originally asked for belong to fixmywp.com, a different and still
// trading business, and name two identifiable people who never said anything about LetsFixWP. They
// were removed from the repo on 2026-10-07 and are not coming back: CLAUDE.md forbids reusing that
// company's testimonials and scripts/check-content.ts fails the build on those names.

const [lead, second] = testimonials;

function Unconfirmed() {
  return (
    <p className="mb-4 font-mono text-xs tracking-[0.06em] text-accent-text uppercase">
      Placeholder, not a real quote
    </p>
  );
}

function Attribution({ name, role, org }: { name: string; role: string; org: string }) {
  return (
    <figcaption className="mt-6 text-muted">
      {name}, {role}, {org}
    </figcaption>
  );
}

export function Quotes() {
  return (
    <section aria-label="Client quotes" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <figure className="md:col-span-11">
            {!lead.confirmed && <Unconfirmed />}
            <blockquote className="max-w-[46ch] text-[clamp(1.5rem,3vw,1.875rem)] font-medium tracking-[-0.02em]">
              <p>&ldquo;{lead.excerpt}&rdquo;</p>
            </blockquote>
            <Attribution name={lead.name} role={lead.role} org={lead.org} />
          </figure>

          <figure className="mt-16 md:col-span-7 md:col-start-6">
            {!second.confirmed && <Unconfirmed />}
            <blockquote className="max-w-[52ch] text-lg text-muted">
              <p>&ldquo;{second.excerpt}&rdquo;</p>
            </blockquote>
            <Attribution name={second.name} role={second.role} org={second.org} />
          </figure>
        </div>

        <p className="mt-12 md:ml-[41.666%]">
          <Link
            href={routes.reviews}
            className="inline-flex min-h-11 items-center border-b border-muted text-base transition-colors duration-200 hover:border-text hover:text-accent-text"
          >
            Read all reviews
          </Link>
        </p>
      </div>
    </section>
  );
}
