import { faqLd, JsonLd } from "@/components/JsonLd";
import { getService } from "@/content";
import { FaqTabs, type FaqGroup } from "./FaqTabs";

// Six questions the service pages already answer, referenced by service and exact wording rather than
// copied: if a question is reworded in the content file, the build fails here instead of the two
// drifting apart. Two per category, in the order a customer meets them.
// The id is the tab value: Radix builds its aria-controls id from it, so it must be a valid IDREF.
const REFS: { id: string; name: string; items: [service: string, question: string][] }[] = [
  {
    id: "before-booking",
    name: "Before booking",
    items: [
      ["emergency", "What access do you need?"],
      ["care-plans", "Is a care plan better than paying per job?"],
    ],
  },
  {
    id: "during-the-fix",
    name: "During the fix",
    items: [
      ["critical-error", "Will I lose content?"],
      ["woocommerce-fixes", "Will you take my store offline to fix it?"],
    ],
  },
  {
    id: "after-the-fix",
    name: "After the fix",
    items: [
      ["malware-removal", "Why does the malware keep coming back?"],
      ["blacklist-removal", "Will my search rankings come back?"],
    ],
  },
];

const groups: FaqGroup[] = REFS.map((g) => ({
  id: g.id,
  name: g.name,
  faqs: g.items.map(([id, q]) => {
    const found = getService(id)?.faqs.find((f) => f.q === q);
    if (!found) throw new Error(`Faq: service "${id}" no longer has the question "${q}"`);
    return found;
  }),
}));

/**
 * The same six questions carry the FAQPage JSON-LD, whichever tab is open.
 *
 * max-w-6xl, like every other section: this block was the last one left at max-w-4xl, which put its
 * heading 128px inboard of the heading above it and the closing statement below it.
 */
export function Faq() {
  return (
    <>
      {/* Outside the section rather than first inside it. The original reason was the stagger: a
          display:none script holding slot one put the heading a beat behind the only two things on
          screen. There is no stagger any more, and the reason it stays out is now the observer: a
          `display: none` child of a `reveal` container is watched and never intersects, so it sits
          in the observer for the life of the page without ever animating. */}
      <JsonLd data={faqLd(groups.flatMap((g) => g.faqs))} />
      <section aria-labelledby="faq" className="reveal mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <h2
          id="faq"
          className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
        >
          Questions people ask first
        </h2>
        <FaqTabs groups={groups} />
      </section>
    </>
  );
}
