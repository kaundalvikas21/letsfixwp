import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { illustrations, photos, type IllustrationId, type PhotoId } from "@/content/photos";
import { cn } from "@/lib/utils";

/**
 * One photograph from src/content/photos.ts, filling its box (give the parent an aspect ratio and the radius).
 * decorative: empty alt, for photos that only set mood next to text that already says it.
 * preload: for the one above-the-fold image that is the LCP (Next 16 replaced `priority`).
 *
 * Entrance. This component is the only way a photograph reaches a page, so the unveil lives here rather
 * than at the call sites: every photograph on the site already has it, and any component added later
 * inherits it by using <Photo> instead of <Image>. The rule itself is `[data-reveal="image"]` in
 * globals.css, and the observer that triggers it is Reveal.tsx.
 *
 * `preload` opts out, and that is the whole exception list. A preloaded photograph is the one above the
 * fold, which means it is the LCP element and its own frame already animates it (the home and service
 * heroes both run `settle` on the wrapper). Animating a clip-path on the LCP image would both double
 * that entrance and put a paint-blocking effect on the metric the contract caps at 2.5s.
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
      data-reveal={preload ? undefined : "image"}
      className={cn("size-full object-cover", className)}
    />
  );
}

/**
 * One Unsplash illustration from src/content/photos.ts, filling its box. The single way an illustration
 * reaches a page, so the entrance and the sizing live here and any new one inherits them by being registered.
 *
 * `decorative` is the default and the usual case: these sit beside an h1 and a lead paragraph that already say
 * what the page is, so an alt would repeat them. Pass it false where the illustration is the only thing
 * carrying its point.
 */
export function Illustration({
  id,
  sizes,
  decorative = true,
  preload = false,
  className,
}: {
  id: IllustrationId;
  sizes: string;
  decorative?: boolean;
  preload?: boolean;
  className?: string;
}) {
  const i = illustrations[id];
  return (
    <Image
      src={i.src}
      width={i.width}
      height={i.height}
      alt={decorative ? "" : i.alt}
      sizes={sizes}
      loading={preload ? "eager" : undefined}
      fetchPriority={preload ? "high" : undefined}
      data-reveal={preload ? undefined : "image"}
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
      <Image src={src} alt={alt} width={1600} height={1000} sizes={sizes} data-reveal="image" className="rounded-[12px]" />
    </div>
  );
}
