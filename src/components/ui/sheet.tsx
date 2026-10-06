"use client";

// shadcn/ui Sheet, restyled to the fixmywp-v1 tokens. Right side only (the one we use).
// Open/close motion is the sheet-in/sheet-out keyframes in globals.css: transform and opacity only, off under reduced motion.
import { X } from "@phosphor-icons/react";
import { Dialog as SheetPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

const Sheet = (props: ComponentProps<typeof SheetPrimitive.Root>) => <SheetPrimitive.Root {...props} />;
const SheetTrigger = (props: ComponentProps<typeof SheetPrimitive.Trigger>) => <SheetPrimitive.Trigger {...props} />;
const SheetClose = (props: ComponentProps<typeof SheetPrimitive.Close>) => <SheetPrimitive.Close {...props} />;

function SheetContent({ className = "", children, ...props }: ComponentProps<typeof SheetPrimitive.Content>) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="sheet-overlay fixed inset-0 z-50 bg-bg/70" />
      <SheetPrimitive.Content
        className={`sheet-panel fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(22rem,85vw)] flex-col border-l border-line bg-surface shadow-card ${className}`}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-2.5 right-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-control text-muted transition-transform hover:text-text active:scale-[0.98]">
          <X size={20} aria-hidden />
          <span className="sr-only">Close menu</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

const SheetTitle = ({ className = "", ...props }: ComponentProps<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title className={`font-semibold text-text ${className}`} {...props} />
);

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger };
