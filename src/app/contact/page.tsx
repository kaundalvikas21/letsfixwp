import { CheckIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, card, h1, page, pageY } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { serviceForOldSlug } from "@/config/redirects";
import { routes, serviceIds } from "@/config/routes";
import { getGuide, problemItems, services } from "@/content";
import { cn } from "@/lib/utils";
import { BookingFlow } from "./BookingFlow";
import { ContactTabs } from "./ContactTabs";

export const metadata: Metadata = {
  title: "Contact and Emergency Ticket",
  description: "Book a WordPress fix, ask for a project quote, or chat with an engineer. Tell us what is wrong and which site it is on.",
  alternates: { canonical: routes.contact },
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";


const optionsFor = (kind: "fix" | "project") =>
  services.filter((s) => (kind === "project" ? s.intent !== "fix" : s.intent === "fix")).map((s) => ({ id: s.id, title: s.title }));

/**
 * The reassurance beside the form, and the wording is not ours to write: each string is the owner's
 * approved phrasing, copied verbatim from the `confirm(...)` description in src/config/brand.ts and
 * reproduced in PRODUCT.md under Brand Commitments. `brand.claims` itself holds booleans and numbers,
 * so the sentences have to come from there. Never reword one here; `first-letter:uppercase` below is
 * presentation only. Each row renders only while its own claim is truthy, because an unconfirmed
 * claim can be null.
 *
 * Four of the eight on purpose. sameDay and bookingMinutes are speed claims for a landing surface and
 * read as sales talk beside a form someone is already filling in; vetted and checkTurnaround answer
 * questions other pages ask. The full eight would also run this column past the form's own height.
 */
const promises = [
  [brand.claims.fixedPrice, "fixes are fixed price, agreed before work starts"],
  [brand.claims.backupFirst, "a full backup is taken before any change"],
  [brand.claims.ownLogin, "we work through a login you create for us and never ask for your password"],
  [brand.claims.accessRemoved, "our access is removed when the work is done"],
] as const;

/** Hosts both flows. Reads routes.book() / routes.quote() params: service, guide, url, type. */
export default async function Contact({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const initialTab = one(sp.type) === "project" ? "project" : "fix";
  // `problem` is the foundation-era param on shared /app?problem=<old-slug> links.
  const requested = one(sp.service) || serviceForOldSlug(one(sp.problem)) || "";
  const service = serviceIds.includes(requested) ? requested : "";
  const guide = getGuide(one(sp.guide))?.slug ?? "";
  const url = one(sp.url).slice(0, 300);
  const initial = { service, guide, url };

  return (
    <div className={cn(page, pageY, "max-w-5xl")}>
      <Breadcrumbs items={nodeCrumbs(routes.contact)} />

      {/*
        Three children, explicitly placed from lg up: intro top left, form right across both rows, the
        promises panel under the intro. The form is what this page is for, so in document order (and
        therefore on a phone) it comes second, directly under the intro, and the panel follows it
        instead of pushing it down a screen. At lg the panel takes the height the left column used to
        leave empty: the column was 350px of text beside a 1000px form.
      */}
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-14">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <h1 className={h1}>Tell us what your site is doing</h1>
          <p className="rise-in mt-5 max-w-[46ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
            An engineer reads every ticket. You get a fixed price before anyone touches the site.
          </p>
          {/*
            The page's secondary action was a word inside a sentence, so the one thing a hesitating
            visitor can do instead of filling the form did not read as a control. It is the same
            btn-secondary that most of the site's ChatButton call sites use: 44px, --line-strong
            boundary, house focus ring. Deliberately not a count: it was written as one twice and
            was wrong both times, and it would rot the next time anyone adds a CHAT anywhere.
          */}
          <div className="rise-in mt-6" style={{ animationDelay: "140ms" }}>
            <p className="text-sm text-muted">Rather talk first?</p>
            <ChatButton location="contact" service={service || undefined} className="btn-secondary mt-3" />
          </div>
          <p className="mt-6 border-t border-line pt-6 text-sm text-muted">
            This form never asks for a password. Access is shared over a secure link after booking.
          </p>
          {!brand.email.includes("{{") && (
            <p className="mt-2 text-sm text-muted">
              Or email{" "}
              <a href={`mailto:${brand.email}`} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
                {brand.email}
              </a>
            </p>
          )}
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <div className={cn(card, "md:p-8")}>
            <ContactTabs
              initial={initialTab}
              fix={<BookingFlow type="fix" options={optionsFor("fix")} problems={problemItems} initial={initial} />}
              project={<BookingFlow type="project" options={optionsFor("project")} problems={problemItems} initial={initial} />}
            />
          </div>
        </div>

        {/* A tinted panel, not a second card: the form keeps the only bordered, shadowed surface on the page. */}
        <section
          aria-labelledby="promises"
          className="reveal rounded-[14px] bg-surface-2 p-6 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start"
        >
          <h2 id="promises" className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
            What we promise
          </h2>
          <ul className="mt-4 grid gap-3">
            {promises
              .filter(([confirmed]) => confirmed)
              .map(([, words]) => (
                <li key={words} className="flex gap-3 text-sm">
                  <CheckIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
                  <span className="block first-letter:uppercase">{words}</span>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
