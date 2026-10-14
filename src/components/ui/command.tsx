"use client";

// shadcn/ui Command (cmdk), trimmed to the parts this site uses and mapped to the v3 tokens.
import { Command as CommandPrimitive } from "cmdk";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive className={cn("flex w-full flex-col overflow-hidden bg-surface text-text", className)} {...props} />;
}

export function CommandInput({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-3 border-b-2 border-line px-4 focus-within:border-accent">
      <MagnifyingGlassIcon weight="duotone" className="size-5 shrink-0 text-muted" aria-hidden />
      <CommandPrimitive.Input
        className={cn("h-14 w-full bg-transparent text-base outline-none placeholder:text-muted", className)}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn("max-h-[min(55dvh,420px)] scroll-py-2 overflow-y-auto overscroll-contain p-2", className)}
      {...props}
    />
  );
}

export function CommandEmpty(props: ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className="px-4 py-8 text-center text-sm text-muted" {...props} />;
}

export function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn("[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted", className)}
      {...props}
    />
  );
}

export function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2 text-sm data-[selected=true]:bg-surface-2", className)}
      {...props}
    />
  );
}
