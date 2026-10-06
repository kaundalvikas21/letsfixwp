import Link from "next/link";
import { BookLink } from "@/components/Cta";
import { site } from "@/content/site";

// Labels kept from the live nav (taste-skill 11.F): WP Help, Got Hacked?, Pricing, About Us, Testimonials.
export function SiteHeader() {
  return (
    <header>
      <Link href="/">{site.name}</Link>
      <nav aria-label="Primary">
        <ul>
          <li>
            <Link href="/fix">WP Help</Link>
          </li>
          <li>
            <Link href="/wordpress-hacked-fix">Got Hacked?</Link>
          </li>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/testimonials">Testimonials</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <BookLink location="header" />
    </header>
  );
}
