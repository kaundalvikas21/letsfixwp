import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

// Legacy only (docs/foundation.md): the guarantee belongs to the fixmywp.com business and 404s otherwise.
// ponytail: states only the confirmed fact; the owner supplies the full terms.
export const metadata: Metadata = {
  title: "Guarantee",
  alternates: { canonical: routes.legal.guarantee },
  robots: { index: false, follow: true },
};

export default function Guarantee() {
  const facts = brand.legacy.facts;
  if (!facts) notFound();
  return (
    <article>
      <h1>Our {facts.guaranteeDays}-day guarantee</h1>
      <p>Every service carries a {facts.guaranteeDays}-day guarantee.</p>
      <p>
        To make a claim or ask about it, email <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>
      <p>
        See also our <Link href={routes.legal.terms}>Terms of Service</Link>.
      </p>
    </article>
  );
}
