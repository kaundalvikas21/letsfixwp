import { BugIcon, ClockIcon, FileTextIcon, MagnifyingGlassIcon, NotePencilIcon, SealCheckIcon, UsersThreeIcon, WrenchIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { HoverFill } from "@/components/HoverFill";
import { nodeCrumbs } from "@/components/JsonLd";
import { Stagger } from "@/components/motion";
import { ClientClips } from "@/components/sections/v4/ClientClips";
import { ClosingBand, LinkCards, PageMasthead, Section, card, page, pageYMasthead } from "@/components/templates/parts";
import { VideoFrame } from "@/components/VideoFrame";
import { routes } from "@/config/routes";
import { guides, services } from "@/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Write-ups of WordPress sites we have repaired, secured and built.",
  alternates: { canonical: routes.reviews },
};

/**
 * What a write-up contains. A promise about format, not a claim about results, which is the only
 * kind of statement this page is allowed to make while no case study exists: every one of these is
 * true of the next write-up to be published, and none of them asserts anything about a client.
 *
 * Four, never three (rule 6 bans three equal cards in a row), and they run 2x2 rather than 4 across
 * so each one keeps a readable measure at 1152px.
 */
const ANATOMY = [
  { Icon: BugIcon, title: "What the site was doing", text: "The error on screen, in the owner's words and in the log, before anyone touched it." },
  { Icon: MagnifyingGlassIcon, title: "What we found", text: "The cause rather than the symptom, and how it was traced back to that." },
  { Icon: WrenchIcon, title: "What we changed", text: "Every file, plugin and setting we touched, and the reason each one was touched." },
  { Icon: ClockIcon, title: "What it took", text: "How long the work ran, and what the owner had to do while it did." },
] as const;

/**
 * /case-studies/. The page's whole problem is that it has nothing to list, and the redesign is built
 * around that rather than around hiding it.
 *
 * **Nothing here may be invented.** PRODUCT.md puts case studies under what must not be fabricated by
 * any future work, rule 6 bans invented brands, and every testimonial in src/content is still a
 * placeholder. So the page shows what is true: the shape a write-up will take, the one clip that
 * needs nobody's permission to film, a plain sentence saying none are published, and the real
 * material that does exist. When the first write-up lands, it goes in above the empty state and
 * nothing else has to move.
 *
 * It was the only inner page with no masthead and no closing band, which is most of why it read as
 * unfinished rather than as empty. Both are the shared components every other inner page runs, so
 * the page now opens and closes the way the rest of the site does. The `emergency` frame is the one
 * night photograph with a real light source in it that no other masthead had taken, and it is the
 * brightest real scene in the library, which is what the 0.66 scrim needs (docs/image-todo.md has
 * the measured luminance table).
 *
 * Counts on screen are `guides.length` and `services.length`, counted from src/content at build
 * time. Rule 8 allows no other kind of number here.
 */
export default function CaseStudies() {
  return (
    <div className={cn(page, pageYMasthead)}>
      <PageMasthead
        crumbs={nodeCrumbs(routes.reviews)}
        photo="emergency"
        title="Case studies"
        lead="Write-ups of real rescues: what the site was doing, what we found, what we changed, and what it took."
        actions={
          <>
            <BookLink location="case-studies:hero" className="btn-primary" />
            <ChatButton location="case-studies:hero" className="btn-secondary" />
          </>
        }
      />

      {/* The bar, set before the first write-up exists, so a reader can judge whether these will be
          worth reading. `Stagger` ladders the four at the house 70ms step; the cards are not links,
          so `HoverFill` rather than `cardLink` carries the pointer response. That is the one
          sanctioned exception to the Hover Earns It rule, built for the About stats cells and
          reused here rather than inventing a second non-link hover. */}
      <Section id="anatomy" title="What each write-up contains">
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
          {ANATOMY.map(({ Icon, title, text }) => (
            <li key={title}>
              <HoverFill className={cn(card, "h-full")}>
                <Icon weight="duotone" className="size-7 text-accent-text" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold [font-variation-settings:'opsz'_18]">{title}</h3>
                <p className="mt-2 max-w-[42ch] text-muted">{text}</p>
              </HoverFill>
            </li>
          ))}
        </Stagger>
      </Section>

      {/* The clip needs no client's approval, so it is the first evidence this page can carry and it
          sits above the empty state rather than inside it. The frame reserves its own 16/10 box, so
          filling the slot later shifts nothing below it. */}
      <Section id="film" title="The same site, before and after">
        <VideoFrame id="a-site-brought-back" />
      </Section>

      {/* The clients, above the empty state for the same reason the clip is: a client on camera needs
          no write-up to exist first, so it is proof this page can carry today. The wall is four
          portrait frames with no title, summary, caret or link in a cell, which is what keeps it clear
          of the two text-card grids this page already has. Ledger Task 79. */}
      <ClientClips id="clips" title="Clients on camera" layout="grid" />

      {/* One sentence, and deliberately no buttons. The masthead above and the closing band below
          already carry this page's two CTAs, and a third copy of the same pair would be the
          repetition rule 3 exists to stop. */}
      <Section id="status" title="No write-ups are published yet">
        <div className="rounded-[14px] border border-dashed border-line-strong bg-surface p-8 text-center md:p-12">
          <NotePencilIcon weight="duotone" className="mx-auto size-10 text-muted" aria-hidden />
          <p className="mx-auto mt-5 max-w-[52ch] text-muted">
            We publish one once the client has read it and agreed to it going up. Nobody&rsquo;s site appears here before that.
          </p>
        </div>
      </Section>

      {/* Real material, every item a page that exists today. The guide count is the strongest thing
          this page can point at: 37 written answers to specific errors is evidence of the same work
          a case study would describe, and it is already published. */}
      <Section id="instead" title="What to read instead">
        <LinkCards
          items={[
            { href: routes.guides, title: "Knowledge base", summary: `${guides.length} written guides to specific WordPress errors, each one a fix explained step by step.`, icon: FileTextIcon },
            { href: routes.check, title: "Free site check", summary: "We look at a site that still works and tell you what we find before anything breaks.", icon: SealCheckIcon },
            { href: routes.pricing, title: "How we quote", summary: `The three ways to work with us, and every one of the ${services.length} services we price on.`, icon: MagnifyingGlassIcon },
            { href: routes.about, title: "Who does the work", summary: "The people behind the fixes, and the practices every job runs under.", icon: UsersThreeIcon },
          ]}
        />
      </Section>

      <ClosingBand
        title="Want us to look at your site?"
        actions={
          <>
            <BookLink location="case-studies:closing" className="btn-primary" />
            <ChatButton location="case-studies:closing" className="btn-secondary" />
          </>
        }
      />
    </div>
  );
}
