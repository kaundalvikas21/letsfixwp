"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Primary nav labels set by the V1.1 brief (approved change from the live WP Help / Got Hacked? labels).
export const navItems = [
  { href: "/fix", label: "Problems" },
  { href: "/pricing", label: "Pricing" },
  { href: "/wordpress-maintenance-services", label: "Care plans" },
  { href: "/testimonials", label: "Reviews" },
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
        const active = pathname === href || pathname.startsWith(`${href}/`);
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
