import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { SiteStatus } from "@/components/SiteStatus";
import { primaryCtaFor } from "@/config/cta";
import { routes } from "@/config/routes";
import { getGuide } from "@/content";
import type { Service } from "@/content/schema";
import { testimonials } from "@/content/testimonials";
import { Band, BandTitle, Breadcrumbs, Checklist, CtaBand, Faqs, LabelledSteps, LinkList, PlainList, RealScreen } from "./parts";

// One real testimonial, and only a real one: the placeholders in src/content/testimonials.ts are
// never published here, and the two quotes that used to exist belonged to fixmywp.com.
const realTestimonial = testimonials.find((t) => t.confirmed) ?? null;

export function ServiceTemplate({ service: s }: { service: Service }) {
  const intent = primaryCtaFor(s.intent);
  const loc = `service:${s.id}`;
  const isFix = s.intent === "fix";

  return (
    <article data-intent={s.intent}>
      <JsonLd data={[serviceLd(s), faqLd(s.faqs)]} />

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(s.path)} />
        {/* Same 7/5 hero family as the home page: text left, a tall photograph right. */}
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-6">
          <div className="md:col-span-7 md:pr-12">
            <h1 className="max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">{s.h1}</h1>
            <p className="mt-6 max-w-[52ch] text-lg text-muted">{s.summary}</p>
            <CtaPair intent={intent} location={`${loc}:hero`} service={s.id} className="mt-8" />
            {isFix && <SiteStatus />}
          </div>
          <div className="md:col-span-5">
            <RealScreen slot={s.image.slot} alt={s.image.alt} priority hero />
          </div>
        </div>
      </div>

      {/*
        Body and rail share one grid so the rail has a containing block as tall as the content.
        Scoping it to the hero gave it 126px of travel against a 3000px article, which is not sticky.
      */}
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
        {isFix && s.symptoms.length > 0 ? (
          <Band bleed={false} labelledBy="symptoms">
            <BandTitle id="symptoms">Does your site show this?</BandTitle>
            <Checklist items={s.symptoms} />
          </Band>
        ) : (
          <Band bleed={false} labelledBy="who">
            <BandTitle id="who">Who this is for</BandTitle>
            <p className="mt-6 max-w-[60ch] text-muted">{s.whoItsFor}</p>
          </Band>
        )}

        <Band bleed={false} labelledBy="what-we-do">
          <BandTitle id="what-we-do">What we do</BandTitle>
          <LabelledSteps steps={s.whatWeDo} />
        </Band>

        <Band bleed={false} labelledBy="deliverables">
          <BandTitle id="deliverables">What you get</BandTitle>
          <PlainList items={s.deliverables} />
        </Band>

        {s.guideSlugs.length > 0 && (
          <Band bleed={false} labelledBy="guides">
            <BandTitle id="guides">Errors we fix here</BandTitle>
            <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
              {s.guideSlugs.map((slug) => (
                <li key={slug} className="border-t border-line">
                  <Link
                    href={routes.guide(slug)}
                    className="flex min-h-11 items-center py-3 text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
                  >
                    {getGuide(slug)?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Band>
        )}

        {realTestimonial && (
          <Band bleed={false}>
            <figure className="max-w-[60ch]">
              <blockquote className="text-[clamp(1.25rem,2vw,1.5rem)] font-medium">
                &ldquo;{realTestimonial.excerpt}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-muted">
                {realTestimonial.name}, {realTestimonial.role}, {realTestimonial.org}
              </figcaption>
            </figure>
          </Band>
        )}

        <Faqs faqs={s.faqs} bleed={false} />

        {s.relatedPaths.length > 0 && (
          <Band bleed={false} labelledBy="related">
            <BandTitle id="related">Related services</BandTitle>
            <LinkList paths={s.relatedPaths} />
          </Band>
        )}

        </div>

        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-[calc(var(--nav-h)+1.5rem)] mt-10 border border-line bg-surface p-6">
            <p className="font-bold">{s.title}</p>
            {(s.typicalTurnaround || s.priceFrom) && (
              <dl className="mt-4">
                {s.typicalTurnaround && (
                  <div className="border-t border-line py-2">
                    <dt className="text-xs font-medium tracking-[0.06em] text-muted uppercase">Typical turnaround</dt>
                    <dd className="mt-1 font-mono">{s.typicalTurnaround}</dd>
                  </div>
                )}
                {s.priceFrom && (
                  <div className="border-t border-line py-2">
                    <dt className="text-xs font-medium tracking-[0.06em] text-muted uppercase">From</dt>
                    <dd className="mt-1 font-mono">{s.priceFrom}</dd>
                  </div>
                )}
              </dl>
            )}
            <CtaPair intent={intent} location={`${loc}:rail`} service={s.id} className="mt-6 !flex-col !items-stretch" />
          </div>
        </aside>
      </div>

      <CtaBand intent={intent} location={`${loc}:closing`} service={s.id} title={`Ready to start on ${s.title.toLowerCase()}?`} />
    </article>
  );
}
