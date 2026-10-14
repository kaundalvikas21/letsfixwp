import dynamic from "next/dynamic";
import { faqLd, JsonLd } from "@/components/JsonLd";
import { getService } from "@/content";
import type { Faq as FaqItem } from "./FaqAccordion";

const FaqAccordion = dynamic(() => import("./FaqAccordion").then((m) => m.FaqAccordion));

// Six standard objections, each taken from the service page that already answers it. Referenced, not copied:
// if the wording changes in the content file, the build fails here instead of the two drifting apart.
const REFS: [service: string, question: string][] = [
  ["critical-error", "Will I lose content?"],
  ["emergency", "What access do you need?"],
  ["malware-removal", "Can I just restore an old backup?"],
  ["site-recovery", "Can you recover a site with no backup?"],
  ["care-plans", "Do I need to move my hosting to join a plan?"],
  ["care-plans", "Is a care plan better than paying per job?"],
];

const faqs: FaqItem[] = REFS.map(([id, q]) => {
  const found = getService(id)?.faqs.find((f) => f.q === q);
  if (!found) throw new Error(`Faq: service "${id}" no longer has the question "${q}"`);
  return found;
});

/** v3 home: searchable accordion of standard objections, inside a card. FAQPage JSON-LD for the same six. */
export function Faq() {
  return (
    <section aria-labelledby="faq" className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:py-24">
      <JsonLd data={faqLd(faqs)} />
      <h2 id="faq" className="font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        Questions people ask first
      </h2>
      <div className="mt-10">
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}
