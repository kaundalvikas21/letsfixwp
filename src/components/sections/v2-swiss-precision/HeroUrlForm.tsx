"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { normaliseSiteUrl, siteUrlField } from "@/app/contact/booking-schema";
import { CTA } from "@/config/cta";
import { openChat } from "@/lib/chat";
import { routes } from "@/config/routes";
import { track } from "@/lib/track";

// Isolated client leaf (contract rule 2). The surrounding Hero is a Server Component.
// Degrades without JS: it is a real GET form at routes.contact with a field named "url", which is
// the same URL routes.book({ url }) builds, and the booking step re-parses with the same rule.
// noValidate is deliberate: type="url" gives the right mobile keyboard, but the browser's own
// check rejects "example.com", and accepting a bare domain is the point.

export function HeroUrlForm({ location, chat = true }: { location: string; chat?: boolean }) {
  const router = useRouter();
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = siteUrlField.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter your site address, like example.com");
      return;
    }
    setError(null);
    track("cta_book_click", { location });
    router.push(routes.book({ url: normaliseSiteUrl(parsed.data) }));
  };

  return (
    <div>
      <form action={routes.contact} method="get" noValidate onSubmit={onSubmit}>
        <label htmlFor={fieldId} className="mb-2 block text-sm font-medium">
          Your website
        </label>

        {/* Joined: the input and the button share one 1px edge, no gap, no radius. */}
        <div className="flex w-full">
          <input
            id={fieldId}
            name="url"
            type="url"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="example.com"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            onBlur={() => {
              if (!value.trim()) return;
              const parsed = siteUrlField.safeParse(value);
              setError(parsed.success ? null : (parsed.error.issues[0]?.message ?? null));
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="min-h-14 w-full min-w-0 flex-1 border border-muted bg-surface px-4 text-base text-text transition-colors duration-200 placeholder:text-muted focus-visible:border-text aria-invalid:border-accent-text"
          />
          <button type="submit" className="btn-primary min-h-14 shrink-0 border-l-0 px-5 sm:px-7">
            {CTA.BOOK}
          </button>
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-2 font-mono text-sm text-accent-text">
            {error}
          </p>
        )}
      </form>

      {chat && (
        <button
          type="button"
          onClick={() => openChat(location)}
          className="mt-4 inline-flex min-h-11 items-center border-b border-muted text-base text-muted transition-colors duration-200 hover:border-text hover:text-text"
        >
          {CTA.CHAT}
        </button>
      )}
    </div>
  );
}
