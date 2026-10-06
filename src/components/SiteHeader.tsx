import Link from "next/link";
import { BookLink } from "@/components/Cta";
import { brand } from "@/config/brand";
import { nodes, routes } from "@/config/routes";

// Nav = SITEMAP top level with inNav !== false, in SITEMAP order (fixes first, development and cities never ahead of them).
const navItems = nodes.filter((n) => n.parentPath === routes.home && n.inNav !== false);

export function SiteHeader() {
  return (
    <header>
      <Link href={routes.home}>{brand.name}</Link>
      <nav aria-label="Primary">
        <ul>
          {navItems.map((n) => (
            <li key={n.path}>
              <Link href={n.path}>{n.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <BookLink location="header" />
    </header>
  );
}
