import { practiceIcons } from "@/components/templates/parts";
import { securityPractice } from "@/content/notices";

/** v3 home: grouped icon list, two columns per group, one soft divider between groups. */
export function Security() {
  return (
    <section aria-labelledby="security" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <p className="text-sm font-semibold text-accent-text">Security</p>
      <h2 id="security" className="mt-2 max-w-[20ch] font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        Your site and data, handled carefully
      </h2>
      <div className="mt-10 divide-y divide-line">
        {securityPractice.map((g) => (
          <div key={g.group} className="grid gap-6 py-8 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-8">
            <h3 className="font-display text-xl font-bold md:col-span-3">
              {g.group}
            </h3>
            <ul className="grid gap-6 sm:grid-cols-2 md:col-span-9 md:gap-8">
              {g.items.map((it) => {
                const I = practiceIcons[it.id];
                return (
                  <li key={it.id} className="flex gap-4">
                    <I weight="duotone" className="size-7 shrink-0 text-accent-text" aria-hidden />
                    <span>
                      <span className="block font-semibold">{it.title}</span>
                      <span className="mt-1 block text-muted">{it.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
