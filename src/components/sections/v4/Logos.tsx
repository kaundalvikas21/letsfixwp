import { siCloudflare, siCpanel, siElementor, siGutenberg, siMysql, siPhp, siWoocommerce, siWordpress } from "simple-icons";
import { LogoMarquee } from "./LogoMarquee";

// Named imports from simple-icons: a slug that does not exist fails the build instead of 404ing.
// Divi, WPBakery and Beaver Builder are not in Simple Icons (16.35.0), so the stack underneath fills those places.
const LOGOS = [siWordpress, siWoocommerce, siElementor, siGutenberg, siPhp, siMysql, siCpanel, siCloudflare];

// Every icon is drawn inside a 24x24 square, so wide wordmarks come out short. Hand-tuned so they read
// at the same optical weight as the round marks; a logo not listed here uses size-10. Every entry
// moved up one step together, so the balance between them is the one that was tuned. The row is
// h-20 because the clip window crops anything taller, and the largest mark now draws an 80px box.
const OPTICAL: Record<string, string> = {
  woocommerce: "size-20",
  cpanel: "size-[4.5rem]",
  mysql: "size-14",
  php: "size-14",
  cloudflare: "size-12",
};

const logos = LOGOS.map((icon) => (
  <li key={icon.slug} className="flex h-20 shrink-0 items-center justify-center">
    <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" className={`${OPTICAL[icon.slug] ?? "size-10"} fill-muted`}>
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  </li>
));

/**
 * The platforms we repair, directly under the hero.
 *
 * This strip and the client stories used to be one section called "We repair sites running on", which
 * meant the page's whole client-proof block sat inside a region named after a platform list. They are
 * two sections now, each saying what it is. Task 55 in docs/layout-ledger.md has the reasoning.
 *
 * **It sits second on purpose.** A logo row is the fastest credibility check a visitor can make, and
 * it was at 65% page depth, which is four screens after the moment anyone decides whether this
 * company is real. PRODUCT.md has the visitor arriving mid-emergency, often on a phone, straight off
 * a search for the error their site is printing; the question "do you even work on what I run" is the
 * first one they have, so the answer goes where they ask it.
 *
 * **The heading is a label and stays one.** 16px, --muted, centred, deliberately not the 30px display
 * heading every other section carries: it names the row rather than introducing a section, which is
 * what a trust strip's heading is for. It is still a real h2, so the row has a name in the outline
 * rather than being eight unexplained pictures.
 *
 * Shorter vertical rhythm than a full section (py-10/14 rather than py-16/24), because this reads as
 * attached to the hero above it rather than as the page's second idea.
 */
export function Logos() {
  return (
    <section aria-labelledby="repair-sites-on" className="reveal mx-auto max-w-page px-4 py-10 md:px-6 md:py-14">
      <h2 id="repair-sites-on" className="text-center text-base font-medium text-muted">
        We repair sites running on
      </h2>
      <LogoMarquee logos={logos} />
    </section>
  );
}
