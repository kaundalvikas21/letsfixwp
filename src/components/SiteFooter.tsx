import Link from "next/link";
import { brand } from "@/config/brand";
import { nodes, routes } from "@/config/routes";

// Footer = every SITEMAP node (including inNav: false ones) plus the utility routes.
const top = nodes.filter((n) => n.parentPath === routes.home);
const childrenOf = (path: string) => nodes.filter((n) => n.parentPath === path);
const hubs = top.filter((n) => n.kind === "hub");
const company = top.filter((n) => n.kind !== "hub");
const hasEmail = !brand.email.includes("{{"); // unconfirmed values must never reach the page

// One column of the sitemap. break-inside-avoid is what makes the CSS columns below usable: without
// it a heading can be dealt into one column and its own links into the next.
const colBlock = "mb-10 break-inside-avoid";
// 15px against the links' 14px, and --text against their --muted: the two were both 14px and told
// apart by weight alone, which is not a hierarchy across eight headings and fifty links.
const colHead = "font-display text-[15px] leading-snug font-bold text-text";
const colList = "mt-3.5 space-y-1 text-sm text-muted";
// py-2 rather than py-0.5. These were 17px tall against the contract's 44px target, which is a real
// miss on the one block of the site that is almost entirely links and is reached most often by
// thumb. A 36px row on a 38px pitch is not 44 either, and the honest reason is that 44 across fifty
// links adds about 900px to every page's footer on a phone; this is the trade, written down.
// The nudge is the Hover Earns It rule being satisfied rather than broken: every one of these goes
// somewhere.
const link =
  "block py-2 transition-[color,translate] duration-150 ease-out hover:translate-x-0.5 hover:text-text motion-reduce:transition-none";

export function SiteFooter() {
  const facts = brand.legacy.facts;
  return (
    <footer className="border-t border-line bg-surface">
      {/* The chat button floats bottom-right over whatever is under it, and on every page that is
          this last line. The extra bottom padding is the room it needs, so the footer ends in air
          rather than with a button sitting on its final sentence. */}
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-14 md:px-6 md:pb-28">
        {/* CSS columns, not a grid. As a four-up grid the eight blocks were dealt into two rows of
            four, and the first hub has eleven children against its row-mates' four, four and three:
            that row was as tall as its longest column and the other three carried about 250px of
            nothing each. Columns balance their own height, so the blocks flow and the voids close.
            -mb-10 cancels the last block's bottom margin, which the column has no use for. */}
        <nav aria-label="Footer" className="-mb-10 gap-10 sm:columns-2 lg:columns-4">
          {hubs.map((hub) => (
            <div key={hub.path} className={colBlock}>
              <h2 className={colHead}>
                <Link href={hub.path} className="transition-colors duration-150 ease-out hover:text-accent-text">
                  {hub.title}
                </Link>
              </h2>
              <ul className={colList}>
                {childrenOf(hub.path).map((n) => (
                  <li key={n.path}>
                    <Link href={n.path} className={link}>
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={colBlock}>
            <h2 className={colHead}>Company</h2>
            <ul className={colList}>
              {company.map((n) => (
                <li key={n.path}>
                  <Link href={n.path} className={link}>
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={colBlock}>
            <h2 className={colHead}>Legal</h2>
            <ul className={colList}>
              <li>
                <Link href={routes.legal.terms} className={link}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={routes.legal.privacy} className={link}>
                  Privacy Policy
                </Link>
              </li>
              {(brand.guarantee || facts) && (
                <li>
                  <Link href={routes.legal.guarantee} className={link}>
                    Guarantee
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* The disclaimer used to be right-aligned against the brand line, where it wrapped to two
            ragged lines and the second ran under the chat button. Left-aligned with its own measure,
            it reads as the one sentence it is. */}
        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-start md:justify-between md:gap-12">
          <address className="not-italic">
            <span className="font-display font-bold text-text">{brand.name}</span>
            {hasEmail ? (
              <>
                {" · "}
                <a href={`mailto:${brand.email}`} className="transition-colors duration-150 ease-out hover:text-text">
                  {brand.email}
                </a>
              </>
            ) : (
              <>
                {" · "}
                <Link href={routes.contact} className="transition-colors duration-150 ease-out hover:text-text">
                  Contact us
                </Link>
              </>
            )}
            {facts && (
              <>
                <br />
                {facts.address.street}, {facts.address.locality} {facts.address.region} {facts.address.postalCode}
                <br />
                Hours: {facts.hours}
              </>
            )}
          </address>
          <p className="max-w-[80ch] text-pretty">
            This website is not affiliated with or sponsored by Automattic or the WordPress Open Source project
          </p>
        </div>
      </div>
    </footer>
  );
}
