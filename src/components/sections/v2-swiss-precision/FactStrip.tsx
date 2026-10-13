import { brand } from "@/config/brand";

// Layout family: 4-column fact strip, one top border, no cards, no icons. 2x2 below 768px.
// The hero above draws no bottom border: this strip's top border is that line, kept to one rule.
// Every fact is a confirmed brand promise. An unconfirmed one is null in src/config/brand.ts and
// renders nothing (contract rule 8), so the strip states only what the business can stand behind.

const { guaranteeDays, fixedPrice, backupFirst, specialistSince } = brand.promises;

type Fact = { head: string; note: string | null };

const facts: Fact[] = [
  guaranteeDays === null ? null : { head: `${guaranteeDays}-day guarantee`, note: "on every fix" },
  { head: "Fixed price", note: fixedPrice },
  { head: "Backup first", note: backupFirst },
  { head: "WordPress specialists", note: specialistSince === null ? null : `since ${specialistSince}` },
].filter((f): f is Fact => f !== null);

export function FactStrip() {
  return (
    <div className="border-t border-line">
      <ul className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 md:grid-cols-4 md:py-12">
        {facts.map((f) => (
          <li key={f.head}>
            <p className="font-medium">{f.head}</p>
            {f.note && <p className="mt-1 text-sm text-muted">{f.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
