import { getProblem } from "@/content/problems";
import { ogSize, problemOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "FixMyWP WordPress repair";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return problemOg(getProblem((await params).slug)!);
}
