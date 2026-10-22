"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { BookLink, ChatButton } from "@/components/Cta";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { matchProblem, type MatchCandidate } from "@/lib/match-problem";
import { cn } from "@/lib/utils";
import { useSearchTracking } from "@/lib/use-search-tracking";

/** A match candidate plus what the palette shows and where Enter goes. Built on the server in SiteShell. */
export type ProblemItem = MatchCandidate & { title: string; href: string; category: string };

const keyOf = (r: { serviceSlug: string; guideSlug?: string }) => `${r.serviceSlug}:${r.guideSlug ?? ""}`;

const groupBy = (list: ProblemItem[]) => {
  const m = new Map<string, ProblemItem[]>();
  for (const i of list) m.set(i.category, [...(m.get(i.category) ?? []), i]);
  return [...m];
};

const OpenPalette = createContext<() => void>(() => {});

/** Opens the problem palette from any client island inside ProblemSearch (the whole page is). */
export const useOpenPalette = () => useContext(OpenPalette);

/** Owns the command palette and Cmd/Ctrl K. Every SearchTrigger inside it opens the same palette. */
export function ProblemSearch({ items, children }: { items: ProblemItem[]; children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("");
  useSearchTracking(query);

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

  const byKey = useMemo(() => new Map(items.map((i) => [keyOf(i), i])), [items]);
  // Empty query lists every problem; otherwise matchProblem ranks title (weighted) and symptoms.
  const shown = query.trim() ? matchProblem(query, items, 12).map((r) => byKey.get(keyOf(r))!) : items;
  const current = byKey.get(active) ?? shown[0];

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <OpenPalette.Provider value={() => setOpen(true)}>
      {children}
      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
        <DialogContent showCloseButton={false}>
          <DialogTitle className="sr-only">Search problems</DialogTitle>
          <DialogDescription className="sr-only">Type what your site is doing. Enter opens the matching problem page.</DialogDescription>
          <Command shouldFilter={false} loop value={active} onValueChange={setActive} label="Search problems">
            <CommandInput value={query} onValueChange={setQuery} placeholder="What is your site doing?" />
            <CommandList>
              <CommandEmpty>
                <p>No match for that yet.</p>
                <p className="mt-3">
                  <span onClick={close}>
                    <ChatButton location="palette:no-match" className="btn-secondary" />
                  </span>
                </p>
              </CommandEmpty>
              {groupBy(shown).map(([category, list]) => (
                <CommandGroup key={category} heading={category}>
                  {list.map((i) => (
                    <CommandItem
                      key={keyOf(i)}
                      value={keyOf(i)}
                      onSelect={() => {
                        close();
                        router.push(i.href);
                      }}
                    >
                      {i.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
              <p className="hidden text-sm text-muted sm:block">
                <Kbd>Enter</Kbd> opens the page, <Kbd>Esc</Kbd> closes
              </p>
              <span onClick={close} className="ml-auto">
                <BookLink location="palette" service={current?.serviceSlug} guide={current?.guideSlug} className="btn-primary" />
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </OpenPalette.Provider>
  );
}

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="rounded-full border border-line-strong bg-surface px-2 py-0.5 font-sans text-xs text-muted">{children}</kbd>
);

const noop = () => () => {};
const useIsMac = () =>
  useSyncExternalStore(noop, () => /Mac|iPhone|iPad/.test(navigator.userAgent), () => false);

/**
 * Opens the palette. Two shapes, and two optional additions for a page that makes search its own control rather
 * than a corner of the nav: `label` replaces the wording and shows it at every width instead of from lg, and
 * `className` tunes the box (width, alignment, type size). Both default to the nav's behaviour exactly, so every
 * existing call site renders as before.
 */
export function SearchTrigger({ variant, label, className }: { variant: "pill" | "icon"; label?: string; className?: string }) {
  const open = useContext(OpenPalette);
  const mac = useIsMac();
  const name = label ?? "Search problems";

  if (variant === "icon")
    return (
      <button type="button" onClick={open} aria-label={name} className={cn("grid size-11 cursor-pointer place-items-center rounded-full hover:bg-surface-2", className)}>
        <MagnifyingGlassIcon weight="duotone" className="size-5" aria-hidden />
      </button>
    );

  return (
    <button
      type="button"
      onClick={open}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-surface-2 px-3 text-sm text-muted transition-colors hover:text-text lg:pr-2 lg:pl-4",
        className,
      )}
    >
      {/* The name comes from this one string, so it reads the same at every width, and the visible copy repeats
          it verbatim: an aria-label here would not contain the shortcut hint, which axe reports as a
          name/content mismatch, and visible wording that is not in the name fails label-in-name. */}
      <span className="sr-only">{name}</span>
      <MagnifyingGlassIcon weight="duotone" className="size-4" aria-hidden />
      <span aria-hidden className={label ? "inline" : "hidden lg:inline"}>{name}</span>
      <span aria-hidden className="hidden lg:inline">
        <Kbd>{mac ? "⌘ K" : "Ctrl K"}</Kbd>
      </span>
    </button>
  );
}
