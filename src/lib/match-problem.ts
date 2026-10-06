/** What the matcher scores. Built on the server (src/content/index.ts matchIndex) and passed to client islands. */
export type MatchCandidate = {
  serviceSlug: string; // always set, so BOOK always has a target
  guideSlug?: string;
  head: string; // title and errorText (weighted)
  body: string; // symptoms
};

export type MatchResult = { guideSlug?: string; serviceSlug: string; score: number };

/** Stable key for a result: `${serviceSlug}:${guideSlug ?? ""}`. Shared by server and client code. */
export const matchKey = (r: { serviceSlug: string; guideSlug?: string }) => `${r.serviceSlug}:${r.guideSlug ?? ""}`;

const STOP = new Set([
  "the", "and", "for", "with", "my", "our", "site", "website", "wordpress", "wp",
  "is", "it", "its", "not", "after", "this", "that", "page", "pages", "on", "in",
  "a", "an", "of", "to", "i", "me", "can", "cant", "won", "wont", "keeps", "fix",
]);

export const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .map((t) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t))
    .filter((t) => t && !STOP.has(t) && (t.length > 2 || /^\d+$/.test(t)));

/**
 * Scores free text against guides (title, errorText, symptoms) and fix-intent services (title, symptoms).
 * Returns the top results, best first. Every result resolves to a service.
 */
export function matchProblem(text: string, index: readonly MatchCandidate[], limit = 3): MatchResult[] {
  const q = tokenize(text);
  if (!q.length) return [];
  return index
    .map((c) => {
      const head = new Set(tokenize(c.head));
      const body = new Set(tokenize(c.body));
      const score = q.reduce((n, t) => n + (head.has(t) ? 3 : 0) + (body.has(t) ? 1 : 0), 0);
      return { guideSlug: c.guideSlug, serviceSlug: c.serviceSlug, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || Number(!!b.guideSlug) - Number(!!a.guideSlug))
    .slice(0, limit);
}
