/**
 * Column spans for a bento of n cells on a 6-column grid, in source order.
 *
 * Cells pair off into rows that fill the row, and within each pair the heavier cell takes the 4 and the lighter
 * takes the 2, so a row is never two equal cards and a long cell never lands in the narrow slot. An odd last
 * cell spans the whole row. At 3, 4 and 5 cells that gives (4,2)(6), (4,2)(2,4) and (4,2)(2,4)(6), or their
 * mirrors: no count produces a row of three equal cards, which contract rule 6 bans outright.
 *
 * `weights` is whatever makes a cell heavy on the page that calls this, usually the length of its body text.
 * Spans come back as numbers so a caller maps them to its own class names and nothing is coupled by text.
 */
export const bentoSpans = (weights: readonly number[]): number[] => {
  const spans: number[] = [];
  for (let i = 0; i < weights.length; i += 2) {
    if (i + 1 === weights.length) spans.push(6);
    else if (weights[i] >= weights[i + 1]) spans.push(4, 2);
    else spans.push(2, 4);
  }
  return spans;
};

/**
 * Spans for a bento that only goes asymmetric when its content genuinely varies. Near-equal weights give
 * `bentoSpans` nothing to differentiate, so it would only invent wide cells the text cannot fill. At or below
 * the ratio the grid is a plain 2-up (two equal cards a row is allowed, rule 6 bans three) and an odd last card
 * spans the row, the same rule `bentoSpans` applies. Returns 3 for the halves, else 2, 4 or 6.
 * ponytail: 1.4 was tuned by hand against the six real hubs: max/min card weight is 1.12 to 1.28 for the three
 * uniform ones (2-up) and 1.67 to 2.63 for the three varied ones (bento), so anything from 1.3 to 1.6 splits them.
 * The compare pages (1.0 to 1.5 on real verdicts) use the same number. If a future set lands wrong, move this
 * number or replace it with a per-caller choice.
 */
export const UNIFORM_RATIO = 1.4;
export const bentoLayout = (weights: readonly number[]): number[] =>
  Math.max(...weights) <= Math.min(...weights) * UNIFORM_RATIO
    ? weights.map((_, i) => (i === weights.length - 1 && i % 2 === 0 ? 6 : 3))
    : bentoSpans(weights);
