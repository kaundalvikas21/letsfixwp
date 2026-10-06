"use client";

import { useEffect } from "react";
import { track } from "./track";

/** Fires problem_search once the visitor pauses typing, not on every keystroke. */
export function useSearchTracking(query: string) {
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) return;
    const t = setTimeout(() => track("problem_search", { query: q }), 800);
    return () => clearTimeout(t);
  }, [query]);
}
