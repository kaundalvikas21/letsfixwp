import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

// LetsFixWP's own guarantee (brand.guarantee) when the owner has set one. Otherwise the legacy path (docs/foundation.md,
// fixmywp.com's guarantee, only when legacy.enabled), else 404.
// ponytail: states only the confirmed fact; the owner supplies the full terms.
export const metadata: Metadata = {
  title: "Guarantee",
  alternates: { canonical: routes.legal.guarantee },
  robots: { index: false, follow: true },
};

export default function Guarantee() {
  const facts = brand.legacy.facts;
  const g = brand.guarantee;
  if (!g && !facts) notFound();
  return (
    <article>
      {g ? (
        <>
          {g.placeholder && <p>Placeholder guarantee, not a real offer. Replace before launch.</p>}
          <h1>Our {g.days}-day guarantee</h1>
          <p>{g.summary}</p>
        </>
      ) : (
        <>
          <h1>Our {facts!.guaranteeDays}-day guarantee</h1>
          <p>Every service carries a {facts!.guaranteeDays}-day guarantee.</p>
        </>
      )}
      <p>
        To make a claim or ask about it, email <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>
      <p>
        See also our <Link href={routes.legal.terms}>Terms of Service</Link>.
      </p>
    </article>
  );
}
