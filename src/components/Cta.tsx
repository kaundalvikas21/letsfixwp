"use client";

import { ChatCircleText } from "@phosphor-icons/react";
import Link from "next/link";
import { CTA, type CtaIntent } from "@/config/cta";
import { routes } from "@/config/routes";
import { openChat } from "@/lib/chat";
import { track } from "@/lib/track";

// Labels come only from CTA, targets only from routes. These components take no children on purpose.
// Contract rule 5: 44px min target, label never wraps, :active scale-[0.98], focus ring from globals.css.
const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-control px-5 text-[15px] font-semibold transition-transform duration-150 active:scale-[0.98]";

export const ctaStyles = {
  solid: `${base} bg-accent text-accent-label hover:-translate-y-px`,
  ghost: `${base} border border-line text-text hover:bg-surface-2`,
  text: "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-control text-[15px] font-medium text-accent-ink hover:underline",
  icon: "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control border border-line text-text transition-transform duration-150 active:scale-[0.98]",
};

type Variant = "solid" | "ghost" | "text";
type Common = { location: string; service?: string; variant?: Variant; className?: string };

const cls = (variant: Variant, className = "") => `${ctaStyles[variant]} ${className}`;

export function BookLink({ location, service, guide, url, variant = "solid", className }: Common & { guide?: string; url?: string }) {
  return (
    <Link
      href={routes.book({ service, guide, url })}
      onClick={() => track("cta_book_click", { location, service })}
      className={cls(variant, className)}
    >
      {CTA.BOOK}
    </Link>
  );
}

export function PlansLink({ location, service, variant = "solid", className }: Common) {
  return (
    <Link href={routes.plans(service)} onClick={() => track("cta_plans_click", { location, service })} className={cls(variant, className)}>
      {CTA.PLANS}
    </Link>
  );
}

export function QuoteLink({ location, service, variant = "solid", className }: Common) {
  return (
    <Link href={routes.quote(service)} onClick={() => track("cta_quote_click", { location, service })} className={cls(variant, className)}>
      {CTA.QUOTE}
    </Link>
  );
}

export function CheckLink({ location, service, variant = "ghost", className }: Common) {
  return (
    <Link href={routes.check} onClick={() => track("cta_check_click", { location, service })} className={cls(variant, className)}>
      {CTA.CHECK}
    </Link>
  );
}

export function ChatButton({ location, service, variant = "ghost", iconOnly = false, className = "" }: Common & { iconOnly?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => openChat(location, service)}
      aria-label={iconOnly ? CTA.CHAT : undefined}
      className={iconOnly ? `${ctaStyles.icon} ${className}` : cls(variant, className)}
    >
      {iconOnly ? <ChatCircleText size={22} aria-hidden /> : CTA.CHAT}
    </button>
  );
}

/** The page's primary CTA (from its node intent) followed by CHAT as the secondary. `hero` marks it for the mobile bar. */
export function CtaPair({ intent, location, service, hero = false }: { intent: CtaIntent; location: string; service?: string; hero?: boolean }) {
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  return (
    <p className="flex flex-wrap gap-2" data-hero-cta={hero || undefined}>
      <Primary location={location} service={service} /> <ChatButton location={location} service={service} />
    </p>
  );
}
