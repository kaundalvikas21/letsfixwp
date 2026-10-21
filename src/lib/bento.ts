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
