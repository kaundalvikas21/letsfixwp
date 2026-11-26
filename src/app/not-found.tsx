import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { LogoReveal } from "@/components/motion/interactions/LogoReveal";
import { h1, page, pageY, prose } from "@/components/templates/parts";

/**
 * The 404. Next serves this for a thrown `notFound()` and for every URL that matches no route.
 *
 * There was no such page before Task 102: an unmatched URL fell through to Next's own, which is a bare
 * line of system type on a white page. On a site whose subject is broken WordPress, the one page a
 * visitor reaches by accident was the one page that looked unfinished.
 *
 * It says what is true, which is also the offer: a page here is broken, and broken pages are the work.
 * The mark forms out of glass above it. `LogoReveal` has the reasoning for why the only moving thing on
 * the site outside the home page is here.
 *
 * No metadata beyond the title: Next already sends `noindex` with a 404 status, so the page does not
 * need to ask.
 */
export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className={`${page} ${pageY}`}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        {/* Capped, because the reveal is square and fills its box: at full column width on a phone it
            would be the whole first screen and the headline would start below the fold. */}
        <div className="w-full max-w-[240px]">
          <LogoReveal />
        </div>
        <h1 className={`${h1} mt-8`}>This page is broken</h1>
        <p className={`${prose} mt-5 text-pretty`}>
          The address does not match anything on the site. If you followed a link here, it is on us, and fixing broken pages
          happens to be the job.
        </p>
        {/* The hero's pair and its reasoning: stacked and full width on a phone, a row from sm up,
            because two content-width buttons on their own lines read as a ragged edge. `w-full` is
            safe on both utilities, which are inline-flex boxes that centre their own label and chip.
            `justify-center` because this column is centred and the hero's is not. */}
        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <BookLink location="404" className="btn-primary w-full sm:w-auto" />
          <ChatButton location="404" className="btn-secondary w-full sm:w-auto" />
        </div>
      </div>
    </div>
  );
}
