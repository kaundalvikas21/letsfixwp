import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, PlansLink } from "@/components/Cta";
import { problemPath, problems } from "@/content/problems";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `One-off WordPress fixes and care plans. Every service carries a ${site.guaranteeDays}-day guarantee.`,
  alternates: { canonical: "/pricing" },
};

export default function Pricing() {
  // Only problems with an owner-supplied price are listed. None yet, so the list hides.
  const priced = problems.filter((p) => p.priceFrom);

  return (
    <>
      <h1>Pricing</h1>

      <section aria-labelledby="one-off">
        <h2 id="one-off">One-off fixes</h2>
        <p>Tell us what is broken and we take it from there.</p>
        {priced.length > 0 && (
          <ul>
            {priced.map((p) => (
              <li key={p.slug}>
                <Link href={problemPath(p)}>{p.title}</Link>: from {p.priceFrom}
              </li>
            ))}
          </ul>
        )}
        <p>
          <BookLink location="pricing:one-off" /> <ChatButton location="pricing:one-off" />
        </p>
      </section>

      <section aria-labelledby="plans">
        <h2 id="plans">Care plans</h2>
        <p>
          Our {site.plan.name.toLowerCase()} includes one free fix ({site.plan.freeFixValue} value).
        </p>
        <p>
          <PlansLink />
        </p>
      </section>

      <section aria-labelledby="guarantee">
        <h2 id="guarantee">Guarantee</h2>
        <p>
          Every service carries a {site.guaranteeDays}-day guarantee. <Link href="/legal/guarantee">How the guarantee works</Link>
        </p>
      </section>
    </>
  );
}
