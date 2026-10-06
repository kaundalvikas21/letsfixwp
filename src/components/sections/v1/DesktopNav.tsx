"use client";

// shadcn/ui NavigationMenu structure on the Radix primitive, restyled to design-system/fixmywp-v1/MASTER.md.
// Radix supplies the keyboard model: arrow keys move between triggers and between links inside an open panel,
// Escape closes and returns focus to the trigger. delayDuration gives hover a 120ms intent delay; click toggles.
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu as NM } from "radix-ui";
import type { NavEntry } from "./nav-model";

const itemCls =
  "group inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-control px-3 text-[15px] text-muted transition-colors hover:text-text data-[active]:text-text data-[state=open]:text-text";

// Opacity only (contract rule 10), using the fade keyframes already in globals.css. Communicates state: the panel is open.
const panelCls =
  "absolute top-full z-50 mt-2 rounded-card border border-line bg-surface p-2 shadow-card data-[state=open]:animate-[fade-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_100ms_ease-in] motion-reduce:animate-none";

export function DesktopNav({ items }: { items: NavEntry[] }) {
  const pathname = usePathname();
  const here = pathname.endsWith("/") ? pathname : `${pathname}/`;

  return (
    <NM.Root delayDuration={120} aria-label="Primary" className="hidden lg:block">
      <NM.List className="flex items-center gap-1">
        {items.map((item) =>
          item.kind === "link" ? (
            <NM.Item key={item.href}>
              <NM.Link asChild active={here.startsWith(item.href)}>
                <Link href={item.href} className={itemCls}>
                  {item.label}
                </Link>
              </NM.Link>
            </NM.Item>
          ) : (
            <NM.Item key={item.id} value={item.id} className="relative">
              <NM.Trigger className={itemCls} data-active={item.prefixes.some((p) => here.startsWith(p)) || undefined}>
                {item.label}
                <CaretDown size={14} aria-hidden className="transition-transform duration-150 group-data-[state=open]:rotate-180" />
              </NM.Trigger>
              <NM.Content className={`${panelCls} ${item.columns === 2 ? "left-0 w-[40rem]" : "right-0 w-72"}`}>
                <ul className={item.columns === 2 ? "grid grid-cols-2 gap-1" : "grid gap-1"}>
                  {item.links.map((l) => (
                    <li key={l.href}>
                      <NM.Link asChild active={here === l.href}>
                        <Link
                          href={l.href}
                          className="block rounded-control px-3 py-2.5 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 data-[active]:bg-surface-2"
                        >
                          <span className="block text-[15px] font-medium text-text">{l.title}</span>
                          {l.line && <span className="mt-0.5 line-clamp-1 text-[13px] text-muted">{l.line}</span>}
                        </Link>
                      </NM.Link>
                    </li>
                  ))}
                </ul>
                {item.all && (
                  <NM.Link asChild>
                    <Link
                      href={item.all.href}
                      className="mt-1 flex min-h-11 items-center gap-1.5 rounded-control border-t border-line px-3 text-[14px] font-medium text-accent-ink hover:underline"
                    >
                      {item.all.label}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  </NM.Link>
                )}
              </NM.Content>
            </NM.Item>
          ),
        )}
      </NM.List>
    </NM.Root>
  );
}
