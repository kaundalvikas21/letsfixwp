import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { routes } from "@/config/routes";
import { ClipWall, teaserClients } from "@/components/sections/v4/ClientClips";

/**
 * What clients say: four clients, four frames, swiped on a phone and all four at once from 768 up.
 *
 * The quotes come from src/content/testimonials.ts, which holds placeholders; a production deploy
 * fails while any remain. The two quotes the original brief named belong to a different, still trading
 * company and were removed from the content on 2026-10-07, so they are not on this page and must not
 * come back.
 *
 * **This was half of a section called "We repair sites running on"**, which gave the page's entire
 * client-proof block an accessible name describing a list of platforms, and left it with no visible
 * heading at all: that section's h2 was 16px and --muted, the only one on the page not set in the
 * 30px display face. It is its own section now, with the house heading. Task 55 in the ledger.
 *
 * **It sits after the plans and the guarantee on purpose.** It used to sit between the problem list
 * and the restored-site capture, which is a narrative gap with no call to action within a screen. A
 * client story answers "did this work for someone like me", and that is the doubt a visitor has while
 * they are looking at what it costs and what happens if it goes wrong, not while they are still
 * working out which problem is theirs.
 *
 * **It was a paged carousel until Task 80.** A window showed one client and asked for a press to see
 * that a second existed; four frames say "four people did this" before anything is clicked, which is
 * the job of the section. That also dropped the page's last paging control and the client island
 * behind it, and made this the same section the pricing and case study pages carry, which is what
 * someone moving between those pages should find.
 *
 * **Task 81 gave it back a sideways move, but only on a phone.** `ClipWall` is a swipe rail below 768
 * and a row of four above it, in CSS, with no island. The argument is in that component.
 *
 * The excerpt no longer appears here. Contract rule 14 caps a quote at three lines and forbids cutting
 * one, and 90 characters in a 252px column is five or six; the words live on the service pages where
 * the column is wide enough. The clip is the testimonial here and the caption is its text alternative.
 */
export function ClientStories() {
  return (
    <section aria-labelledby="client-stories" className="mx-auto max-w-page px-4 py-16 md:px-6 md:py-24">
      <h2
        id="client-stories"
        className="reveal-self font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
      >
        What clients say
      </h2>

      {/* The same wall the pricing and case study pages draw, from one definition. It used to be a
          second copy of the same grid classes here, which is how two grids drift apart. The heading
          animates itself and the list animates its children, so they stay on separate ancestor
          chains. */}
      <ClipWall
        clients={teaserClients}
        className="mt-12"
        // The link used to sit on its own line under the rail. It is the left half of the control row
        // now, with the paging on the right, which is where the owner asked for the paging to be and
        // spends one line of height instead of two.
        action={
          <Link href={routes.reviews} className="group inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text">
            Read the case studies
            <ArrowUpRightIcon weight="duotone" className="size-5 transition-[translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:translate-none!" aria-hidden />
          </Link>
        }
      />
    </section>
  );
}
