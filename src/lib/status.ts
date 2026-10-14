export type SiteStatus = {
  engineersOnline: boolean | null;
  medianResponseMinutes: number | null;
  asOf: Date | null;
};

// Nulls until a provider exposes these on the server. Never invent numbers here.
// Live operator presence is a browser-side question: src/lib/chat/providers.ts `available()`, surfaced by
// src/components/sections/v3/ChatPresence.tsx. A vendor without a presence API reports nothing at all.
export async function getSiteStatus(): Promise<SiteStatus> {
  return { engineersOnline: null, medianResponseMinutes: null, asOf: null };
}
