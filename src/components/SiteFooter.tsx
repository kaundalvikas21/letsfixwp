import Link from "next/link";
import { brand } from "@/config/brand";
import { cityNodes, hubIdOf, hubNodes, nodeByPath, nodes, routes } from "@/config/routes";

// V1.12 footer on --surface. Columns come from SITEMAP hubs (in SITEMAP order) plus Resources.
const HUB_LABEL: Record<string, string> = {
  "wordpress-fix": "Fixes",
  "wordpress-security": "Security",
  "wordpress-maintenance": "Care plans",
  "wordpress-performance-migration": "Performance & Migration",
  "wordpress-development": "Development",
  woocommerce: "WooCommerce",
};
const titleOf = (path: string) => nodeByPath.get(path)!.title;
const resources = [routes.guides, routes.compares, routes.reviews, routes.check, routes.about];
const company = [routes.about, routes.contact, routes.pricing];

const linkCls = "inline-flex min-h-11 items-center text-[14px] text-muted transition-colors hover:text-text md:min-h-0 md:py-1";

function Column({ title, href, links }: { title: string; href?: string; links: { title: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-[14px] font-semibold text-text">{href ? <Link href={href}>{title}</Link> : title}</h2>
      <ul className="mt-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={linkCls}>
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** No social links: no accounts are confirmed yet. No version strings, no locale strip. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    // Bottom padding under md clears the fixed mobile action bar.
    <footer className="border-t border-line bg-surface pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <nav aria-label="Footer" className="mx-auto max-w-7xl px-4 pt-16 pb-10 md:px-6">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {hubNodes.map((h) => (
            <Column
              key={h.path}
              title={HUB_LABEL[hubIdOf(h.path)] ?? h.title}
              href={h.path}
              links={nodes.filter((n) => n.parentPath === h.path && n.kind === "service").map((n) => ({ title: n.title, href: n.path }))}
            />
          ))}
          <Column title="Resources" links={resources.map((p) => ({ title: titleOf(p), href: p }))} />
        </div>

        <p className="mt-10 border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
          <Link href={routes.cities} className="text-muted hover:text-text">
            WordPress development in
          </Link>{" "}
          {cityNodes.map((c, i) => (
            <span key={c.path}>
              <Link href={c.path} className="inline-flex min-h-11 items-center hover:text-text md:min-h-0">
                {c.title}
              </Link>
              {i < cityNodes.length - 1 && ", "}
            </span>
          ))}
        </p>
      </nav>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-[13px] text-muted md:flex-row md:flex-wrap md:items-center md:justify-between md:px-6">
          <ul className="flex flex-wrap gap-x-6" aria-label="Company">
            {company.map((p) => (
              <li key={p}>
                <Link href={p} className={linkCls}>
                  {titleOf(p)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-6" aria-label="Legal">
            <li>
              <Link href={routes.legal.terms} className={linkCls}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href={routes.legal.privacy} className={linkCls}>
                Privacy Policy
              </Link>
            </li>
            {brand.legacy.facts && (
              <li>
                <Link href={routes.legal.guarantee} className={linkCls}>
                  {brand.legacy.facts.guaranteeDays}-day guarantee
                </Link>
              </li>
            )}
          </ul>
          <a href={`mailto:${brand.email}`} className={linkCls}>
            {brand.email}
          </a>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-8 text-[12px] leading-relaxed text-muted md:px-6">
          <p>
            &copy; {year} {brand.name}. This website is not affiliated with or sponsored by Automattic or the WordPress Open Source project.
          </p>
        </div>
      </div>
    </footer>
  );
}
