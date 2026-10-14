import Link from "next/link";
import { BookLink } from "@/components/Cta";
import { SiteNav, type NavItem } from "@/components/SiteNav";
import { brand } from "@/config/brand";
import { hubNodes, routes } from "@/config/routes";

// Curated primary nav: emergency first, development and city pages never ahead of fixes
// (docs/foundation.md ROLE). "Problems" is a disclosure that opens the hub panel in SiteNav, so
// every SITEMAP hub stays one click from the header at every width. The footer still lists the tree.
const primaryLinks: NavItem[] = [
  { label: "Pricing", href: routes.pricing },
  { label: "Care plans", href: routes.plans() },
  { label: "Reviews", href: routes.reviews },
];

const hubs: NavItem[] = hubNodes.map((n) => ({ label: n.title, href: n.path }));

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex h-[calc(var(--nav-h)-1px)] w-full max-w-[1200px] items-center justify-between gap-6 px-6">
        <Link
          href={routes.home}
          className="text-xl font-bold lowercase tracking-[-0.03em] transition-colors duration-200 hover:text-accent-text"
        >
          {brand.name}
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          <SiteNav links={primaryLinks} hubs={hubs} />
          {/* Under 768px the primary CTA moves to the fixed bottom bar below. */}
          <BookLink location="header" className="btn-primary hidden md:inline-flex" />
        </div>
      </div>
    </header>
  );
}

/** Under 768px only: the primary CTA docked to the bottom of the viewport. */
export function MobileBookBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg px-4 pb-[env(safe-area-inset-bottom)] md:hidden"
      style={{ minHeight: "var(--bottombar-h)" }}
    >
      <div className="flex h-[var(--bottombar-h)] items-center">
        <BookLink location="mobile-bar" className="btn-primary w-full" />
      </div>
    </div>
  );
}
