import {
  siApache,
  siCloudflare,
  siCloudways,
  siDigitalocean,
  siElementor,
  siGodaddy,
  siGooglecloud,
  siHetzner,
  siHostinger,
  siKinsta,
  siMysql,
  siNamecheap,
  siNginx,
  siOvh,
  siPhp,
  siVultr,
  siWoocommerce,
  siWordpress,
  siWpengine,
} from "simple-icons";
import { Marquee } from "./Marquee";

// Simple Icons slugs checked against cdn.simpleicons.org on 2026-10-06. Dropped as 404: a2hosting,
// amazonwebservices, bluehost, dreamhost, hostgator, linode, litespeed, siteground.
const logos = [
  siWordpress, siWoocommerce, siElementor, siCloudflare, siPhp, siMysql, siNginx, siApache,
  siHostinger, siGodaddy, siCloudways, siKinsta, siWpengine, siDigitalocean, siGooglecloud,
  siHetzner, siOvh, siNamecheap, siVultr,
];

/** One set of logos. The marquee renders two; the copy is hidden from assistive tech and under reduced motion. */
function LogoSet({ copy = false }: { copy?: boolean }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className={`flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-6 motion-reduce:pr-0 ${copy ? "motion-reduce:hidden" : ""}`}
    >
      {logos.map((l) => (
        <li key={l.slug} className="text-muted">
          <svg role="img" aria-label={l.title} viewBox="0 0 24 24" className="size-7 fill-current">
            <title>{l.title}</title>
            <path d={l.path} />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/**
 * V1.3, directly under the hero. Layout family: logo marquee (the page's only marquee).
 * One plain line (not an eyebrow), then real Simple Icons marks in --muted (7.67:1 on --bg). Logos only.
 * Under 768px the same row, smaller gutter; under reduced motion a static centered, wrapping row.
 */
export function PlatformMarquee() {
  return (
    <section aria-labelledby="platforms" className="border-t border-line py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p id="platforms" className="mb-8 text-center text-[15px] text-muted">
          We repair sites running on
        </p>
        <Marquee label="Platforms and hosts">
          <LogoSet />
          <LogoSet copy />
        </Marquee>
      </div>
    </section>
  );
}
