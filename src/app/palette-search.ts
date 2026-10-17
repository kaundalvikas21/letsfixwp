"use server";

import { problemItems } from "@/content";
import { matchProblem } from "@/lib/match-problem";

export type PaletteResult = { key: string; title: string; href: string; category: string };

const keyOf = (p: { serviceSlug: string; guideSlug?: string }) => `${p.serviceSlug}:${p.guideSlug ?? ""}`;
const byKey = new Map(problemItems.map((p) => [keyOf(p), p]));
const slim = (p: (typeof problemItems)[number]): PaletteResult => ({ key: keyOf(p), title: p.title, href: p.href, category: p.category });

/** Header palette search. Runs on the server so the match index (head/body scoring text) never ships to the client. */
export async function searchProblems(raw: string): Promise<PaletteResult[]> {
  const query = raw.slice(0, 200); // publicly callable: bound what the tokenizer sees
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
export async function rankProblems(raw: string): Promise<string[]> {
  const query = raw.slice(0, 200);
  if (!query.trim()) return [];
  return matchProblem(query, problemItems, problemItems.length).map(keyOf);
}
