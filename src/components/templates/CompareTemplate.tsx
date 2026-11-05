import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { compareLd, JsonLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import { criterionIcon } from "@/content/icons";
import type { Compare } from "@/content/schema";
import { cn } from "@/lib/utils";
import { ClosingBand, PageMasthead, Section, page, pageYMasthead } from "./parts";

/**
 * /compare/<slug>/. Layout family: verdict-by-scenario cards over a real comparison table. Factual and neutral:
 * no winner is declared, because which one fits depends on the scenario.
 */
export function CompareTemplate({ compare: c }: { compare: Compare }) {
  const title = `${c.a} vs ${c.b}`;
  const intent = primaryCtaFor(nodeByPath.get(routes.compares)?.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  const loc = `compare:${c.slug}`;
  // Three delimited columns rather than three runs of text: a hairline closes the criterion column
  // and opens the second side, so an eye crossing a 1152px row always knows which of the two it is
  // reading. The criterion cell is also the sticky one, which is why it carries its own opaque
  // `--surface`: under 768 the table scrolls sideways and the column it scrolls away from is the
  // only one that says what the row is about.
  const th = "border-b border-line-strong px-4 py-3 text-left font-display text-sm font-bold";
  // Sticky only where the table actually scrolls. `min-w-[40rem]` fits from about 690px up, so above
  // `md` the cell cannot move and the only thing `position: sticky` buys is a positioned element:
  // axe then reports every cell in the next column as "partially obscured" and returns `incomplete`
  // on it rather than a contrast ratio, which silently drops nine cells per page out of coverage on
  // the width the check is usually run at. Scoped to `max-md`, 1440 measures clean again and the
  // phone, where the cell does its job, is measured by compositing instead.
  const thCriterion = cn(th, "border-r border-line bg-surface max-md:sticky max-md:left-0 max-md:z-10");
  const td = "border-b border-line px-4 py-4 align-top text-sm";
  // `text-left` explicitly: `td` never set an alignment and a `<th>` defaults to `center`, so every
  // row header in this table has been centred inside its column, which on a wrapped two-line title
  // put the second line somewhere other than where the eye expects to resume. Caught at 375, where
  // the column is narrowest and every title wraps.
  const tdCriterion = cn(td, "border-r border-line bg-surface text-left font-semibold max-md:sticky max-md:left-0");
  const tdB = cn(td, "border-l border-line text-muted");

  return (
    <article className={cn(page, pageYMasthead)}>
      <JsonLd data={compareLd(c)} />

      {/* This page had no picture at all, because the catalogue holds no honest frame of two
          technologies being weighed against each other and inventing one was never an option. A
          comparison is a neutral document, so it takes the catalogue's neutral frame: `cables`, a
          patch panel in black and white, which is mono and therefore the one tone that cannot imply
          a verdict. Logged in docs/image-todo.md as a stand-in with the direction its real
          photograph has to satisfy. */}
      <PageMasthead
        crumbs={[
          { name: "Home", path: routes.home },
          { name: "Comparisons", path: routes.compares },
          { name: title, path: routes.compare(c.slug) },
        ]}
        photo="cables"
        // The two names at full weight with the word between them quieter and smaller, which is the
        // shape /compare/ gives every pairing in its index. The accessible name is unchanged, since
        // `vs` is real text inside the h1 rather than a glyph or a pseudo-element, and it stays on
        // `--text` rather than dropping to `--muted`: this heading composites against a photograph
        // under `--photo-scrim`, and muted type over a picture is the measurement that has caught
        // this site out before.
        title={
          <>
            {c.a}
            <span className="mx-[0.3em] align-baseline text-[0.44em] font-normal tracking-normal">vs</span>
            {c.b}
          </>
        }
        lead={c.seo.description}
        actions={
          <>
            <Primary location={`${loc}:hero`} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} className="btn-secondary" />
          </>
        }
      />

      {/* Two up, not three. Four of these pages carry four or five scenarios and `md:grid-cols-3`
          made the first row literally the three equal cards in a row that contract rule 6 names,
          with the remainder orphaned beside a hole. Two columns also buys each scenario about 90
          more pixels of line, which is what stopped the headings wrapping to three lines.

          No hover on the card: it is a panel, not a link, and the Hover Earns It rule holds. The
          ember rule above each scenario is the closing band's mark, reused: it gives five
          near-identical blocks a start edge to find. */}
      <Section id="verdict" title="Which one fits">
        <ul className="reveal grid gap-4 md:grid-cols-2">
          {c.verdictByScenario.map((v) => (
            <li key={v.scenario} className="rounded-[14px] border border-line bg-surface p-5 shadow-card md:p-6">
              <span aria-hidden className="block h-px w-8 bg-accent" />
              <p className="mt-4 font-display text-[1.0625rem] leading-snug font-bold [font-variation-settings:'opsz'_17]">{v.scenario}</p>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{v.verdict}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="table" title="Side by side">
        {/* The table scrolls sideways under 768, so the scroll container needs a tab stop of its own
            or a keyboard visitor cannot reach the second half of it (axe scrollable-region-focusable,
            serious, which this page was failing at 375). Named and given a role for the same reason
            the fix rail on the home page is. */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${c.a} compared with ${c.b}`}
          className="reveal-self overflow-x-auto rounded-[14px] border border-line bg-surface shadow-card"
        >
          <table className="w-full min-w-[40rem] border-collapse">
            {/* Fixed proportions rather than content-driven ones. Left to itself the criterion
                column collapsed to about 110px and broke every title over two or three lines
                while the two value columns, which hold five times the text, took the rest. */}
            {/* `caption` must be the table's first child; `colgroup` follows it. The two were the
                other way round, which is invalid even though no parser repairs it. */}
            <caption className="sr-only">
              {c.a} compared with {c.b}
            </caption>
            <colgroup>
              <col className="w-[24%]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className={thCriterion}>
                  Criterion
                </th>
                <th scope="col" className={th}>
                  {c.a}
                </th>
                <th scope="col" className={cn(th, "border-l border-line")}>
                  {c.b}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* The row tint is a reading aid, not an affordance: nine rows a thousand pixels wide
                  are read across, and the one thing a pointer can do for that is mark which row the
                  eye is on. It is set on the cells rather than the row so the sticky criterion
                  cell, which carries its own opaque background, tints with the rest of them. */}
              {c.rows.map((r) => {
                // Keyed off the criterion string in `src/content/icons.ts`, never chosen here: six
                // of the 21 criteria appear in two comparisons, and the map is what keeps the mark
                // the same on both. The build fails if a comparison grows a criterion with no mark,
                // or gives two rows of one table the same one.
                const Mark = criterionIcon[r.criterion as keyof typeof criterionIcon];
                return (
                  <tr key={r.criterion} className="group/row transition-colors duration-200 motion-reduce:transition-none [@media(hover:hover)]:hover:[&>*]:bg-surface-2">
                    <th scope="row" className={tdCriterion}>
                      <span className="flex items-start gap-2.5">
                        {/* Muted at rest, ember with the row. A column of ten ember marks is the one
                            accent shouting; as shapes they are a scanning aid, and the colour is
                            held back to confirm the row the pointer is on. `--muted` on `--surface`
                            is 7.35:1 and ember on `--surface-2` is 5.47:1, both over the 3:1 a
                            graphic needs. */}
                        <Mark
                          weight="duotone"
                          aria-hidden
                          className="mt-px size-4 shrink-0 text-muted transition-colors duration-200 motion-reduce:transition-none [@media(hover:hover)]:group-hover/row:text-accent-text"
                        />
                        <span className="min-w-0">{r.criterion}</span>
                      </span>
                    </th>
                    <td className={cn(td, "text-muted")}>{r.a}</td>
                    <td className={tdB}>{r.b}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <ClosingBand
        title={`Still deciding between ${c.a} and ${c.b}?`}
        measure="max-w-[28ch]"
        actions={
          <>
            <Primary location={`${loc}:closing`} className="btn-primary" />
            <ChatButton location={`${loc}:closing`} className="btn-secondary" />
          </>
        }
      />
    </article>
  );
}
