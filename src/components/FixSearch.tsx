"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, categoryLabels, type Category } from "@/content/categories";
import type { ProblemSummary } from "@/content/problems";
import { matchProblem } from "@/lib/match-problem";
import { useSearchTracking } from "@/lib/use-search-tracking";

export function FixSearch({ problems }: { problems: ProblemSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  useSearchTracking(query);

  const inCategory = category ? problems.filter((p) => p.category === category) : problems;
  const results = query.trim()
    ? matchProblem(query, inCategory, inCategory.length).map((s) => inCategory.find((p) => p.slug === s)!)
    : inCategory;

  return (
    <section aria-labelledby="fix-search-heading">
      <h2 id="fix-search-heading">Find your problem</h2>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="fix-q">Describe what you see</label>
        <input id="fix-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
        <label htmlFor="fix-cat">Category</label>
        <select id="fix-cat" value={category} onChange={(e) => setCategory(e.target.value as Category | "")}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </form>
      <p aria-live="polite">
        {results.length} {results.length === 1 ? "problem" : "problems"}
      </p>
      <ul>
        {results.map((p) => (
          <li key={p.slug}>
            <Link href={p.path}>{p.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
