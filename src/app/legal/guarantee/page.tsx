import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

// ponytail: no guarantee page exists on the live site. This states only confirmed facts; the owner supplies full terms.
export const metadata: Metadata = {
  title: `${site.guaranteeDays}-Day Guarantee`,
  alternates: { canonical: "/legal/guarantee" },
  robots: { index: false, follow: true },
};

export default function Guarantee() {
  return (
    <article>
      <h1>Our {site.guaranteeDays}-day guarantee</h1>
      <p>Every {site.name} service carries a {site.guaranteeDays}-day guarantee.</p>
      <p>
        To make a claim or ask about it, email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <p>
        See also our <Link href="/legal/terms">Terms of Service</Link>.
      </p>
    </article>
  );
}
