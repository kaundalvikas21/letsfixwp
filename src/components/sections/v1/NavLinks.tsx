"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/config/routes";

// Primary nav labels set by the V1.1 brief; targets mapped to SITEMAP per contract rule 16.
export const navItems = [
  { href: routes.hub("wordpress-fix"), label: "Problems" },
  { href: routes.pricing, label: "Pricing" },
  { href: routes.plans("care-plans"), label: "Care plans" },
  { href: routes.reviews, label: "Reviews" },
] as const;

export function NavLinks({
  listClassName,
  linkClassName,
  onNavigate,
}: {
  listClassName: string;
  linkClassName: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={listClassName}>
      {navItems.map(({ href, label }) => {
        const here = pathname.endsWith("/") ? pathname : `${pathname}/`;
        const active = here.startsWith(href);
        return (
          <li key={href}>
            <Link href={href} aria-current={active ? "page" : undefined} onClick={onNavigate} className={linkClassName}>
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
