import type { ReactNode } from "react";

// Shared V1 page-template type scale and the closing CTA band (MASTER tokens).
export const h1 = "text-[clamp(2.25rem,1.6rem+2.6vw,3.5rem)] leading-[1.05] font-semibold tracking-tight text-text";
export const h2 = "text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] leading-[1.1] font-semibold tracking-tight text-text";
export const h3 = "text-xl font-semibold tracking-tight text-text";
export const lead = "max-w-[60ch] text-lg leading-relaxed text-muted";
export const body = "max-w-[65ch] text-[16px] leading-relaxed text-text";
export const pageWrap = "mx-auto max-w-[75rem] px-4 md:px-6"; // 1200px: service and guide page overrides

/**
 * Closing CTA band for template pages: centered heading line from page content plus the CTA pair, on --surface-2
 * with an accent top rule. Deliberately not the home page's statement row or full-bleed photo panel.
 */
export function CtaBand({ line, children }: { line: string; children: ReactNode }) {
  return (
    <section aria-label="Next step" className="mt-24 border-t-2 border-accent bg-surface-2">
      <div className="mx-auto flex max-w-[75rem] flex-col items-center gap-6 px-4 py-16 text-center md:px-6">
        <p className="max-w-[44ch] text-xl leading-snug font-medium text-text">{line}</p>
        {children}
      </div>
    </section>
  );
}
