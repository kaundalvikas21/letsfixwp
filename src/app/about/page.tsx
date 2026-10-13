import type { Metadata } from "next";
import Link from "next/link";
import { nodeCrumbs } from "@/components/JsonLd";
import { Band, BandTitle, Breadcrumbs, CtaBand } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { primaryCtaFor } from "@/config/cta";
import { hubNodes, nodeByPath, routes } from "@/config/routes";

export const metadata: Metadata = {
  title: "About",
  description: "WordPress engineers for sites that are down, hacked or slow, plus care plans and development.",
  alternates: { canonical: routes.about },
  openGraph: { title: "About", url: routes.about, type: "website" },
};

export default function About() {
  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(routes.about)} />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">About {brand.name}</h1>
        <p className="mt-6 max-w-[58ch] text-lg text-muted">
          We are WordPress engineers. Most people reach us on the worst day their site has had, so the work is organised
          around getting a broken site serving pages again, then keeping it that way.
        </p>
      </div>

      <Band labelledBy="how">
        <BandTitle id="how">How we work</BandTitle>
        <dl className="mt-8 grid gap-x-16 gap-y-px md:grid-cols-2">
          <div className="border-t border-line py-5">
            <dt className="font-bold">One engineer per job</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">{brand.promises.whoWorks}</dd>
          </div>
          <div className="border-t border-line py-5">
            <dt className="font-bold">A price before any work</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">{brand.quoteFlow}</dd>
          </div>
          <div className="border-t border-line py-5">
            <dt className="font-bold">Nothing changed without a backup</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">
              A backup of files and database is taken {brand.promises.backupFirst}. {brand.promises.staging}
            </dd>
          </div>
          <div className="border-t border-line py-5">
            <dt className="font-bold">A record you keep</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">{brand.promises.reporting}</dd>
          </div>
        </dl>
      </Band>

      <Band labelledBy="what">
        <BandTitle id="what">What we work on</BandTitle>
        <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
          {hubNodes.map((h) => (
            <li key={h.path} className="border-t border-line">
              <Link
                href={h.path}
                className="flex min-h-11 items-center py-3 text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
              >
                {h.title}
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <CtaBand
        intent={primaryCtaFor(nodeByPath.get(routes.about)?.intent)}
        location="about"
        title="Something broken right now?"
      />
    </article>
  );
}
