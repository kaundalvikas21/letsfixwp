import Link from "next/link";
import { brand } from "@/config/brand";
import { hubNodes, nodes, routes } from "@/config/routes";

// Theme lock (taste 4.11): the footer sits on --bg with a single --line top rule, in whichever
// theme the page is in. No inverted dark slab under a light page.
//
// No version strip, no locale or city strip, no build number.

const company = nodes.filter((n) => n.parentPath === routes.home && n.kind !== "hub");

// A mailto to an unconfirmed address is a broken link, so the placeholder renders as plain text
// until the owner replaces it in src/config/brand.ts.
const emailConfirmed = !brand.email.includes("{{");

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-medium">{title}</h2>
      {children}
    </div>
  );
}

const linkClass = "inline-flex min-h-9 items-center text-[0.9375rem] text-muted transition-colors duration-200 hover:text-text";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <Column title="What we fix">
            <ul className="mt-3">
              {hubNodes.map((h) => (
                <li key={h.path}>
                  <Link className={linkClass} href={h.path}>
                    {h.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Company">
            <ul className="mt-3">
              {company.map((n) => (
                <li key={n.path}>
                  <Link className={linkClass} href={n.path}>
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Legal">
            <ul className="mt-3">
              <li>
                <Link className={linkClass} href={routes.legal.terms}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className={linkClass} href={routes.legal.privacy}>
                  Privacy Policy
                </Link>
              </li>
              {/* /legal/guarantee/ 404s until brand.promises.guaranteeDays is set. */}
              {brand.promises.guaranteeDays !== null && (
                <li>
                  <Link className={linkClass} href={routes.legal.guarantee}>
                    Guarantee
                  </Link>
                </li>
              )}
            </ul>
          </Column>

          <Column title="Contact">
            <address className="mt-3 not-italic">
              {emailConfirmed ? (
                <a className={linkClass} href={`mailto:${brand.email}`}>
                  {brand.email}
                </a>
              ) : (
                <span className="text-[0.9375rem] text-muted">{brand.email}</span>
              )}
            </address>
          </Column>
        </nav>

        <p className="mt-16 max-w-[70ch] text-sm text-muted">
          {brand.name} is not affiliated with or sponsored by Automattic or the WordPress Open Source project.
        </p>
      </div>
    </footer>
  );
}
