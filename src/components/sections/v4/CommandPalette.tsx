"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { searchProblems, type PaletteResult } from "@/app/palette-search";
import { track } from "@/lib/track";

/** Which modifier to print. Same store pattern as Magnetic's pointer check; the platform never changes,
 *  so there is nothing to subscribe to, and the server assumes the commoner of the two. */
const useIsMac = () =>
  useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent),
    () => false,
  );

/**
 * The header asks the visitor what their site is doing, from any page, without making them learn the
 * nav. Same matcher as the home finder and the booking flow, so what they type resolves to something
 * bookable. Keyboard only by design: under 768px there is no hardware keyboard and the bottom action
 * bar already carries the primary route, so the trigger is hidden there rather than crowding a 64px bar.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // Results are tagged with the query they answer: a stale or in-flight answer simply never matches `query`.
  const [found, setFound] = useState<{ q: string; items: PaletteResult[] } | null>(null);
  const mac = useIsMac();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Ranking happens on the server (matchProblem); cmdk's own substring filter would fight it, hence
  // shouldFilter={false} below. Debounced for typing, immediate for the empty query shown on open.
  useEffect(() => {
    if (!open) return;
    let live = true;
    const t = setTimeout(() => {
      searchProblems(query).then((items) => live && setFound({ q: query, items }));
    }, query.trim() ? 150 : 0);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [open, query]);

  const shown = found?.q === query ? found.items : null;

  const go = (p: PaletteResult) => {
    track("problem_search", { query });
    setOpen(false);
    setQuery("");
    router.push(p.href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hidden min-h-11 cursor-pointer items-center gap-2.5 rounded-[14px] border border-line-strong bg-surface px-4 text-muted transition-colors duration-200 hover:text-text md:inline-flex">
        <MagnifyingGlassIcon weight="duotone" className="size-4 shrink-0" aria-hidden />
        {"What is it doing?"}
        {mac !== null && (
          <kbd aria-hidden className="rounded-[14px] border border-line px-1.5 py-0.5 font-sans text-xs">
            {mac ? "⌘K" : "Ctrl K"}
          </kbd>
        )}
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="p-0">
        <DialogTitle className="sr-only">Find your problem</DialogTitle>
        <DialogDescription className="sr-only">
          Type what your site is doing. Results are the guides and fixes that match.
        </DialogDescription>
        <Command shouldFilter={false} loop>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Describe what your site is doing"
            aria-label="Describe what your site is doing"
          />
          <CommandList>
            {shown === null ? null : shown.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">
                Nothing matches that yet. Try the words your site is showing you, or the error it prints.
              </p>
            ) : (
              shown.map((p) => (
                <CommandItem key={p.key} value={p.key} onSelect={() => go(p)}>
                  <span className="flex-1">{p.title}</span>
                  <span className="shrink-0 text-xs text-muted">{p.category}</span>
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
