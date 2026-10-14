import { siCloudflare, siCpanel, siElementor, siGutenberg, siMysql, siPhp, siWoocommerce, siWordpress } from "simple-icons";

// Named imports from simple-icons: a slug that does not exist fails the build instead of 404ing.
// Divi, WPBakery and Beaver Builder are not in Simple Icons (16.35.0), so the stack underneath fills those places.
const LOGOS = [siWordpress, siWoocommerce, siElementor, siGutenberg, siPhp, siMysql, siCpanel, siCloudflare];

// Every icon is drawn inside a 24x24 square, so wide wordmarks come out short. Hand-tuned so they read at the
// same optical weight as the round marks; a logo not listed here uses size-9.
const OPTICAL: Record<string, string> = {
  woocommerce: "size-[4.5rem]",
  cpanel: "size-16",
  mysql: "size-12",
  php: "size-12",
  cloudflare: "size-11",
};

/** v3 home: static logo grid, 4x2 from 768px, 2 columns below. Logos only, in --muted. */
export function LogoGrid() {
  return (
    // lg:pt-28 clears the 48px the hero photo hangs into this section.
    <section aria-labelledby="built-on" className="mx-auto max-w-4xl px-4 pb-16 md:px-6 lg:pt-28">
      <h2 id="built-on" className="text-center text-base font-medium text-muted">
        Fixes for sites built on
      </h2>
      <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {LOGOS.map((icon) => (
          <li key={icon.slug} className="flex h-12 items-center justify-center">
            <svg role="img" aria-label={icon.title} viewBox="0 0 24 24" className={`${OPTICAL[icon.slug] ?? "size-9"} fill-muted`}>
              <title>{icon.title}</title>
              <path d={icon.path} />
            </svg>
          </li>
        ))}
      </ul>
    </section>
  );
}
