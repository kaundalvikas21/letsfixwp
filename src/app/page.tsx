import type { Metadata } from "next";
import Link from "next/link";
import { PlansLink } from "@/components/Cta";
import { Hero } from "@/components/sections/v1/Hero";
import { categories, categoryLabels } from "@/content/categories";
import { problemPath, problems, problemsIn } from "@/content/problems";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: { absolute: "WordPress Emergency Repair, Fixed by Engineers | FixMyWP" },
  alternates: { canonical: "/" },
};

export default function Home() {
  const critical = problems.filter((p) => p.urgency === "critical");

  return (
    <>
      <Hero />

      <section aria-labelledby="critical">
        <h2 id="critical">Site down or hacked right now</h2>
        <ul>
          {critical.map((p) => (
            <li key={p.slug}>
              <Link href={problemPath(p)}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="by-category">
        <h2 id="by-category">Every problem we fix</h2>
        {categories.map((c) => (
          <section key={c} aria-labelledby={`cat-${c}`}>
            <h3 id={`cat-${c}`}>{categoryLabels[c]}</h3>
            <ul>
              {problemsIn(c).map((p) => (
                <li key={p.slug}>
                  <Link href={problemPath(p)}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p>
          <Link href="/fix">Search all WordPress problems</Link>
        </p>
      </section>

      <section aria-labelledby="proof">
        <h2 id="proof">What clients say</h2>
        {testimonials.map((t) => (
          <figure key={t.name}>
            <blockquote>
              {t.quote.split("\n\n").map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </blockquote>
            <figcaption>
              {t.name}, {t.org}
            </figcaption>
          </figure>
        ))}
        <p>
          <Link href="/testimonials">Read testimonials</Link>
        </p>
      </section>

      <section aria-labelledby="plans">
        <h2 id="plans">Stop it happening again</h2>
        <p>
          Our {site.plan.name.toLowerCase()} includes one free fix ({site.plan.freeFixValue} value).
        </p>
        <p>
          <PlansLink />
        </p>
      </section>
    </>
  );
}
