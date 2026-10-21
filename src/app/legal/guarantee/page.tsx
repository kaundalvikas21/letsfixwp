import { CheckIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookLink, ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, card, h1, page, pageY, Section } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

// LetsFixWP's own guarantee (brand.guarantee) when the owner has set one. Otherwise the legacy path (docs/foundation.md,
// fixmywp.com's guarantee, only when legacy.enabled), else 404.
// ponytail: states only the confirmed fact; the owner supplies the full terms.
export const metadata: Metadata = {
  title: "Guarantee",
  alternates: { canonical: routes.legal.guarantee },
  robots: { index: false, follow: true },
};

// Unconfirmed values must never reach the page (the same guard /contact/ and the footer carry).
// While it is unset the way to a human is CHAT and BOOK, which work with no email configured at all.
const hasEmail = !brand.email.includes("{{");

/**
 * The reassurance that is actually confirmed, quoted verbatim from the `confirm(...)` descriptions in
 * src/config/brand.ts, exactly as /contact/ does. Never reword one here. These are not the guarantee
 * and the page says so: they are what a visitor asking "what protects me" can rely on today, while
 * `brand.guarantee` is still a placeholder. The four protection claims only; sameDay, bookingMinutes,
 * vetted and checkTurnaround are speed claims and answer a different question. Each row renders only
 * while its own claim is truthy, because an unconfirmed claim can be null.
 */
const promises = [
  [brand.claims.fixedPrice, "fixes are fixed price, agreed before work starts"],
  [brand.claims.backupFirst, "a full backup is taken before any change"],
  [brand.claims.ownLogin, "we work through a login you create for us and never ask for your password"],
  [brand.claims.accessRemoved, "our access is removed when the work is done"],
] as const;

/**
 * /legal/guarantee/. Layout family: reading column with a standing answer card (7/5 at lg).
 *
 * Deliberately not the service page's ReadingRail (8/4, several stacked blocks) and not the contact
 * page's 5/7 two-row form grid: there is one question here and one answer to it. The left column is
 * the guarantee's own column and is where the real terms land when the owner writes them, so the
 * page does not need relaying then; the card beside it is the way out, and it sticks once that
 * column is long enough to scroll.
 *
 * The page is thin because its content is genuinely unconfirmed. No terms are written here.
 */
export default function Guarantee() {
  const facts = brand.legacy.facts;
  const g = brand.guarantee;
  if (!g && !facts) notFound();
  const days = g ? g.days : facts!.guaranteeDays;

  return (
    <article className={cn(page, pageY)}>
      {/* /legal/ sits outside SITEMAP on purpose (routes.utilityPaths), so the trail is built rather
          than walked: nodeCrumbs on a path the tree does not hold returns an empty list. */}
      <Breadcrumbs items={[...nodeCrumbs(routes.home), { name: "Guarantee", path: routes.legal.guarantee }]} />

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className={h1}>Our {days}-day guarantee</h1>

          {g?.placeholder && (
            // The same notice the home page's guarantee section carries, in the same words, so the
            // section and the page it links to read as one thing. Quiet on purpose: it is a note to
            // the owner, not a warning to the visitor, and a production deploy fails while it shows.
            <p className="mt-6 w-fit rounded-[14px] border border-dashed border-line-strong px-3 py-2 text-sm text-muted">
              Placeholder guarantee, not a real offer. Replace before launch.
            </p>
          )}

          {/* Everything the guarantee says today is this one line. The headline paints first and is
              never faded (it is the LCP element); the sentence it introduces arrives under it. */}
          <p className="rise-in mt-6 max-w-[60ch] text-lg" style={{ animationDelay: "70ms" }}>
            {g ? g.summary : `Every service carries a ${days}-day guarantee.`}
          </p>

          <Section id="promises" title="What we promise">
            <p className="max-w-[60ch] text-muted">These are not the guarantee terms. They apply to every job we take.</p>
            {/* The tick treatment /contact/ already gives these exact four sentences, so the same
                commitments look the same wherever the site states them. */}
            <ul className="mt-5 grid gap-3">
              {promises
                .filter(([confirmed]) => confirmed)
                .map(([, words]) => (
                  <li key={words} className="flex gap-3">
                    <CheckIcon weight="duotone" className="mt-1 size-5 shrink-0 text-accent-text" aria-hidden />
                    {/* first-letter:uppercase is presentation only: the sentence itself is the
                        owner's approved wording and is not edited here. */}
                    <span className="block max-w-[60ch] first-letter:uppercase">{words}</span>
                  </li>
                ))}
            </ul>
          </Section>
        </div>

        {/* The way out. A visitor on this page is mid-decision, so the page may not end in a link to
            another legal document: BOOK and CHAT both work with no email and no chat provider set. */}
        <section
          aria-labelledby="ask"
          className={cn(card, "rise-in lg:col-span-5 lg:sticky lg:top-24 lg:self-start")}
          style={{ animationDelay: "140ms" }}
        >
          <h2 id="ask" className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
            Ask about the guarantee
          </h2>
          <p className="mt-2 text-sm text-muted">
            The full terms are not published yet. If you need to know where you stand before you book, ask an engineer.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <BookLink location="guarantee" className="btn-primary" />
            <ChatButton location="guarantee" className="btn-secondary" />
          </div>
          {hasEmail && (
            <p className="mt-5 text-sm text-muted">
              Or email{" "}
              <a href={`mailto:${brand.email}`} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
                {brand.email}
              </a>
            </p>
          )}
          <p className="mt-5 border-t border-line pt-5 text-sm text-muted">
            See also our{" "}
            <Link
              href={routes.legal.terms}
              className="inline-flex min-h-6 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
            >
              Terms of Service
            </Link>
          </p>
        </section>
      </div>
    </article>
  );
}
