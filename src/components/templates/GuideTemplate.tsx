import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd } from "@/components/JsonLd";
import { routes } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import type { Guide } from "@/content/schema";
import { Band, BandTitle, Breadcrumbs, Caution, Faqs, PlainList, RealScreen } from "./parts";

/** /guides/<slug>/: one specific error. Info intent, so BOOK (into the parent service) + CHAT, and CHECK. */
export function GuideTemplate({ guide: g }: { guide: Guide }) {
  const parent = getService(g.parentService)!;
  const loc = `guide:${g.slug}`;
  const siblings = guidesFor(g.parentService).filter((x) => x.slug !== g.slug);

  return (
    <article data-urgency={g.urgency}>
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs
          items={[
            { name: "Home", path: routes.home },
            { name: "Knowledge Base", path: routes.guides },
            { name: g.title, path: routes.guide(g.slug) },
          ]}
        />

        <h1 className="mt-8 max-w-[22ch] text-[clamp(1.875rem,3.6vw,3rem)]">{g.h1}</h1>

        {g.errorText && (
          <p className="mt-6 max-w-[70ch] border-l-2 border-accent bg-surface p-4 font-mono text-[0.9375rem] break-words">
            {g.errorText}
          </p>
        )}

        <p className="mt-8 flex flex-wrap items-center gap-2">
          <BookLink location={`${loc}:hero`} service={parent.id} guide={g.slug} className="btn-primary" />
          <ChatButton location={`${loc}:hero`} service={parent.id} className="btn-secondary" />
        </p>

        <RealScreen slot={g.image.slot} alt={g.image.alt} priority />
      </div>

      <Band labelledBy="symptoms">
        <BandTitle id="symptoms">What you are seeing</BandTitle>
        <PlainList items={g.symptoms} />
      </Band>

      <Band labelledBy="causes">
        <BandTitle id="causes">What usually causes it</BandTitle>
        <PlainList items={g.likelyCauses} />
      </Band>

      <Band labelledBy="safe-checks">
        <BandTitle id="safe-checks">Safe things to try first</BandTitle>
        <Caution>
          Do not edit WordPress core files, and do not paste code from a forum into functions.php to see what happens.
          A wrong edit on a live site turns one error into two. If a check below does not clear it, stop there.
        </Caution>
        <ol className="mt-6 max-w-[70ch]">
          {g.safeChecks.map((x) => (
            <li key={x} className="border-t border-line py-3 text-[0.9375rem]">
              {x}
            </li>
          ))}
        </ol>
      </Band>

      <Band labelledBy="call-us">
        <BandTitle id="call-us">When to call us</BandTitle>
        <p className="mt-6 max-w-[60ch] text-muted">{g.whenToCallUs}</p>
        <p className="mt-6 text-[0.9375rem]">
          How we fix it:{" "}
          <Link href={parent.path} className="border-b border-muted transition-colors duration-200 hover:text-accent-text">
            {parent.title}
          </Link>
        </p>
        <p className="mt-8 flex flex-wrap items-center gap-2">
          <BookLink location={`${loc}:call-us`} service={parent.id} guide={g.slug} className="btn-primary" />
          <CheckLink location={`${loc}:call-us`} service={parent.id} className="btn-secondary" />
        </p>
      </Band>

      <Faqs faqs={g.faqs} />

      {siblings.length > 0 && (
        <Band labelledBy="related-guides">
          <BandTitle id="related-guides">Other errors on {parent.title.toLowerCase()}</BandTitle>
          <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
            {siblings.map((x) => (
              <li key={x.slug} className="border-t border-line">
                <Link
                  href={routes.guide(x.slug)}
                  className="flex min-h-11 items-center py-3 text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
                >
                  {x.title}
                </Link>
              </li>
            ))}
          </ul>
        </Band>
      )}
    </article>
  );
}
