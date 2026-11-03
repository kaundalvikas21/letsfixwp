import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { routes } from "@/config/routes";
import { testimonials } from "@/content/testimonials";
import { QuoteCarousel } from "@/components/motion/interactions/QuoteCarousel";
import { videoCaption, VideoSlotBox } from "@/components/VideoFrame";

/**
 * What clients say: four stories, one card per view.
 *
 * The quotes come from src/content/testimonials.ts, which holds placeholders marked as such on the
 * page; a production deploy fails while any remain. The two quotes the original brief named belong to
 * a different, still trading company and were removed from the content on 2026-10-07, so they are not
 * on this page and must not come back.
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
 * The video frames are rendered here, on the server, and handed to the client island as nodes, so
 * nothing in src/content/videos.ts reaches the bundle. Why the carousel does not autoplay, and why it
 * is not the same layout family as the fix rail, are both argued under Task 54.
 */
export function ClientStories() {
  return (
    <section aria-labelledby="client-stories" className="reveal mx-auto max-w-page px-4 py-16 md:px-6 md:py-24">
      <h2
        id="client-stories"
        className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
      >
        What clients say
      </h2>

      <QuoteCarousel
        label="Client stories"
        // The box without the frame around it, and the caption as a plain paragraph. A quote card is
        // already a `figure`, whose caption is the attribution; nesting `VideoFrame`'s own `figure`
        // and `figcaption` inside it gave one card two captions and two figure roles. Nested figures
        // are valid HTML, but here the video is part of the testimonial rather than a figure in its
        // own right, so a div is the honest element. The sentence still comes from one place.
        quotes={testimonials.map((t) => ({
          ...t,
          media: (
            <div>
              <VideoSlotBox id={t.video} />
              <p className="mt-3 text-sm text-muted">{videoCaption(t.video)}</p>
            </div>
          ),
        }))}
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
