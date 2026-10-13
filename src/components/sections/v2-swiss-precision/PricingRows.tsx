import { BookLink, PlansLink } from "@/components/Cta";
import { brand } from "@/config/brand";
import { getService } from "@/content";

// Layout family: horizontal pricing rows, never cards. One full-width row per tier, split into
// name, who it is for, price, turnaround and the CTA, with a native disclosure under each row for
// the inclusions. Rows are separated by a single --line border between them (divide-y), so no row
// is boxed. The whole section is a Server Component: <details> needs no JavaScript at all.
//
// Every figure comes from src/content/services/<id>.ts (contract rule 8). A null renders nothing,
// except the price, which falls back to the quote promise already registered in brand.ts.

const TIERS = ["emergency", "malware-removal", "care-plans"] as const;

const rows = TIERS.map((id) => {
  const s = getService(id);
  if (!s) throw new Error(`PricingRows: unknown service "${id}"`);
  return s;
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1">{children}</p>
    </div>
  );
}

export function PricingRows() {
  return (
    <section aria-labelledby="pricing" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <h2 id="pricing" className="max-w-[20ch] text-[clamp(1.75rem,3vw,2.5rem)]">
          What a fix costs.
        </h2>

        <div className="mt-10 divide-y divide-line">
          {rows.map((s) => {
            const isPlan = s.intent === "plan";
            const includedFix = isPlan ? brand.promises.carePlanIncludedFix : null;
            return (
              <div key={s.id} className="py-8 first:pt-0">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
                  <h3 className="font-bold md:col-span-3">{s.title}</h3>

                  <div className="md:col-span-3">
                    <Field label="Who it is for">
                      <span className="text-muted">{s.whoItsFor}</span>
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Price">
                      {s.priceFrom ? (
                        <span className="font-mono">{s.priceFrom}</span>
                      ) : (
                        <span className="text-muted">On quote</span>
                      )}
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    {s.typicalTurnaround && (
                      <Field label="Turnaround">
                        <span className="font-mono">{s.typicalTurnaround}</span>
                      </Field>
                    )}
                  </div>

                  <div className="md:col-span-2 md:justify-self-end">
                    {isPlan ? (
                      <PlansLink location="home:pricing" service={s.id} className="btn-primary w-full md:w-auto" />
                    ) : (
                      <BookLink location="home:pricing" service={s.id} className="btn-primary w-full md:w-auto" />
                    )}
                  </div>
                </div>

                {includedFix && <p className="mt-4 text-muted">Includes {includedFix}.</p>}

                <details className="group mt-4">
                  <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    <span className="border-b border-muted group-open:border-text">What is included</span>
                  </summary>
                  <ul className="mt-3 grid gap-px sm:grid-cols-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="border-t border-line py-2 text-[0.9375rem] text-muted">
                        {d}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
