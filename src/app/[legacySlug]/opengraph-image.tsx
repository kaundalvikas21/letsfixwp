import { getProblemByLegacySlug } from "@/content/problems";
import { ogSize, problemOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "FixMyWP WordPress repair";

export default async function Image({ params }: { params: Promise<{ legacySlug: string }> }) {
  return problemOg(getProblemByLegacySlug((await params).legacySlug)!);
}
