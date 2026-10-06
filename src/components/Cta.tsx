"use client";

import { ChatCircleText } from "@phosphor-icons/react";
import Link from "next/link";
import { CTA, PLANS_HREF, bookHref } from "@/config/cta";
import { openChat } from "@/lib/chat";
import { track } from "@/lib/track";

// Labels come only from CTA. These components take no children on purpose.
// Contract rule 5: 44px min target, label never wraps, :active scale-[0.98], focus ring from globals.css.
const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-control px-5 text-[15px] font-semibold transition-transform duration-150 active:scale-[0.98]";

export const ctaStyles = {
  solid: `${base} bg-accent text-accent-label hover:-translate-y-px`,
  ghost: `${base} border border-line text-text hover:bg-surface-2`,
  icon: "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control border border-line text-text transition-transform duration-150 active:scale-[0.98]",
};

type Variant = "solid" | "ghost";

export function BookLink({
  location,
  problem,
  url,
  variant = "solid",
  className = "",
}: {
  location: string;
  problem?: string;
  url?: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={bookHref(problem, url)}
      onClick={() => track("cta_book_click", { location, problem })}
      className={`${ctaStyles[variant]} ${className}`}
    >
      {CTA.BOOK}
    </Link>
  );
}

export function ChatButton({
  location,
  variant = "ghost",
  iconOnly = false,
  className = "",
}: {
  location: string;
  variant?: Variant;
  iconOnly?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openChat(location)}
      aria-label={iconOnly ? CTA.CHAT : undefined}
      className={`${iconOnly ? ctaStyles.icon : ctaStyles[variant]} ${className}`}
    >
      {iconOnly ? <ChatCircleText size={22} aria-hidden /> : CTA.CHAT}
    </button>
  );
}

export function PlansLink({ variant = "ghost", className = "" }: { variant?: Variant; className?: string }) {
  return (
    <Link href={PLANS_HREF} className={`${ctaStyles[variant]} ${className}`}>
      {CTA.PLANS}
    </Link>
  );
}
