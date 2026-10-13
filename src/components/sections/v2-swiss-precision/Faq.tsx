import { ChatButton } from "@/components/Cta";
import { JsonLd, faqLd } from "@/components/JsonLd";
import { brand } from "@/config/brand";

// Layout family: two-column FAQ. The left column earns the split by holding an interactive element
// (taste 4.7), not just a heading. Right column is a native disclosure group: no dependency, no
// client JavaScript, and the whole section stays a Server Component so the FAQPage JSON-LD is
// generated from exactly the same array the page renders.
//
// Every answer is a registered brand promise, so the six objections fail a production build until
// the owner signs them off. A null promise drops its question entirely (contract rule 8).

const { whenStarts, access, unfixable, backupFirst, backupRetentionDays, staging, hosts, payment } = brand.promises;

const dataSafety = [
  backupFirst ? `A backup of files and database is taken ${backupFirst}.` : null,
  backupRetentionDays === null ? null : `Copies are kept for ${backupRetentionDays} days.`,
  staging,
]
  .filter(Boolean)
  .join(" ");

// Some promises are written for a table cell (no full stop) and reused here as prose.
const sentence = (t: string) => (/[.!?]$/.test(t.trim()) ? t.trim() : `${t.trim()}.`);

const maybe: ({ q: string; a: string } | null)[] = [
  whenStarts ? { q: "When does work start?", a: sentence(whenStarts) } : null,
  access ? { q: "Do I have to hand over my passwords?", a: sentence(access) } : null,
  unfixable ? { q: "What if you cannot fix it?", a: sentence(unfixable) } : null,
  dataSafety ? { q: "Is my data safe while you work?", a: sentence(dataSafety) } : null,
  hosts ? { q: "Do you work with my host?", a: sentence(hosts) } : null,
  payment ? { q: "When do I pay?", a: sentence(payment) } : null,
];

const faqs = maybe.filter((f): f is { q: string; a: string } => f !== null);

export function Faq() {
  return (
    <section aria-labelledby="faq" className="border-t border-line">
      <JsonLd data={faqLd(faqs)} />
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:gap-6 md:py-24">
        <div className="md:col-span-4">
          <h2 id="faq" className="max-w-[16ch] text-[clamp(1.75rem,3vw,2.5rem)]">
            Questions before you book
          </h2>
          <ChatButton location="home:faq" className="btn-secondary mt-8" />
        </div>

        <div className="md:col-span-7 md:col-start-6">
          {faqs.map((f) => (
            <details key={f.q} className="group border-t border-line last:border-b last:border-b-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="shrink-0 font-mono text-muted group-open:hidden">
                  +
                </span>
                <span aria-hidden className="hidden shrink-0 font-mono text-muted group-open:inline">
                  &minus;
                </span>
              </summary>
              <p className="max-w-[60ch] pb-5 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
