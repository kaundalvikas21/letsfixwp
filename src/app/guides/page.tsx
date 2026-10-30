import { ClosingCta } from "@/components/sections/v3/ClosingCta";
import type { Metadata } from "next";
import { Illustration } from "@/components/sections/v3/Photo";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { SearchTrigger } from "@/components/sections/v3/ProblemSearch";
import { Breadcrumbs, cardGrid, cardLink, h1, HeroSplit, LinkList, page, Section, stretchedLink, symptomsBesides, UrgencyBadge } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { guides, guidesFor, services } from "@/content";
import type { Guide, Urgency } from "@/content/schema";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WordPress Error Guides",
  description: "Plain guides to specific WordPress errors: what you see, what causes it, what is safe to try, and when to call an engineer.",
  alternates: { canonical: routes.guides },
};

// Urgency is the primary grouping: it is the only ranking signal in the guide data, and someone opening this page
// may be down right now. The parent service stays on every card as a secondary label, and the chip row below
// links every service that has guides, so the service grouping this page used to have is still reachable.
const ORDER = ["critical", "high", "standard"] as const;

// What the level means, in the reader's terms. The badge beside it carries the level itself, in words and with
// its own icon, so the grouping never depends on colour (contract rule 9).
const meaning: Record<Urgency, string> = {
  critical: "Site down, unreachable or compromised",
  high: "Loads, but something important is broken",
  standard: "Working, but not as it should be",
};

// 14 of the 20 guides that have errorText open their first symptom by quoting it, which would print the error
// twice on one card, so the card takes the first symptom that does not restate it. symptomsBesides carries that
// heuristic and its limits for both this page and the guide template; the fallback is dead today, because no
// guide restates its error in every symptom, and is there so a card can never end up with no line at all.
const cardLine = (g: Guide) => symptomsBesides(g.symptoms, g.errorText)[0] ?? g.symptoms[0];

// The shared interactive cell from parts.tsx, with this page's own box on top. min-w-0 twice over: a grid item
// and a flex item both default to min-width auto, and the truncated error line is nowrap, so without it one long
// error string sizes the whole column and the page scrolls sideways at 375.
const errorCard = cn(cardLink, "flex h-full min-w-0 flex-col p-4");

// Inside the closing band the link sits on --surface-2, where small accent text measures 4.31:1 (MASTER.md:49),
// so this one is underlined body text rather than accent text. Accent text on --bg and --surface is fine.
const quietLink = "inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:no-underline";

export default function GuidesIndex() {
  const groups = ORDER.map((level) => ({ level, items: guides.filter((g) => g.urgency === level) })).filter((x) => x.items.length > 0);
  const parentPaths = services.filter((s) => guidesFor(s.id).length > 0).map((s) => s.path);

  return (
    <div className={cn(page, "max-w-5xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.guides)} />
      <HeroSplit art={<Illustration id="browser-with-code" sizes="(min-width: 1024px) 40vw, 100vw" />} className="mt-0">
        <h1 className={cn(h1, "mt-6 lg:mt-0")}>Knowledge Base</h1>
      <p className="mt-5 max-w-[68ch] text-lg text-muted">Find the exact error you see. Each guide lists safe checks and links to the fix.</p>

      {/* The site's own command palette, in the same control it uses everywhere else, rather than a second
          filter written for this page. Without JavaScript the trigger does nothing and the whole list below
          still renders, so the page degrades instead of breaking. */}
      <div className="mt-7 rounded-[20px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <p className="font-display text-lg font-bold">Search by what you see</p>
        <p className="mt-1 max-w-[56ch] text-sm text-muted">Type the error text or describe the symptom. It opens the matching page.</p>
        {/* The shell's own trigger, as a full width bar with wording at every width: pages/guide.md asks for a
            prominent search here, and below lg the nav shape is a bare magnifier. The wording matches the
            palette's own placeholder, so the control says the same thing before and after it opens. */}
        <SearchTrigger
          variant="pill"
          label="What is your site doing?"
          className="mt-4 w-full justify-start gap-3 px-4 text-base lg:px-4"
        />
        </div>
      </HeroSplit>

      <Section id="errors" revealBody={false} title="Pick the error you are seeing">
        {groups.map(({ level, items }) => (
          <div key={level} className="mt-8 first:mt-0">
            <div data-reveal className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line pb-3">
              <h3 className="font-display text-xl leading-snug font-bold">{meaning[level]}</h3>
              <UrgencyBadge level={level} />
              {/* The count lets a reader size a group and skip it without scrolling it. */}
              <span className="ms-auto text-sm text-muted">{items.length} guides</span>
            </div>
            <ul className={cn(cardGrid, "mt-5")}>
              {items.map((g, i) => (
                <li key={g.slug} data-reveal style={{ "--i": i } as React.CSSProperties} className={errorCard}>
                  <h4 className="font-display text-base leading-snug font-bold">
                    {/* Stretched link: the whole card is the target, and the title is its accessible name. */}
                    <Link href={routes.guide(g.slug)} className={cn("flex min-h-11 items-center", stretchedLink)}>
                      {g.title}
                    </Link>
                  </h4>
                  {/* The second line is what the screen says, which is the recognition key after the title: the
                      message itself in mono where the software prints one, and otherwise the symptom in plain
                      text, so the two are never mistaken for each other. It hugs the title rather than sitting at the card
                      foot: the two lines are one unit to scan, and the grid stretches every card to the row height
                      anyway, so the boxes stay level without pushing the pair apart.
                      Printed in full rather than truncated: at three columns a single line cut five of the twenty
                      messages mid-phrase, and a half-printed message is no longer something to match against.
                      It needs no clamp either, because the measured median is 31 characters and the 90th
                      percentile 91. `break-words` is what lets an unbreakable token (ERR_TOO_MANY_REDIRECTS)
                      wrap instead of sizing the column. */}
                  {g.errorText ? (
                    <div className="mt-2 min-w-0">
                      <code className="block rounded-[12px] bg-surface-2 px-2.5 py-1 font-mono text-xs break-words text-muted">{g.errorText}</code>
                    </div>
                  ) : (
                    <p className="mt-2 line-clamp-2 text-xs text-muted">{cardLine(g)}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      <Section id="services" title="Where we fix these">
        <LinkList paths={parentPaths} />
      </Section>

      <ClosingCta
        id="guides-closing"
        title="Rather not do it yourself?"
        sub="Every fix in these guides is something we can do for you, starting from the error you are seeing."
        location="guides-index:closing"
        showCheck
      />
    </div>
  );
}
