"use server";

import { problemItems } from "@/content";
import { matchProblem } from "@/lib/match-problem";

export type PaletteResult = { key: string; title: string; href: string; category: string };

const keyOf = (p: { serviceSlug: string; guideSlug?: string }) => `${p.serviceSlug}:${p.guideSlug ?? ""}`;
const byKey = new Map(problemItems.map((p) => [keyOf(p), p]));
const slim = (p: (typeof problemItems)[number]): PaletteResult => ({ key: keyOf(p), title: p.title, href: p.href, category: p.category });

/**
 * Both functions below are Server Actions, which means both are public HTTP endpoints and their arguments
 * arrive off the wire. A `raw: string` annotation is erased at build, so it guards nothing: a caller posting
 * a number or an object made `raw.slice` throw and the action answer 500. `unknown` is the honest parameter
 * type and this is the one place the value becomes a string, bounded so the tokenizer never sees more than
 * it needs. `submitBooking` in src/app/contact/actions.ts states the same rule and validates the same way.
 */
const bounded = (raw: unknown) => (typeof raw === "string" ? raw.slice(0, 200) : "");

/** Header palette search. Runs on the server so the match index (head/body scoring text) never ships to the client. */
export async function searchProblems(raw: unknown): Promise<PaletteResult[]> {
  const query = bounded(raw);
  if (!query.trim()) return problemItems.slice(0, 6).map(slim);
  return matchProblem(query, problemItems, 8)
    .map((r) => byKey.get(keyOf(r)))
    .filter((p): p is (typeof problemItems)[number] => Boolean(p))
    .map(slim);
}

/**
 * Problem-grid filter. Returns every match's key, best first, so the grid can reorder tiles it is
 * already holding. Same reason as above: the scoring text (head and body, 20.8 KB of symptom and
 * error strings that are never rendered) stays on the server instead of riding in every home page.
 */
export async function rankProblems(raw: unknown): Promise<string[]> {
  const query = bounded(raw);
  if (!query.trim()) return [];
  return matchProblem(query, problemItems, problemItems.length).map(keyOf);
}
