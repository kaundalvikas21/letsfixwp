// CTA class strings. A plain module (not "use client") so server components can import them too:
// importing a value from a client module gives the server a reference, not the object.
// Contract rule 5: 44px min target, label never wraps, :active scale-[0.98], focus ring from globals.css.
const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-control px-5 text-[15px] font-semibold transition-transform duration-150 active:scale-[0.98]";

export const ctaStyles = {
  solid: `${base} bg-accent text-accent-label hover:-translate-y-px`,
  ghost: `${base} border border-line text-text hover:bg-surface-2`,
  text: "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-control text-[15px] font-medium text-accent-ink hover:underline",
  icon: "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-control border border-line text-text transition-transform duration-150 active:scale-[0.98]",
};
