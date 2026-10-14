"use client";

import { motion, MotionConfig } from "motion/react";
import { RadioGroup } from "radix-ui";
import { cn } from "@/lib/utils";

// Feedback speed: lands in about 250ms with no overshoot (the steps tabs pill uses the same).
const thumb = { type: "spring", stiffness: 400, damping: 40 } as const;

/**
 * Segmented pill control: a Radix radio group (arrow keys switch) with a sliding thumb that says which option is
 * on. layoutId must be unique per instance on the page. Reduced motion makes the thumb jump.
 */
export function PillRadio<T extends string>({
  value,
  onChange,
  options,
  label,
  layoutId,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  layoutId: string;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <RadioGroup.Root
        value={value}
        onValueChange={(v) => onChange(v as T)}
        orientation="horizontal"
        aria-label={label}
        className={cn("inline-flex self-start rounded-full border border-line-strong bg-surface-2 p-1", className)}
      >
        {options.map((o) => (
          <RadioGroup.Item
            key={o.value}
            value={o.value}
            className="relative h-11 cursor-pointer rounded-full px-5 font-semibold text-muted transition-colors hover:text-text data-[state=checked]:text-on-accent"
          >
            {value === o.value && <motion.span layoutId={layoutId} transition={thumb} className="absolute inset-0 rounded-full bg-accent" />}
            <span className="relative">{o.label}</span>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </MotionConfig>
  );
}
