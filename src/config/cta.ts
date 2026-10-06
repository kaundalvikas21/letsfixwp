// Every CTA label on the site. No other CTA wording may exist in the codebase.
export const CTA = {
  BOOK: "Fix my site",
  CHAT: "Chat with an engineer",
  PLANS: "See care plans",
} as const;

export const PLANS_HREF = "/wordpress-maintenance-services";

export const bookHref = (problem?: string, url?: string) => {
  const q = new URLSearchParams();
  if (problem) q.set("problem", problem);
  if (url) q.set("url", url);
  const s = q.toString();
  return s ? `/app?${s}` : "/app";
};
