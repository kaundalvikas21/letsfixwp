import Link from "next/link";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

// Layout family: definition list in two columns. Real dl/dt/dd; each pair is a div so it can be a
// grid cell, which HTML5 allows inside a dl.
//
// Every claim is a registered brand promise, so each one fails a production build until the owner
// signs it off. A pair whose value is null renders nothing at all (contract rule 8). That is why
// the guarantee pair is absent today: brand.promises.guaranteeDays is null, which also keeps the
// link to /legal/guarantee/ off the page, since that route 404s until a guarantee exists.

const { access, backupFirst, backupRetentionDays, staging, reporting, guaranteeDays } = brand.promises;

type Pair = { term: string; body: React.ReactNode };

const maybe: (Pair | null)[] = [
  access ? { term: "Access", body: access } : null,
  backupFirst
    ? {
        term: "Backups",
        body: `A backup of files and database is taken ${backupFirst}.${
          backupRetentionDays === null ? "" : ` Copies are kept for ${backupRetentionDays} days.`
        }`,
      }
    : null,
  staging ? { term: "Changes", body: staging } : null,
  reporting ? { term: "Reporting", body: reporting } : null,
  guaranteeDays === null
    ? null
    : {
        term: "Guarantee",
        body: (
          <>
            Every fix carries a {guaranteeDays} day guarantee.{" "}
            <Link href={routes.legal.guarantee} className="border-b border-muted hover:border-text">
              Read the terms
            </Link>
            .
          </>
        ),
      },
];

const pairs = maybe.filter((p): p is Pair => p !== null);

export function Safeguards() {
  return (
    <section aria-label="How we work on your site" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">Your site is safe with us</p>

        <dl className="mt-10 grid grid-cols-1 gap-x-16 gap-y-px md:grid-cols-2">
          {pairs.map((p) => (
            <div key={p.term} className="border-t border-line py-5">
              <dt className="font-bold">{p.term}</dt>
              <dd className="mt-2 max-w-[48ch] text-muted">{p.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
