import { ArrowCircleUpIcon, FileTextIcon, GaugeIcon, HardDrivesIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, page, pageY } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { BookingFlow } from "../contact/BookingFlow";

export const metadata: Metadata = {
  title: "Free WordPress Site Check",
  description: "Not an emergency? Ask for a free check of your WordPress site: updates, backups, security basics and speed.",
  alternates: { canonical: routes.check },
};

// ui-ux-pro-max Lead Magnet + Form: benefit headline, a preview of the magnet, then the smallest form that can
// deliver it. The form is the shared BookingFlow in "check" mode (site address, what to look at, contact).
//
// Each line carries its own mark, and the four were four identical ember ticks. A tick says "this is
// a list", which the bullet already said; it cannot say which of the four lines you are looking at,
// and these four are four different subjects. The marks are the site's existing vocabulary, taken
// from `verbIcon` where that map already fixes their meaning: Update is the up-arrow, Back up the
// hard drives, Harden the shield, Measure the gauge.
//
// Declared here rather than in `src/content/icons.ts` because this copy is page-local and has no
// content-layer field to key off. The rule that file states is that a mark is never chosen per
// string at the render site; one declaration beside the strings it belongs to satisfies that, and
// there is nothing for a build check to iterate.
const COVERED = [
  { Mark: ArrowCircleUpIcon, title: "Versions", detail: "WordPress core, plugins and themes" },
  { Mark: HardDrivesIcon, title: "Backups", detail: "Whether they exist, and where they are stored" },
  { Mark: ShieldCheckIcon, title: "Security basics", detail: "Admin accounts, file permissions, known vulnerable plugins" },
  { Mark: GaugeIcon, title: "Speed", detail: "Page speed and Core Web Vitals" },
];

export default function FreeSiteCheck() {
  return (
    <div className={cn(page, pageY)}>
      <Breadcrumbs items={nodeCrumbs(routes.check)} />

      {/* The h1 carries no `rise-in`: it is the LCP element on this route and an element at opacity
          0 is not painted. The lead, the card and the chat line rise under it 70ms apart, and the
          form rises with the card so the two columns arrive together rather than one chasing the
          other across the page. */}
      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <h1 className={h1}>Free WordPress site check</h1>
          <p className="rise-in mt-5 max-w-[60ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
            For sites that work today. Tell us the address and an engineer looks at updates, backups, security basics and speed.
          </p>

          {/* The house card, not a bare `--surface-2` box. It sits beside the form card, which is
              bordered and lifted, and two panels of the same job in one row reading as different
              materials made the left one look like a note someone left on the page. */}
          <section
            aria-labelledby="covered"
            className="rise-in mt-8 rounded-[14px] border border-line bg-surface p-6 shadow-card"
            style={{ animationDelay: "140ms" }}
          >
            <h2 id="covered" className="font-display text-lg font-bold">
              What the check covers
            </h2>
            {/* Title and detail, not one long sentence each. The four lines were 6, 8, 10 and 6
                words of the same weight and the same colour, so the only way to find the one you
                cared about was to read all four. The words are the same words. */}
            <ul className="mt-5 divide-y divide-line">
              {COVERED.map(({ Mark, title, detail }) => (
                <li key={title} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                  {/* `bg-bg` inside a `--surface` card: an `accent-tint` tile vanished against a
                      lit panel twice before, in Tasks 30 and 31. Ember on `--bg` is 6.30:1. */}
                  <span aria-hidden className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[14px] border border-line bg-bg">
                    <Mark weight="duotone" className="size-[18px] text-accent-text" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium">{title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            {/* The deliverable, which is what the whole page is asking for an address in exchange
                for, so it gets a mark of its own. `checkTurnaround` is gated the way /pricing/
                gates it: contract rule 8 says a null value renders nothing, and without the gate
                this sentence would read "within . No call needed." */}
            <p className="mt-5 flex gap-3 border-t border-line pt-4 text-sm text-muted">
              <FileTextIcon weight="duotone" aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
              <span>
                What arrives: a written summary of what we found and what to do first
                {brand.claims.checkTurnaround ? `, within ${brand.claims.checkTurnaround}` : ""}. No call needed.
              </span>
            </p>
          </section>

          {/* `icon={null}` and the underline treatment `FinalCta` already uses for this exact
              shape. Without the first, the CHAT chip is a 28px grid box that forces the button to
              48px in the middle of a 14px sentence, which is what this line was doing; without the
              second, a bare `<button>` under Tailwind's preflight inherits the sentence completely
              and there is nothing on screen to say it can be pressed. */}
          <p className="rise-in mt-6 text-sm text-muted" style={{ animationDelay: "210ms" }}>
            Questions first?{" "}
            <ChatButton
              location="free-site-check"
              icon={null}
              // `py-3` for the 44px target contract rule 5 asks for. `ChatButton` renders
              // `inline-block`, so unlike a true inline box this padding does grow the line: the
              // paragraph measures 44px rather than 20px, which is 24px of leading paid for a hit
              // area a thumb can find. WCAG 2.5.8 would have exempted it as a target inline in a
              // sentence, which is the exemption the three sibling `CheckLink`s on /guides/,
              // /pricing/ and the guide template rely on; this one does not need to.
              className="cursor-pointer py-3 font-medium text-text underline underline-offset-4 transition-colors duration-200 hover:text-accent-text hover:no-underline motion-reduce:transition-none"
            />
          </p>
        </div>

        <div className="rise-in lg:col-span-6" style={{ animationDelay: "140ms" }}>
          <div className="rounded-[14px] border border-line bg-surface p-6 shadow-card md:p-8">
            <BookingFlow type="check" options={[]} problems={[]} initial={{ service: "", guide: "", url: "" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
