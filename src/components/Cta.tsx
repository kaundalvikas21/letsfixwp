"use client";

import Link from "next/link";
import { CTA, PLANS_HREF, bookHref } from "@/config/cta";
import { openChat } from "@/lib/chat";
import { track } from "@/lib/track";

// Labels come only from CTA. These components take no children on purpose.

export function BookLink({ location, problem, url }: { location: string; problem?: string; url?: string }) {
  return (
    <Link href={bookHref(problem, url)} onClick={() => track("cta_book_click", { location, problem })}>
      {CTA.BOOK}
    </Link>
  );
}

export function ChatButton({ location }: { location: string }) {
  return (
    <button type="button" onClick={() => openChat(location)}>
      {CTA.CHAT}
    </button>
  );
}

export function PlansLink() {
  return <Link href={PLANS_HREF}>{CTA.PLANS}</Link>;
}
