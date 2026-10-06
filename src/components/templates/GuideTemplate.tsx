import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd } from "@/components/JsonLd";
import { routes } from "@/config/routes";
import { getService } from "@/content";
import type { Guide } from "@/content/schema";
import { Breadcrumbs, Faqs, RealScreen } from "./parts";

/** /guides/<slug>/: one specific error. Info intent, so BOOK (into the parent service) + CHAT, and CHECK. */
export function GuideTemplate({ guide: g }: { guide: Guide }) {
  const parent = getService(g.parentService)!;
  const loc = `guide:${g.slug}`;

  return (
    <article data-urgency={g.urgency}>
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />
      <Breadcrumbs
        items={[
          { name: "Home", path: routes.home },
          { name: "Knowledge Base", path: routes.guides },
          { name: g.title, path: routes.guide(g.slug) },
        ]}
      />

      <header>
        <h1>{g.h1}</h1>
        {g.errorText && (
          <p>
            <code>{g.errorText}</code>
          </p>
        )}
        <p>
          <BookLink location={`${loc}:hero`} service={parent.id} guide={g.slug} />{" "}
          <ChatButton location={`${loc}:hero`} service={parent.id} />
        </p>
      </header>

      <RealScreen slot={g.image.slot} alt={g.image.alt} />

      <section aria-labelledby="symptoms">
        <h2 id="symptoms">What you are seeing</h2>
        <ul>
          {g.symptoms.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="causes">
        <h2 id="causes">What usually causes it</h2>
        <ul>
          {g.likelyCauses.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="safe-checks">
        <h2 id="safe-checks">Safe things to try first</h2>
        <ol>
          {g.safeChecks.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="call-us">
        <h2 id="call-us">When to call us</h2>
        <p>{g.whenToCallUs}</p>
        <p>
          How we fix it: <Link href={parent.path}>{parent.title}</Link>
        </p>
        <p>
          <BookLink location={`${loc}:call-us`} service={parent.id} guide={g.slug} />{" "}
          <ChatButton location={`${loc}:call-us`} service={parent.id} />
        </p>
      </section>

      <Faqs faqs={g.faqs} />

      <p>
        Not an emergency? <CheckLink location={`${loc}:footer`} service={parent.id} />
      </p>
    </article>
  );
}
