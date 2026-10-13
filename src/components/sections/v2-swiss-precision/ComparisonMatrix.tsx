import { CheckIcon, MinusIcon } from "@phosphor-icons/react/ssr";
import { BookLink } from "@/components/Cta";
import { brand } from "@/config/brand";

// Layout family: comparison matrix (ui-ux-pro-max `comparison-table-focus`, adapted in
// design-system/letsfixwp-v2/MASTER.md override 20). A real table: caption, th scope, visible header
// row. Our column is marked structurally (3px --accent top rule, --surface fill) AND by the brand
// name in its header, so the distinction never rests on colour alone.
//
// Every claim in our column comes from brand.promises, so each one fails a production build until
// the owner signs it off. Nothing here names a competitor: the other three columns are categories,
// and their cells are hedged on purpose because we cannot evidence what a third party will do.

const { whoWorks, whenStarts, fixedPrice, backupFirst, guaranteeDays } = brand.promises;

const COLUMNS = [brand.name, "Freelance marketplace", "Your host's support", "Doing it yourself"];

type Cell = { mark?: "yes" | "partial"; text?: string };
type Row = { label: string; cells: [Cell, Cell, Cell, Cell] };

const rows: Row[] = [
  {
    label: "Who works on it",
    cells: [
      { text: whoWorks },
      { text: "Varies by freelancer" },
      { text: "Whoever picks up the ticket" },
      { text: "You" },
    ],
  },
  {
    label: "When work starts",
    cells: [
      { text: whenStarts },
      { text: "After bids and a brief" },
      { text: "When the queue reaches you" },
      { text: "When you have time" },
    ],
  },
  {
    label: "Price agreed upfront",
    cells: [
      fixedPrice ? { mark: "yes" } : { mark: "partial" },
      { mark: "partial", text: "Varies by freelancer" },
      { mark: "partial", text: "Support is bundled, fixes are quoted separately" },
      { mark: "partial", text: "Your own time instead" },
    ],
  },
  {
    label: "Backup before changes",
    cells: [
      backupFirst ? { mark: "yes" } : { mark: "partial" },
      { mark: "partial", text: "Varies by freelancer" },
      { mark: "partial", text: "Depends on the plan" },
      { mark: "partial", text: "Up to you to remember" },
    ],
  },
  // The guarantee row appears once brand.promises.guaranteeDays is set (contract rule 8). Until
  // then there is no guarantee to compare, and an empty cell in our own column would read as a no.
  ...(guaranteeDays === null
    ? []
    : [
        {
          label: "Guarantee after the fix",
          cells: [
            { mark: "yes", text: `${guaranteeDays} days` },
            { mark: "partial", text: "Varies by freelancer" },
            { mark: "partial", text: "Depends on the plan" },
            { mark: "partial", text: "None" },
          ],
        } satisfies Row,
      ]),
];

function Mark({ mark }: { mark: "yes" | "partial" }) {
  const Icon = mark === "yes" ? CheckIcon : MinusIcon;
  return (
    <>
      <Icon aria-hidden size={18} weight="bold" className={mark === "yes" ? "text-accent-text" : "text-muted"} />
      <span className="sr-only">{mark === "yes" ? "Yes" : "Not guaranteed"}</span>
    </>
  );
}

const ours = "bg-surface";

export function ComparisonMatrix() {
  return (
    <section aria-labelledby="compare" className="border-t border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <h2 id="compare" className="max-w-[20ch] text-[clamp(1.75rem,3vw,2.5rem)]">
          Why owners call us instead.
        </h2>

        {/*
          Only this wrapper scrolls sideways. Keyboard reachable with an accessible name.
          contain:paint confines the wide table to this box. Without it an auto-layout table leaks
          its min-content width to the root scroll area and the whole PAGE scrolls sideways, even
          though this wrapper clips correctly. Measured at 375px: document scrollWidth 715 -> 375.
        */}
        <div
          role="region"
          aria-label="Comparison of ways to get a WordPress site fixed"
          tabIndex={0}
          className="mt-10 overflow-x-auto [contain:paint]"
        >
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <caption className="sr-only">
              How {brand.name} compares with a freelance marketplace, a host&rsquo;s support desk, and doing it
              yourself.
            </caption>
            <thead>
              <tr>
                <td className="sticky left-0 z-10 bg-bg" />
                {COLUMNS.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`border-b border-muted p-4 align-bottom font-medium ${
                      i === 0 ? `${ours} border-t-[3px] border-t-accent` : ""
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-line bg-bg py-4 pr-6 align-top font-medium"
                  >
                    {r.label}
                  </th>
                  {r.cells.map((cell, i) => (
                    <td
                      key={COLUMNS[i]}
                      className={`border-b border-line p-4 align-top text-[0.9375rem] ${i === 0 ? ours : "text-muted"}`}
                    >
                      <span className="flex items-start gap-2">
                        {cell.mark && <Mark mark={cell.mark} />}
                        {cell.text}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10">
          <BookLink location="home:compare" className="btn-primary" />
        </p>
      </div>
    </section>
  );
}
