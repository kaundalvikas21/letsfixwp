import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { ClosingBeams } from "@/components/templates/ClosingBeams";
import { Breadcrumbs, card, h1, page, pageY, PromiseFlow } from "@/components/templates/parts";
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
    <div className={cn(page, pageY)}>
      <Breadcrumbs items={nodeCrumbs(routes.contact)} />

      {/*
        Two columns from lg up: the intro and the promises in one sticky column, the form beside it.

        Below lg the column wrapper is `contents`, so its two children join the grid directly and `order`
        puts the form between them. The form is what this page is for, so on a phone it comes straight
        after the intro, and the promises follow it instead of pushing it down a screen. Nothing in the
        promises can take focus, so tab order still matches what is on screen.

        The form runs from 794px to 1299px depending on tab and step, so the column cannot be made to
        match it. It stays its own height and follows the scroll instead (ledger Task 78).

        The column is 779px tall at 1280, so it fits under the header from 900px of screen height. Below
        that `top` goes negative: pinned at the usual 104px the last promise would sit below the fold for
        the whole form, so instead the heading scrolls away and the promises stay in view.

        ponytail: `50.25rem` is that measured height plus a 25px margin, written by hand,
        because CSS cannot read an element's own height. If the intro or promises change length, re-measure.
      */}
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="contents lg:sticky lg:top-[min(calc(var(--header-h)+1.5rem),calc(100dvh-50.25rem))] lg:col-span-5 lg:block lg:self-start">
          <div className="order-1">
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
            <p className="mt-6 border-t border-line pt-6 text-sm text-muted lg:mt-5 lg:pt-5">
              This form never asks for a password. Access is shared over a secure link after booking.
            </p>
            {!brand.email.includes("{{") && (
              <p className="mt-2 text-sm text-muted">
                Or email{" "}
                <a
                  href={`mailto:${brand.email}`}
                  className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
                >
                  {brand.email}
                </a>
              </p>
            )}
          </div>

          <div className="order-3 lg:mt-6">
            {/* A tinted panel, not a second card: the form keeps the only bordered, shadowed surface on the
              page. `rise-in` rather than the scroll reveal, because in a sticky column the lowest rows can
              stop below the reveal's trigger line and would stay invisible while stuck. */}
            <section
              aria-labelledby="promises"
              className="rise-in relative isolate overflow-clip rounded-[14px] bg-surface-2 p-6 lg:p-5"
              style={{ animationDelay: "210ms" }}
            >
              {/* Flipped, because the artwork is densest at its top: this way up it sits lower in the card
                and fades towards the heading. A faint trail can still cross a sentence. */}
              <div aria-hidden className="absolute inset-0 -z-10 -scale-y-100">
                <ClosingBeams />
              </div>
              <h2 id="promises" className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
                What we promise
              </h2>
              {/* The sentences and the claim gate are shared with /legal/guarantee/. */}
              <div className="mt-4">
                <PromiseFlow />
              </div>
            </section>
          </div>
        </div>

        <div className="order-2 lg:col-span-7 lg:col-start-6">
          <div className={cn(card, "md:p-8")}>
            <ContactTabs
              initial={initialTab}
              fix={<BookingFlow type="fix" options={optionsFor("fix")} problems={problemItems} initial={initial} />}
              project={<BookingFlow type="project" options={optionsFor("project")} problems={problemItems} initial={initial} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
