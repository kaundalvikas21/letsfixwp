import { getGuide } from "@/content";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "WordPress error guide";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return ogImage(getGuide((await params).slug)!.h1);
}
