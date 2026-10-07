import { ChatButton } from "@/components/Cta";
import { faqLd, JsonLd } from "@/components/JsonLd";
import { brand } from "@/config/brand";
import { objections } from "@/content/objections";
import { FaqAccordion, type FaqItem } from "./FaqAccordion";

/**
 * V1.11. Layout family: single-column accordion (max-w 760px) with a sticky side card at lg.
 * Under 1024px the card follows the list. Emits FAQPage JSON-LD for the same six answers.
 */
export function ObjectionFaq() {
  const items: FaqItem[] = objections.map((o) => ({ q: o.q, a: o.a, pending: o.claim ? !brand.claims[o.claim] : false }));

  return (
    <section aria-labelledby="faq-title" className="border-t border-line py-20 md:py-28">
      <JsonLd data={faqLd(items.map((it) => ({ q: it.q, a: it.pending ? `${it.a} {{CONFIRM}}` : it.a })))} />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 id="faq-title" className="text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-text">
          Questions before you book
        </h2>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,760px)_1fr] lg:gap-16">
          <FaqAccordion items={items} />
          <aside aria-labelledby="still-deciding" className="self-start rounded-card border border-line bg-surface p-6 shadow-card lg:sticky lg:top-24">
            <h3 id="still-deciding" className="text-xl font-semibold tracking-tight text-text">
              Still deciding?
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">Describe the problem and an engineer tells you what it likely is.</p>
            <ChatButton location="faq:side-card" className="mt-6 w-full" />
          </aside>
        </div>
      </div>
    </section>
  );
}
