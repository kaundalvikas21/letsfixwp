import Link from "next/link";
import { brand } from "@/config/brand";
import { nodes, routes } from "@/config/routes";

// Footer = every SITEMAP node (including inNav: false ones) plus the utility routes.
const top = nodes.filter((n) => n.parentPath === routes.home);
const childrenOf = (path: string) => nodes.filter((n) => n.parentPath === path);
const hubs = top.filter((n) => n.kind === "hub");
const company = top.filter((n) => n.kind !== "hub");
const hasEmail = !brand.email.includes("{{"); // unconfirmed values must never reach the page

const colHead = "font-display text-sm font-bold";
const colList = "mt-3 space-y-2 text-sm text-muted";
// Every footer link is a 44x44 target (contract rule 5); space-y-2 on the lists keeps the 8px between them.
const link = "inline-flex min-h-11 min-w-11 items-center hover:text-text";

export function SiteFooter() {
  const facts = brand.legacy.facts;
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {hubs.map((hub) => (
            <div key={hub.path}>
              <h2 className={colHead}>
                <Link href={hub.path} className="inline-flex min-h-11 min-w-11 items-center hover:text-accent-text">
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

          <div>
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

          <div>
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

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <address className="not-italic">
            <span className="font-display font-bold text-text">{brand.name}</span>
            {hasEmail ? (
              <>
                {" · "}
                <a href={`mailto:${brand.email}`} className="inline-flex min-h-11 items-center hover:text-text">
                  {brand.email}
                </a>
              </>
            ) : (
              <>
                {" · "}
                <Link href={routes.contact} className="inline-flex min-h-11 items-center hover:text-text">
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
          <p className="max-w-[46ch] md:text-right">
            This website is not affiliated with or sponsored by Automattic or the WordPress Open Source project
          </p>
        </div>
      </div>
    </footer>
  );
}
