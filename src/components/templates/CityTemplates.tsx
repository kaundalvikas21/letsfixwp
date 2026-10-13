import Link from "next/link";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { routes, type FlatNode } from "@/config/routes";
import { cities, getService } from "@/content";
import type { City } from "@/content/schema";
import { Band, BandTitle, Breadcrumbs, CtaBand, Faqs } from "./parts";

/** /wordpress-development/cities/: every city, in build priority order. */
export function CityHubTemplate({ node }: { node: FlatNode }) {
  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(node.path)} />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">WordPress development by city</h1>
        <p className="mt-6 max-w-[56ch] text-lg text-muted">
          We work remotely across India. Pick a city to see how delivery works from your side.
        </p>
      </div>

      <Band labelledBy="cities">
        <BandTitle id="cities">Cities</BandTitle>
        <ul className="mt-6 grid gap-px sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-10">
          {cities.map((c) => (
            <li key={c.slug} className="border-t border-line">
              <Link
                href={routes.city(c.slug)}
                className="flex min-h-11 items-center py-3 font-medium transition-colors duration-200 hover:text-accent-text"
              >
                {c.city}
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <CtaBand intent={primaryCtaFor(node.intent)} location="city-hub" title="Tell us what you want built." />
    </article>
  );
}

/** /wordpress-development/cities/<slug>/. Service JSON-LD with areaServed; no LocalBusiness: there is no local office. */
export function CityTemplate({ city: c, node }: { city: City; node: FlatNode }) {
  const highlighted = c.servicesHighlighted.map((id) => getService(id)!);
  const dev = getService("website-design")!;
  const path = routes.city(c.slug);

  return (
    <article>
      <JsonLd
        data={[
          serviceLd(dev, {
            name: `WordPress development in ${c.city}`,
            url: path,
            areaServed: { "@type": "City", name: c.city, containedInPlace: { "@type": "Country", name: "India" } },
          }),
          faqLd(c.faqs),
        ]}
      />

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(node.path)} />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">WordPress development in {c.city}</h1>
        <div className="mt-6 max-w-[62ch] space-y-5 text-muted">
          {c.localContext.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </div>

      <Band labelledBy="services">
        <BandTitle id="services">What {c.city} clients ask us for</BandTitle>
        <ul className="mt-8">
          {highlighted.map((s) => (
            <li key={s.id} className="border-t border-line">
              <Link href={s.path} className="group grid gap-2 py-6 md:grid-cols-[22rem_1fr] md:gap-8">
                <span className="font-bold transition-colors duration-200 group-hover:text-accent-text">{s.title}</span>
                <span className="max-w-[60ch] text-[0.9375rem] text-muted">{s.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {/* No office, no local staff, no local clients: say plainly how remote delivery actually runs. */}
      <Band labelledBy="remote">
        <BandTitle id="remote">How we work with you from {c.city}</BandTitle>
        <dl className="mt-8 grid gap-x-16 gap-y-px md:grid-cols-2">
          <div className="border-t border-line py-5">
            <dt className="font-bold">Where we work</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">
              Remotely. We do not keep an office in {c.city}, and nobody will come to your premises.
            </dd>
          </div>
          <div className="border-t border-line py-5">
            <dt className="font-bold">Hours and time zone</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">India Standard Time, the same working day as yours.</dd>
          </div>
          <div className="border-t border-line py-5">
            <dt className="font-bold">Meetings</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">Scheduled calls and screen shares, with written notes after each.</dd>
          </div>
          <div className="border-t border-line py-5">
            <dt className="font-bold">Handover</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">You keep hosting, domain and admin. Files, database and build notes at the end.</dd>
          </div>
        </dl>
      </Band>

      <Faqs faqs={c.faqs} />

      <CtaBand
        intent={primaryCtaFor(node.intent)}
        location={`city:${c.slug}`}
        service={highlighted[0]?.id}
        title={`Planning a WordPress project in ${c.city}?`}
      />
    </article>
  );
}
