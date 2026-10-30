import { ClosingCta } from "./ClosingCta";

/**
 * v3 home: the closing panel. The shape and the mesh now live in ClosingCta, which every page uses, so this is
 * only the home page's own words. It used to be the one gradient on the site; see ClosingCta for why that rule
 * now reads as each page's final CTA.
 */
export function FinalCta() {
  return (
    <ClosingCta
      id="final-cta"
      title="Let&rsquo;s get you back online."
      sub="Tell us what your site is doing and an engineer picks it up. No form maze, no call required."
      location="home:final"
    />
  );
}
