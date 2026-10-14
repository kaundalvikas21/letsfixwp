"use client";

// shadcn/ui Dialog, trimmed to the parts this site uses and mapped to the v3 tokens.
import { Dialog as DialogPrimitive } from "radix-ui";
import { XIcon } from "@phosphor-icons/react/ssr";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim motion-safe:data-[state=open]:animate-[fade-in_160ms_ease-out]" />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-[12dvh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-[20px] border border-line bg-surface text-text shadow-lift",
          "motion-safe:data-[state=open]:animate-[dialog-in_160ms_ease-out]",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-2 right-2 grid size-11 cursor-pointer place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-text"
          >
            <XIcon weight="duotone" className="size-5" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("font-display text-lg font-bold", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-sm text-muted", className)} {...props} />;
}
