export type SiteStatus = {
  engineersOnline: boolean | null;
  medianResponseMinutes: number | null;
  asOf: Date | null;
};

// Nulls until the real chat provider is wired. Never invent numbers here.
export async function getSiteStatus(): Promise<SiteStatus> {
  return { engineersOnline: null, medianResponseMinutes: null, asOf: null };
}
