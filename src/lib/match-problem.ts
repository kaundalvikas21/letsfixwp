type Matchable = { slug: string; title: string; h1: string; symptoms: readonly string[] };

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

/** Top 3 slugs for a free-text symptom. Title and h1 hits outweigh symptom hits. */
export function matchProblem(query: string, problems: readonly Matchable[], limit = 3): string[] {
  const q = tokenize(query);
  if (!q.length) return [];
  return problems
    .map((p) => {
      const head = new Set(tokenize(`${p.title} ${p.h1}`));
      const body = new Set(tokenize(p.symptoms.join(" ")));
      const score = q.reduce((n, t) => n + (head.has(t) ? 3 : 0) + (body.has(t) ? 1 : 0), 0);
      return { slug: p.slug, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.slug);
}
