import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  ArrowCounterClockwiseIcon,
  ArrowUpRightIcon,
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  BookOpenIcon,
  BroomIcon,
  CaretRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ClipboardTextIcon,
  CloudArrowUpIcon,
  ColumnsIcon,
  CompassIcon,
  CrosshairIcon,
  CurrencyCircleDollarIcon,
  DatabaseIcon,
  EyeIcon,
  FileTextIcon,
  FlagIcon,
  GaugeIcon,
  GearIcon,
  GlobeIcon,
  HammerIcon,
  HandshakeIcon,
  KeyIcon,
  LifebuoyIcon,
  LightningIcon,
  LinkSimpleIcon,
  ListChecksIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MapTrifoldIcon,
  NotebookIcon,
  PackageIcon,
  PenNibIcon,
  PulseIcon,
  PuzzlePieceIcon,
  QuestionIcon,
  ReceiptIcon,
  RocketLaunchIcon,
  RulerIcon,
  ScalesIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  SignpostIcon,
  SlidersIcon,
  SquaresFourIcon,
  StackIcon,
  StethoscopeIcon,
  TagIcon,
  TargetIcon,
  TestTubeIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersThreeIcon,
  WarningCircleIcon,
  WarningIcon,
  WarningOctagonIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { Illustration } from "@/components/sections/v3/Photo";
import { brand } from "@/config/brand";
import { nodeByPath, routes } from "@/config/routes";
import { getCompare, getGuide, services } from "@/content";
import type { CardArtId } from "@/content/photos";
import type { PracticeId } from "@/content/notices";
import type { Guide, Urgency } from "@/content/schema";
import { cn } from "@/lib/utils";

// v3 template primitives. Visual language from design-system/letsfixwp-v3/MASTER.md: 20px cards, 12px inputs,
// pill buttons, two-layer tinted shadows, one accent, Cabinet Grotesk display over Inter Tight body.

export const page = "mx-auto w-full max-w-6xl px-4 md:px-6";

/**
 * The canonical lead measure, and the written form of a convention the branch had only in practice: 68ch is the
 * lead paragraph on every template and page (20 usages), 70ch the small secondary line that follows it, in a card
 * summary, a link-row summary or an FAQ answer (7). Both sit inside the craft floor's 65 to 75ch. The narrower
 * measures are deliberate and local, not a scale: 56ch and 52ch head a panel or a closing band, 48ch and 62ch
 * carry one short line, and the sub-30ch ones are headline wrap controls rather than body copy. Six body measures
 * are hand-typed across 38 usages; they are correct where they sit and are not worth a refactor. New lead copy
 * takes `prose`, which is this measure; anything narrower states its own in place and reads as the exception.
 */
export const prose = "max-w-[68ch] text-muted";

export const h1 = "font-display text-[2rem] leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem]";
export const h2 = "font-display text-2xl leading-tight font-extrabold tracking-[-0.01em] md:text-3xl";

/** The resting card surface: MASTER's 20px cell. Padding is the caller's, because both p-5 and p-6 ship. */
export const card = "rounded-[20px] border border-line bg-surface shadow-card";

/**
 * `card` as one interactive cell whose whole area is a stretched link, with `stretchedLink` below on the link.
 * /about/, /guides/, /compare/ and the hub template each re-derived this same string, correctly, which was luck
 * rather than a system. Resting elevation stays `shadow-card`; `--shadow-lift` is MASTER's hover shadow only
 * (MASTER.md:99,204). `has-[a:focus-visible]` puts the ring on the cell rather than on the link inside it.
 */
export const cardLink = `group relative ${card} transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-[0.98] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent motion-reduce:transition-none`;

/**
 * The link inside a `cardLink`: the whole cell is the target and this link's text is its accessible name. The
 * link's own outline is dropped only where `:has()` is supported, so `cardLink`'s ring is always the replacement
 * and focus is never invisible. Callers add their own display, height and gap classes.
 */
export const stretchedLink = "supports-[selector(:has(*))]:outline-none after:absolute after:inset-0 after:rounded-[20px] group-hover:text-accent-text";

/**
 * One icon per `securityPractice` item (src/content/notices.ts), by id. The words and their
 * `// brand.claims.x` gate comments are content and live there; icons are not, so they live here, where the
 * home page's security section and /about/ both read them and a practice keeps one icon on both. Keyed by
 * `PracticeId`, so an item added without an icon is a compile error rather than `undefined` as a component.
 */
export const practiceIcons: Record<PracticeId, typeof KeyIcon> = {
  "own-login": KeyIcon,
  "access-ends": UserMinusIcon,
  "backup-first": DatabaseIcon,
  "offsite-backups": CloudArrowUpIcon,
  "price-approved": CheckCircleIcon,
  "change-note": ClipboardTextIcon,
};

/**
 * One icon per `whatWeDo` verb, so a service page's method cards are readable before their text is
 * (the audit's actual target). Built like `practiceIcons` above, and the key is deliberately a union
 * of the verbs in use rather than `string`: a service that introduces a new verb then fails to compile
 * instead of rendering `undefined` as a component. 32 services carry 159 of these items between them
 * and use only these 36 verbs, which is what makes one icon per verb a map rather than a per-service call.
 *
 * Duplicates are honest where the verbs are the same action: Fix and Repair, Maintain and Update.
 */
export type WhatWeDoVerb =
  | "Assess" | "Audit" | "Back up" | "Build" | "Clean" | "Configure" | "Design" | "Diagnose"
  | "Document" | "Fix" | "Handover" | "Harden" | "Integrate" | "Invoice" | "Launch" | "Log"
  | "Maintain" | "Mark up" | "Match" | "Measure" | "Migrate" | "Monitor" | "Onboard" | "Optimize"
  | "Plan" | "Recover" | "Repair" | "Report" | "Request" | "Restore" | "Review" | "Scope"
  | "Secure" | "Test" | "Update" | "Verify";

export const whatWeDoIcons: Record<string, typeof KeyIcon | undefined> & Record<WhatWeDoVerb, typeof KeyIcon> = {
  Assess: StethoscopeIcon,
  Audit: ListChecksIcon,
  "Back up": DatabaseIcon,
  Build: HammerIcon,
  Clean: BroomIcon,
  Configure: SlidersIcon,
  Design: PenNibIcon,
  Diagnose: MagnifyingGlassIcon,
  Document: FileTextIcon,
  Fix: WrenchIcon,
  Handover: HandshakeIcon,
  Harden: ShieldCheckIcon,
  Integrate: PuzzlePieceIcon,
  Invoice: ReceiptIcon,
  Launch: RocketLaunchIcon,
  Log: NotebookIcon,
  Maintain: GearIcon,
  "Mark up": RulerIcon,
  Match: ArrowsLeftRightIcon,
  Measure: GaugeIcon,
  Migrate: PackageIcon,
  Monitor: PulseIcon,
  Onboard: UserPlusIcon,
  Optimize: LightningIcon,
  Plan: MapTrifoldIcon,
  Recover: LifebuoyIcon,
  Repair: WrenchIcon,
  Report: ClipboardTextIcon,
  Request: FlagIcon,
  Restore: ArrowCounterClockwiseIcon,
  Review: EyeIcon,
  Scope: CrosshairIcon,
  Secure: LockIcon,
  Test: TestTubeIcon,
  Update: ArrowsClockwiseIcon,
  Verify: SealCheckIcon,
};

/**
 * The content files are zod-parsed with `verb` as a plain string, so the union above cannot be enforced by
 * the type system at the point the copy is written. This closes that gap the same way photos.ts:133 does
 * for `servicePhotos`: it runs at module load, so a service shipping a verb with no icon fails the build
 * with the service and the verb named, rather than rendering nothing in a card on a live page.
 */
for (const s of services) {
  for (const w of s.whatWeDo) {
    if (!(w.verb in whatWeDoIcons)) {
      throw new Error(`whatWeDoIcons: service "${s.id}" uses the verb "${w.verb}", which has no icon (src/components/templates/parts.tsx)`);
    }
  }
}

/**
 * The short gated facts under a page title. Two of the three reference service pages carry a strip like
 * this directly below the headline, because the first question on these pages is whether the site is safe
 * to hand over, not what the service is called.
 *
 * It renders nothing when `heroChips` is empty, which happens when the owner turns every one of those
 * claims off. On both templates it lives inside the hero block rather than as its own section: the service
 * page's row 9 and the hub's service cards are already chip-shaped families, and rule 3 refuses a second
 * section in a family already on the page.
 */
export function TrustChips({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-7 flex flex-wrap gap-2">
      {items.map((c) => (
        <li
          key={c}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted shadow-card"
        >
          <CheckIcon weight="duotone" className="size-4 shrink-0 text-accent-text" aria-hidden />
          {c}
        </li>
      ))}
    </ul>
  );
}

/**
 * A numbered sequence of moves. The layout family every reference site's service page has and ours did
 * not: all three of fixed.net, fixmysite and gotechark publish a numbered process, because the objection
 * on these pages is handing site access to a stranger, and a visible sequence answers it before the copy does.
 *
 * The numeral is `aria-hidden` and the list is an `ol`, so assistive tech gets the order from the markup
 * rather than hearing it twice. Contract rule 6 bans "Step 1 / Stage 2" labels, which this respects: the
 * numeral is a bare figure in the card, not a label reading "Step 1".
 */
export function StepRow({ steps }: { steps: readonly { verb: string; text: string }[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 md:gap-5">
      {steps.map((s, i) => (
        <li
          key={s.verb}
          data-reveal
          style={{ "--i": i } as React.CSSProperties}
          className="flex h-full flex-col rounded-[20px] border border-line bg-surface p-6 shadow-card"
        >
          <span aria-hidden className="font-display text-3xl leading-none font-extrabold text-accent-text/35">
            {i + 1}
          </span>
          <span className="mt-3 font-display text-lg font-bold">{s.verb}</span>
          <p className="mt-1.5 text-sm text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export const pageMetadata = (seo: { title: string; description: string }, path: string): Metadata => ({
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: path },
  openGraph: { title: seo.title, description: seo.description, url: path, type: "website" },
});

/**
 * One glyph per section `id`, so a reader can tell what a section is before reading its heading. The ids are
 * the ones the templates already pass, which is why nothing had to be threaded through a call site: `Section`
 * looks up its own.
 *
 * `Partial`, on purpose. A section whose id is not here renders the plain heading it always did, so the map
 * can grow with the site instead of having to be exhaustive before the first one works. That also means a new
 * section is never blocked on choosing an icon for it.
 */
const sectionIcons: Partial<Record<string, typeof KeyIcon>> = {
  // guide
  symptoms: EyeIcon,
  causes: MagnifyingGlassIcon,
  "safe-checks": ListChecksIcon,
  "call-us": LifebuoyIcon,
  "related-guides": BookOpenIcon,
  // service
  "how-it-runs": SignpostIcon,
  "what-we-do": WrenchIcon,
  deliverables: SealCheckIcon,
  guides: BookOpenIcon,
  related: LinkSimpleIcon,
  faq: QuestionIcon,
  // hub
  services: SquaresFourIcon,
  "whats-next": SignpostIcon,
  // city
  remote: GlobeIcon,
  // compare
  verdict: ScalesIcon,
  table: ColumnsIcon,
  // pricing
  tiers: TagIcon,
  "how-priced": SignpostIcon,
  included: SealCheckIcon,
  compare: ScalesIcon,
  coverage: TargetIcon,
  // about
  engagement: HandshakeIcon,
  practice: UsersThreeIcon,
  // guides index
  errors: WarningCircleIcon,
};

/**
 * A titled section. The heading always reveals on entry; `revealBody` says who reveals the content.
 * Leave it true where the body is one block, and pass false where the children carry `data-reveal`
 * themselves, so a card is not fading inside an element that is also fading.
 *
 * The heading carries an icon tile from `sectionIcons` when its id has one. The tile is `aria-hidden`: the
 * heading already names the section, so announcing both would read it twice. It is also not an eyebrow, so it
 * costs nothing against a page's eyebrow budget (docs/layout-ledger.md, typed section headers).
 */
export function Section({
  id,
  title,
  children,
  className,
  revealBody = true,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  revealBody?: boolean;
}) {
  const Icon = sectionIcons[id];

  return (
    <section aria-labelledby={id} className={cn("mt-12 md:mt-16", className)}>
      <div data-reveal className="flex items-start gap-3">
        {Icon && (
          <span aria-hidden className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-[12px] border border-line bg-accent-tint">
            <Icon weight="duotone" className="size-5 text-accent-text" />
          </span>
        )}
        <h2 id={id} className={h2}>
          {title}
        </h2>
      </div>
      <div data-reveal={revealBody || undefined} className="mt-5">
        {children}
      </div>
    </section>
  );
}

/**
 * A hero that puts its text left and an illustration right from lg, stacking below it. Six pages need the
 * same two-column shape, so it is one wrapper rather than the same grid typed out six times.
 *
 * The art is last in the DOM and hidden from assistive tech, so a screen reader and a keyboard both reach the
 * heading and the CTAs before anything decorative. Below lg the column collapses and the art sits under the
 * text, which is the right order on a phone: the reason to be on the page first, the picture after.
 */
export function HeroSplit({ art, children, className }: { art: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <header className={cn("mt-6 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12", className)}>
      <div className="lg:col-span-7">{children}</div>
      <div className="lg:col-span-5">
        <div className="aspect-[5/4] overflow-hidden rounded-[20px] shadow-card">{art}</div>
      </div>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbLd(items)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined} className="flex items-center gap-1">
              {i > 0 && <CaretRightIcon weight="duotone" className="size-3.5 shrink-0" aria-hidden />}
              {i === items.length - 1 ? (
                <span className="text-text">{c.name}</span>
              ) : (
                // min-h/min-w 11 keeps the crumb a 44x44 target (contract rule 5); the text stays left aligned.
                <Link href={c.path} className="inline-flex min-h-11 min-w-11 items-center hover:text-text">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Plain disclosure list: no JS, and deliberately not the home page's searchable FAQ card. */
export function Faqs({ faqs, title = "Questions" }: { faqs: { q: string; a: string }[]; title?: string }) {
  return (
    <Section id="faq" title={title}>
      <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface px-5 shadow-card md:px-6">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            {/* Padding sits on the summary, not the details, so the row itself is the 44px target (contract rule 5). */}
            <summary className="flex min-h-14 cursor-pointer items-start justify-between gap-4 py-4 font-display text-lg font-bold marker:content-none [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="relative mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-open:border-accent group-open:text-accent-text motion-reduce:transition-none"
              >
                {/* One glyph rotating out and the bar staying: the plus becomes a minus without swapping nodes. */}
                <span className="absolute h-0.5 w-3 rounded-full bg-current" />
                <span className="absolute h-0.5 w-3 rounded-full bg-current transition-transform rotate-90 group-open:rotate-0 motion-reduce:transition-none" />
              </span>
            </summary>
            <p className="max-w-[70ch] pb-4 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function TickList({
  items,
  cols = 1,
  mark: Mark = CheckIcon,
}: {
  items: readonly string[];
  cols?: 1 | 2;
  /** A check reads as "we provide this". Pass a warning glyph where the items are symptoms, not features. */
  mark?: typeof KeyIcon;
}) {
  return (
    <ul className={cn("grid gap-3", cols === 2 && "sm:grid-cols-2 sm:gap-x-8")}>
      {items.map((x, i) => (
        <li key={x} data-reveal style={{ "--i": i } as React.CSSProperties} className="flex min-w-0 gap-3">
          <Mark weight="duotone" className="mt-1 size-5 shrink-0 text-accent-text" aria-hidden />
          <span className="min-w-0 break-words">{x}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One card in a link-card grid: an illustration banner, then whatever body the caller gives it.
 *
 * Extracted on its third caller rather than copied a third time. The pricing page's service grid, the hub's
 * urgent-problems grid and the guide page's sibling-errors grid had the same twenty lines of frame, banner and
 * hover between them, which is three places for the hover to drift apart.
 *
 * The hover is four things and none of them touch layout: the card lifts, the banner scales, the arrow the
 * caller renders nudges, and the shadow deepens. The scale is on a frame inside the banner and not on the
 * `<img>`, so it never compounds with the image unveil's own `scale(1.06)` start.
 *
 * `index` feeds the reveal stagger. The banner is decorative: the title inside `children` is the card's
 * accessible name, so announcing the picture as well would say the same thing twice.
 */
export function LinkCard({
  href,
  art,
  index = 0,
  children,
}: {
  href: string;
  /** Omit for a text-only card. A banner belongs here only when it differs from card to card. */
  art?: CardArtId;
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <li data-reveal style={{ "--i": index } as React.CSSProperties} className="min-w-0">
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface shadow-card transition-[box-shadow,translate] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
      >
        {art && (
          <span className="block aspect-[16/10] overflow-hidden">
            <span className="block size-full transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transition-none">
              <Illustration id={art} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 44vw, 100vw" />
            </span>
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col p-5">{children}</span>
      </Link>
    </li>
  );
}

/** The grid those cards sit in: three up from lg, two from sm, one below. */
export const cardGrid = "grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3";

// The same cards inside a page's lead column, which is 8 of 12. Three columns there measure about 200px each:
// titles wrapped to three lines and a file path in a symptom was clipped by the card edge. Two columns is the
// column math, not a different design.
export const cardGridInColumn = "grid gap-4 sm:grid-cols-2 md:gap-5";

/**
 * A guide as a card: urgency, title, first symptom, and the literal error text pinned to the foot so it lines
 * up across a row. Shared by the hub's "Most urgent problems" and the guide page's sibling errors, which show
 * the same object and had started to describe it differently.
 */
/**
 * One error, as a card. Carries no banner, and that is measured rather than taste: the banner came from
 * `guideArt`, which read the parent service's hub and intent, and every grid of these is grouped by parent or by
 * hub. Counted over the real content, each grid resolved to exactly one picture: all 26 guides under
 * /wordpress-fix/ returned `working-at-laptop`, all 5 under /wordpress-security/ `shield-and-firewall`, and a
 * service page's 2 to 4 siblings one apiece by construction. It was never distinguishing a card from its
 * neighbour, only repeating one image down the grid. What distinguishes them is the urgency badge, the symptom
 * and the message the software prints, which is what a reader is matching against anyway.
 */
export function GuideCard({ guide, index }: { guide: Guide; index?: number }) {
  return (
    <LinkCard href={routes.guide(guide.slug)} index={index}>
      {/* self-start: as a flex child in a column the badge stretches to the card width otherwise. */}
      <span className="self-start">
        <UrgencyBadge level={guide.urgency} />
      </span>
      <span className="mt-3 flex items-start gap-3">
        <span className={cn("min-w-0 flex-1 font-display text-lg leading-snug group-hover:text-accent-text", guide.urgency === "critical" ? "font-extrabold" : "font-bold")}>
          {guide.title}
        </span>
        <ArrowUpRightIcon
          weight="duotone"
          className="mt-0.5 size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
          aria-hidden
        />
      </span>
      {/* break-words on both: a symptom can quote a file path and a message can be one unbreakable token, and the
          card clips its overflow, so without it the text is cut by the card edge rather than wrapping. The
          message is neither truncated nor clamped: measured over the 20 guides that print one, the median is 31
          characters and the 90th percentile 91, so only the longest (155) runs past three lines, and one taller
          row costs less than cutting the one string a reader is matching against. */}
      <span className="mt-2 block text-sm break-words text-muted">{guide.symptoms[0]}</span>
      {guide.errorText && (
        <code className="mt-auto block rounded-[12px] bg-surface-2 px-3 py-1.5 font-mono text-xs break-words">{guide.errorText}</code>
      )}
    </LinkCard>
  );
}

/**
 * Stacked link cards: a title, an optional summary, and an arrow that leaves the page.
 *
 * This used to be a divided row list ending in a right chevron, which made it identical to `Faqs` below,
 * class for class, and that is the wrong affordance rather than merely a repeated one: a divided row list
 * with a right chevron is the web's standard "expand me". Four sections were promising disclosure and
 * delivering navigation, and on both the guide and service templates this sits directly beside the real
 * accordion.
 *
 * Three things now separate the two, so it does not rest on one cue: separate cards instead of divided rows,
 * `ArrowUpRight` instead of `CaretRight`, and a hover lift, which a disclosure row never has because it is
 * not a link. The arrow is the glyph the home bento cells and quote cards already use for navigation, so the
 * caret is now the disclosure signal everywhere and nothing else.
 */
export function LinkRows({ items }: { items: { href: string; title: string; summary?: string }[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((i, n) => (
        <li key={i.href} data-reveal style={{ "--i": n } as React.CSSProperties}>
          <Link
            href={i.href}
            className={cn(
              "group flex items-start gap-4 rounded-[20px] border border-line bg-surface p-5 shadow-card",
              "transition-shadow hover:shadow-lift motion-reduce:transition-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg leading-snug font-bold group-hover:text-accent-text">{i.title}</span>
              {i.summary && <span className="mt-1 block max-w-[70ch] text-sm text-muted">{i.summary}</span>}
            </span>
            <ArrowUpRightIcon
              weight="duotone"
              className="mt-0.5 size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

const urgencyLabel: Record<Urgency, string> = { critical: "Critical", high: "High", standard: "Standard" };

/**
 * Guide urgency as weight, not a new hue: the accent for critical and muted otherwise. Colour is never the only
 * signal (contract rule 9): the level is written out, and critical and high carry different icons. Presentational
 * and not interactive, so it can sit inside a link row.
 */
export function UrgencyBadge({ level, className }: { level: Urgency; className?: string }) {
  const Icon = level === "critical" ? WarningOctagonIcon : level === "high" ? WarningIcon : null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs",
        level === "critical" ? "border-accent bg-accent-tint font-bold text-accent-text" : "border-line-strong font-medium text-muted",
        className,
      )}
    >
      {Icon && <Icon weight="duotone" className="size-3.5 shrink-0" aria-hidden />}
      {urgencyLabel[level]}
      <span className="sr-only"> urgency</span>
    </span>
  );
}

/** Title for any internal path a content file links to (SITEMAP node, guide or compare). */
export const titleForPath = (p: string) => {
  const node = nodeByPath.get(p);
  if (node) return node.title;
  const [, kind, slug] = p.split("/");
  if (kind === "guides") return getGuide(slug)?.title ?? p;
  if (kind === "compare") {
    const c = getCompare(slug);
    return c ? `${c.a} vs ${c.b}` : p;
  }
  return p;
};

// What a related path lands on, in the reader's words. `titleForPath` already resolves the three sources a
// content file can point at, so this reads the same branch rather than inventing a second one: a SITEMAP node
// carries its own kind, and guides and comparisons are identified by their path prefix.
const KIND_LABEL: Record<string, string> = {
  hub: "Category",
  service: "Service",
  cityHub: "Cities",
  city: "City",
  page: "Page",
  collection: "Collection",
  home: "Home",
  guide: "Guide",
  compare: "Comparison",
};

export const kindForPath = (p: string): string => {
  const node = nodeByPath.get(p);
  if (node) return KIND_LABEL[node.kind] ?? "Page";
  const kind = p.split("/")[1];
  return KIND_LABEL[kind === "guides" ? "guide" : kind] ?? "Page";
};

/**
 * The related block that closes a page body, shared so every page that ends with one ends with the same thing.
 * Cards rather than the chip row it replaced: a chip gave a title and nothing else, and these paths point at
 * four different kinds of page, so what you are about to land on was the one thing the control did not say.
 *
 * Deliberately lighter than the guide and service cards above it (no banner, no summary, `surface-2` and no
 * shadow, a 2-up grid rather than 3): a page body may already carry a card grid, and a reader has to be able to
 * tell the section that lists the work from the section that leaves the page. Two up because the measured
 * content is 3 or 4 paths per service, which fills two columns and leaves no stranded third.
 */
export function RelatedGrid({ paths }: { paths: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {paths.map((p, i) => (
        <li key={p} data-reveal style={{ "--i": i } as React.CSSProperties} className="min-w-0">
          <Link
            href={p}
            className="group flex h-full min-w-0 flex-col rounded-[20px] border border-line bg-surface-2 p-4 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
          >
            <span className="font-display text-xs font-bold tracking-wide text-accent-text uppercase">{kindForPath(p)}</span>
            <span className="mt-1.5 flex items-start gap-3">
              <span className="min-w-0 flex-1 font-display leading-snug font-bold group-hover:text-accent-text">{titleForPath(p)}</span>
              <ArrowUpRightIcon
                weight="duotone"
                className="mt-0.5 size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
                aria-hidden
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LinkList({ paths }: { paths: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {paths.map((p) => (
        <li key={p}>
          <Link
            href={p}
            className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm font-medium hover:border-accent hover:text-accent-text"
          >
            {titleForPath(p)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Conversion rail for a page whose body runs in a lead column. One DOM node at every width: below lg it sits in
 * normal document flow as a reassurance panel, and from lg it becomes the sticky rail. The title and the CTA pair
 * are hidden below lg by CSS, because the global fixed bottom bar is the persistent CTA there.
 * Order is deliberate: the page's own CTA pair first, then the promises behind it. `facts` is for real numbers
 * out of src/content, and a null or missing value renders nothing for it (contract rule 8), so no row of the
 * rail is a placeholder figure. The guarantee comes from brand.guarantee and disappears when it is unset.
 * `points` are claim lines: callers pass `railPoints` from src/content/notices.ts (the about page passes none), which holds the one
 * wording of each claim with its `// brand.claims.x` gate comment, so the rail hard-codes none of that prose.
 */
export function FactRail({
  title,
  facts = [],
  points = [],
  children,
}: {
  title: string;
  facts?: readonly { k: string; v: string }[];
  points?: readonly string[];
  children: React.ReactNode;
}) {
  const g = brand.guarantee;
  // With no facts, no guarantee and no claims there is nothing to reassure anyone with, so the panel has no
  // reason to exist in flow; at lg the title and CTA pair still earn the rail.
  const hasBody = facts.length > 0 || !!g || points.length > 0;
  return (
    <div
      className={cn(
        "rounded-[20px] border border-line bg-surface p-6 shadow-card lg:sticky lg:top-28",
        !hasBody && "hidden lg:block",
      )}
    >
      <p className="hidden font-display text-lg leading-snug font-bold lg:block">{title}</p>
      <div className="hidden gap-2 lg:mt-5 lg:grid">{children}</div>

      {hasBody && (
        <div className="space-y-5 divide-y divide-line text-sm [&>*+*]:pt-5 lg:mt-6 lg:border-t lg:border-line lg:pt-5">
          {facts.length > 0 && (
            <dl className="space-y-2">
              {facts.map((f) => (
                <div key={f.k} className="flex justify-between gap-4">
                  <dt className="text-muted">{f.k}</dt>
                  <dd className="font-semibold tabular-nums">{f.v}</dd>
                </div>
              ))}
            </dl>
          )}

          {g && (
            <div>
              <Link
                href={routes.legal.guarantee}
                className="inline-flex min-h-11 min-w-11 items-center gap-2 font-semibold text-accent-text hover:underline hover:underline-offset-4"
              >
                <SealCheckIcon weight="duotone" className="size-5 shrink-0" aria-hidden />
                {g.days}-day guarantee
              </Link>
              {g.placeholder && <p className="text-muted">Placeholder, not a real offer yet.</p>}
            </div>
          )}

          {points.length > 0 && (
            <ul className="space-y-3 text-muted">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Symptoms with any line that restates `alreadyShown` removed, so a page never prints the same string twice:
 * the index card drops a symptom that quotes the error text it already shows, and the guide page drops whatever
 * the diagnostic panel took (the error text, or the first symptom when the failure prints no message).
 *
 * ponytail: a 24-character, case-sensitive prefix test matched as a substring, not a parser. What it cannot do,
 * so the next person rewording a guide can see what would break it:
 *   - 24 characters is the whole key, so two errors that open with the same long phrase read as one string;
 *   - it is case-sensitive, so a symptom that recapitalises the message keeps its duplicate;
 *   - the shortest errorText on the site is 11 characters, and a key that short drops every symptom containing
 *     it, not only the one quoting it;
 *   - a symptom that quotes the error loses its surrounding context with it, because the whole line goes.
 * Measured against all 37 guides on 2026-10-22: 14 of the 20 with errorText quote it, no second symptom repeats
 * the key, and the shortest list this leaves is three lines. A guide that ever reads wrong wants its own symptom
 * reworded, not a smarter matcher here.
 */
export const symptomsBesides = (symptoms: readonly string[], alreadyShown: string | undefined): string[] =>
  alreadyShown ? symptoms.filter((x) => !x.includes(alreadyShown.slice(0, 24))) : [...symptoms];

/**
 * The literal message a failure prints, set as typography on an inset surface with a 1px accent rule down the
 * left edge. Not a screenshot and not dressed as one: contract rule 6 and MASTER.md:189 ban div-built browser
 * chrome, so this is a quotation, labelled as the software's words rather than ours.
 *
 * `errorText` is optional and 17 of the 37 guides print no message at all. Rather than render an empty box or
 * nothing, the panel then carries `fallback` (the guide's first symptom) in plain type under its own label, and
 * the caller drops that line from its symptom list so nothing appears twice.
 */
export function DiagnosticPanel({ errorText, fallback, className }: { errorText?: string; fallback: string; className?: string }) {
  return (
    <figure className={cn("rounded-[12px] border border-line border-l-accent bg-surface-2 px-5 py-4", className)}>
      <figcaption className="text-sm font-semibold">{errorText ? "What WordPress prints" : "What you see on the page"}</figcaption>
      {errorText ? (
        <code className="mt-2 block font-mono text-sm break-words whitespace-pre-wrap">{errorText}</code>
      ) : (
        <p className="mt-2 max-w-[68ch]">{fallback}</p>
      )}
    </figure>
  );
}

/**
 * Several causes converging on one failure, and the same short set of safe checks leading out of it. Geometry
 * only, no words inside it beyond the numerals that match the ordered list of checks, and `aria-hidden`: it is a
 * diagram of content that already exists as two lists, and the figcaption beside it states the same relation as
 * a sentence, so a screen reader gets the information as text (contract rule 9).
 * Connectors use --line-strong rather than --line: --line measures 1.24:1 and is decorative only.
 */
export function CauseFlow({ causes, checks }: { causes: number; checks: number }) {
  const pitch = 30;
  const h = Math.max(causes, checks) * pitch + 20;
  const mid = h / 2;
  const row = (n: number, i: number) => mid + (i - (n - 1) / 2) * pitch;
  const node = "fill-accent-tint stroke-accent";
  return (
    <svg viewBox={`0 0 240 ${h}`} width="240" height={h} className="h-auto w-full max-w-[15rem] shrink-0" aria-hidden focusable="false">
      <g strokeWidth="1.5" fill="none" className="stroke-line-strong">
        {Array.from({ length: causes }, (_, i) => (
          <path key={`in-${i}`} d={`M20 ${row(causes, i)} C 62 ${row(causes, i)}, 76 ${mid}, 108 ${mid}`} />
        ))}
        {Array.from({ length: checks }, (_, i) => (
          <path key={`out-${i}`} d={`M132 ${mid} C 164 ${mid}, 178 ${row(checks, i)}, 204 ${row(checks, i)}`} />
        ))}
      </g>
      {Array.from({ length: causes }, (_, i) => (
        <circle key={`c-${i}`} cx="12" cy={row(causes, i)} r="6" strokeWidth="1.5" className={node} />
      ))}
      <circle cx="120" cy={mid} r="11" strokeWidth="1.5" className={node} />
      {Array.from({ length: checks }, (_, i) => (
        <g key={`k-${i}`}>
          <circle cx="216" cy={row(checks, i)} r="12" strokeWidth="1.5" className={node} />
          <text x="216" y={row(checks, i)} textAnchor="middle" dominantBaseline="central" className="fill-text font-sans text-[11px] font-bold">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** A real capture from scripts/capture-errors.mjs, in a device frame, rendered only once the file exists. */
export function RealScreen({ slot, alt, preload = false }: { slot: string; alt: string; preload?: boolean }) {
  const src = `/screens/${slot}.png`;
  if (!existsSync(join(process.cwd(), "public", src))) return null;
  return (
    <figure className="overflow-hidden rounded-[20px] bg-surface-2 p-2 shadow-card">
      <Image src={src} alt={alt} width={1600} height={1000} preload={preload} sizes="(min-width: 1024px) 60vw, 100vw" className="rounded-[12px]" />
    </figure>
  );
}

/** Shown instead of the fixmywp.com legal text while brand.legacy.enabled is false. */
export function LegalPending({ title }: { title: string }) {
  return (
    <article className={cn(page, "py-16")}>
      <h1 className={h1}>{title}</h1>
      <p className={cn(prose, "mt-4")}>This page is being prepared. Until it is published, write to us with any question about it.</p>
    </article>
  );
}

/**
 * The two sides of a comparison as lettered labels, not controls: no pill, no control-height box. The letter
 * carries the A/B identity, not the colour (rule 9). `decorative` hides it where an h1 already names both.
 */
export function Versus({ a, b, decorative, className }: { a: string; b: string; decorative?: boolean; className?: string }) {
  const side = "inline-flex items-center gap-2 font-display text-base font-bold";
  const letter = "grid size-7 place-items-center rounded-full border-2 text-xs";
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)} aria-hidden={decorative || undefined}>
      <span className={side}>
        <span className={cn(letter, "border-accent text-accent-text")} aria-hidden>
          A
        </span>
        {a}
      </span>
      <span className="text-sm font-semibold text-muted">vs</span>
      <span className={side}>
        <span className={cn(letter, "border-text text-text")} aria-hidden>
          B
        </span>
        {b}
      </span>
    </p>
  );
}
