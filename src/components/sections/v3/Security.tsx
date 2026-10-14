import { CheckCircleIcon, ClipboardTextIcon, CloudArrowUpIcon, DatabaseIcon, KeyIcon, UserMinusIcon } from "@phosphor-icons/react/ssr";

// Each item is either content the owner already published (a deliverable) or a claim gated in brand.claims, which
// fails a production deploy until confirmed. Source noted per item.
const GROUPS: { name: string; items: { icon: typeof KeyIcon; title: string; text: string }[] }[] = [
  {
    name: "Access",
    items: [
      // brand.claims.ownLogin
      { icon: KeyIcon, title: "Your login stays yours", text: "We work through an account you create for us. We never ask for your password." },
      // brand.claims.accessRemoved
      { icon: UserMinusIcon, title: "Access ends with the job", text: "When the work is done, our account is removed from your site." },
    ],
  },
  {
    name: "Data",
    items: [
      // brand.claims.backupFirst
      { icon: DatabaseIcon, title: "A backup before any change", text: "Files and database are backed up before we touch anything." },
      // care-plans.ts deliverable
      { icon: CloudArrowUpIcon, title: "Backups kept off your server", text: "On care plans, backups are stored away from your host, with tested restores." },
    ],
  },
  {
    name: "Accountability",
    items: [
      // brand.claims.fixedPrice ("agreed before work starts")
      { icon: CheckCircleIcon, title: "Nothing starts without your yes", text: "You approve the price before any work begins." },
      // emergency.ts and critical-error.ts deliverable
      { icon: ClipboardTextIcon, title: "A written note of every change", text: "You get a plain note of what broke and what we changed." },
    ],
  },
];

/** v3 home: grouped icon list, two columns per group, one soft divider between groups. */
export function Security() {
  return (
    <section aria-labelledby="security" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <p className="text-sm font-semibold text-accent-text">Security</p>
      <h2 id="security" className="mt-2 max-w-[20ch] font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        Your site and data, handled carefully
      </h2>
      <div className="mt-10 divide-y divide-line">
        {GROUPS.map((g) => (
          <div key={g.name} className="grid gap-6 py-8 first:pt-0 last:pb-0 md:grid-cols-12 md:gap-8">
            <h3 className="font-display text-xl font-bold md:col-span-3">
              {g.name}
            </h3>
            <ul className="grid gap-6 sm:grid-cols-2 md:col-span-9 md:gap-8">
              {g.items.map(({ icon: I, title, text }) => (
                <li key={title} className="flex gap-4">
                  <I weight="duotone" className="size-7 shrink-0 text-accent-text" aria-hidden />
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="mt-1 block text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
