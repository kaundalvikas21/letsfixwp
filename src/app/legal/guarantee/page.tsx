import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

// LetsFixWP's own guarantee, from brand.promises.guaranteeDays. While that is null there is no
// guarantee to document and the page 404s, so nothing on the site may link here unconditionally.
// The figure that used to live here belonged to fixmywp.com and is not ours to publish.
export const metadata: Metadata = {
  title: "Guarantee",
  alternates: { canonical: routes.legal.guarantee },
  robots: { index: false, follow: true },
};

export default function Guarantee() {
  const days = brand.promises.guaranteeDays;
  if (days === null) notFound();
  return (
    <article>
      <h1>Our {days}-day guarantee</h1>
      <p>Every fix carries a {days}-day guarantee.</p>
      <p>
        To make a claim or ask about it, email <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>
      <p>
        See also our <Link href={routes.legal.terms}>Terms of Service</Link>.
      </p>
    </article>
  );
}
