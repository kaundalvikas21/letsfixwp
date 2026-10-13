import { brand } from "@/config/brand";

// Layout family: horizontal verb row. Four verbs at text-4xl, one 1px rule above all four,
// no numbers and no icons. Below 768px the same four become a vertical list, verb on the left.
// Approve and Repair quote brand.promises, so the claims this section makes are the ones already
// registered in src/config/brand.ts and gated by the same production check. Describe and Confirm
// are procedural and promise nothing.

const steps = [
  {
    verb: "Describe",
    body: `Paste your site address and tell us what you see. The exact error text helps most.`,
  },
  {
    verb: "Approve",
    body: `A fixed price, ${brand.promises.fixedPrice}. Nothing is touched until you approve it.`,
  },
  {
    verb: "Repair",
    body: `A backup is taken ${brand.promises.backupFirst}. Then an engineer works the fix on your site.`,
  },
  {
    verb: "Confirm",
    body: `You open the site and check it yourself. The job closes when you say it is fixed.`,
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <h2 id="how" className="text-[clamp(1.75rem,3vw,2.5rem)]">How it works</h2>

        {/* The single rule above all four. Ordered for sequence; nothing numbers them on screen. */}
        <ol className="mt-10 grid list-none grid-cols-1 gap-x-6 gap-y-8 border-t border-line pt-10 md:grid-cols-4">
          {steps.map((s) => (
            <li key={s.verb} className="flex gap-5 md:block">
              <span className="w-28 shrink-0 text-2xl leading-none font-bold tracking-[-0.03em] md:w-auto md:text-4xl">
                {s.verb}
              </span>
              <p className="max-w-[34ch] text-muted md:mt-4">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
