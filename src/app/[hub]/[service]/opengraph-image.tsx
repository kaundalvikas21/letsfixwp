import { pathFromParams } from "@/components/templates/NodeRoute";
import { nodeByPath, serviceIdOf } from "@/config/routes";
import { getService } from "@/content";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "WordPress service";

export default async function Image({ params }: { params: Promise<{ hub: string; service: string }> }) {
  const path = pathFromParams(await params);
  const n = nodeByPath.get(path);
  return ogImage(n?.kind === "service" ? getService(serviceIdOf(path))!.h1 : (n?.title ?? ""));
}
