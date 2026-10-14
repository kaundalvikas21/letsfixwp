import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { photos, type PhotoId } from "@/content/photos";
import { cn } from "@/lib/utils";

/**
 * One photograph from src/content/photos.ts, filling its box (give the parent an aspect ratio and the radius).
 * decorative: empty alt, for photos that only set mood next to text that already says it.
 * preload: for the one above-the-fold image that is the LCP (Next 16 replaced `priority`).
 */
export function Photo({
  id,
  sizes,
  decorative = false,
  preload = false,
  className,
}: {
  id: PhotoId;
  sizes: string;
  decorative?: boolean;
  preload?: boolean;
  className?: string;
}) {
  const p = photos[id];
  return (
    <Image
      src={p.src}
      width={p.width}
      height={p.height}
      alt={decorative ? "" : p.alt}
      sizes={sizes}
      loading={preload ? "eager" : undefined}
      fetchPriority={preload ? "high" : undefined}
      style={"focus" in p ? { objectPosition: p.focus } : undefined}
      className={cn("size-full object-cover", className)}
    />
  );
}

/** True once a capture (path under public/, e.g. "/screens/restored.png") has been written. Checked at build. */
export const hasScreen = (src: string) => existsSync(join(process.cwd(), "public", src));

/** A real 1600x1000 screen capture in a simple device frame. */
export function Screen({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[20px] bg-surface p-2 shadow-card", className)}>
      <Image src={src} alt={alt} width={1600} height={1000} sizes={sizes} className="rounded-[12px]" />
    </div>
  );
}
