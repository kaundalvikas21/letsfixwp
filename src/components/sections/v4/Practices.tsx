import { Fragment } from "react";
import { HandshakeIcon, HardDrivesIcon, KeyIcon, ShieldCheckIcon, SignOutIcon } from "@phosphor-icons/react/ssr";
import { brand } from "@/config/brand";
import { PracticeRows } from "./PracticeRows";

// Every line is a claim gated in brand.claims (src/config/brand.ts), which is what {{CONFIRM}} means
// here: a production deploy fails until the owner confirms each one, and setting a claim to false
// removes its line from the page rather than softening the wording.
//
// One icon per practice rather than the same shield five times. Five identical marks carry no
// information and read as decoration beside the words; a key beside the line about your login and a
// sign-out beside the line about access ending both say something the sentence then confirms. All
// from Phosphor at the same weight, which is the site's one icon family.
const PRACTICES = [
  { on: brand.claims.vetted, Icon: ShieldCheckIcon, title: "Vetted engineers", text: "The person working on your site has been checked before they get near it." },
  { on: brand.claims.fixedPrice, Icon: HandshakeIcon, title: "Nothing starts without your yes", text: "You approve a fixed price before any work begins." },
  { on: brand.claims.backupFirst, Icon: HardDrivesIcon, title: "A backup before any change", text: "Files and database are copied before we touch anything." },
  { on: brand.claims.ownLogin, Icon: KeyIcon, title: "Your login stays yours", text: "We work through an account you create for us, and never ask for your password." },
  { on: brand.claims.accessRemoved, Icon: SignOutIcon, title: "Access ends with the job", text: "When the work is done, our account comes off your site." },
].filter((p) => p.on);

/**
 * The house heading, like every other section on this page. It used to run at half the size and a
 * lighter weight, to stay quiet after the guarantee above it. That held while the guarantee was the
 * same kind of heading only bigger; now that it is drawn letterforms in SVG, the contrast is already
 * there in kind, and a 24px heading among six 48px ones reads as unfinished rather than restrained.
 * The quiet in this section is its content: no image, no card, no call to action.
 */
export function Practices() {
  if (!PRACTICES.length) return null;
  return (
    // max-w-6xl and the full section rhythm, like every other section: this one was the only block
    // narrowed to max-w-4xl, which pushed its left edge 128px inside the heading above and the one
    // below it. DESIGN.md's rule is that measure is capped on the text, never by shrinking the
    // container, so the copy carries its own ch cap below and the spine stays put.
    <section aria-labelledby="practices" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <h2
        id="practices"
        className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
      >
        How we work on your site
      </h2>

      {/* Divided rows, not a two-column grid of five. Five items in two columns leaves an empty
          sixth cell at the bottom right, which is a planning error rather than whitespace, and the
          two short columns hugged the left half under a heading that ran the full width. Rows carry
          the promise on the left and its one sentence on the right, so each line reads across the
          whole spine and the five read as one set. Hairlines do the grouping; the taste skill keeps
          cards for real elevation, and there is none here.

          PracticeRows owns the <ul> and each <li>, because the arrival and the hover need a client
          island; the words and the icons stay here, on the server. */}
      <PracticeRows>
        {PRACTICES.map(({ Icon, title, text }) => (
          <Fragment key={title}>
            <Icon weight="duotone" className="mt-[0.2em] size-5 shrink-0 text-accent-text" aria-hidden />
            {/* 17px against the 15px sentence beside it: the two used to share a size and were told
                apart by weight alone, which is not a hierarchy at this heading scale. */}
            <span className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">{title}</span>
            <span className="col-start-2 max-w-[58ch] text-[15px] leading-relaxed text-muted md:col-start-3">{text}</span>
          </Fragment>
        ))}
      </PracticeRows>
    </section>
  );
}
