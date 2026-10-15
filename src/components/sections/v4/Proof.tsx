import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { siCloudflare, siCpanel, siElementor, siGutenberg, siMysql, siPhp, siWoocommerce, siWordpress } from "simple-icons";
import { routes } from "@/config/routes";
import { testimonials } from "@/content/testimonials";
import { LogoMarquee } from "./LogoMarquee";
import { QuotePair } from "./QuotePair";

// Named imports from simple-icons: a slug that does not exist fails the build instead of 404ing.
// Divi, WPBakery and Beaver Builder are not in Simple Icons (16.35.0), so the stack underneath fills those places.
const LOGOS = [siWordpress, siWoocommerce, siElementor, siGutenberg, siPhp, siMysql, siCpanel, siCloudflare];

// Every icon is drawn inside a 24x24 square, so wide wordmarks come out short. Hand-tuned so they read
// at the same optical weight as the round marks; a logo not listed here uses size-9.
const OPTICAL: Record<string, string> = {
  woocommerce: "size-[4.5rem]",
  cpanel: "size-16",
  mysql: "size-12",
  php: "size-12",
  cloudflare: "size-11",
};

const logos = LOGOS.map((icon) => (
  <li key={icon.slug} className="flex h-12 shrink-0 items-center justify-center">
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" className={`${OPTICAL[icon.slug] ?? "size-9"} fill-muted`}>
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  </li>
));

/**
 * Proof: the platforms we repair, then what clients say. The quotes come from
 * src/content/testimonials.ts, which holds placeholders marked as such on the page; a production
 * deploy fails while any remain. The two quotes this brief named belong to a different, still trading
 * company and were removed from the content on 2026-10-07, so they are not on this page.
 */
export function Proof() {
  return (
    <section aria-labelledby="repair-sites-on" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <h2 id="repair-sites-on" className="text-center text-base font-medium text-muted">
        We repair sites running on
      </h2>
      <LogoMarquee logos={logos} />

      <QuotePair quotes={testimonials.map((t) => ({ ...t }))} />

      <Link
        href={routes.reviews}
        className="group mt-12 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text"
      >
        Read the case studies
        <ArrowUpRightIcon weight="duotone" className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden />
      </Link>
    </section>
  );
}
