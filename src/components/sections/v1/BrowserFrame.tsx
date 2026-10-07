import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

/**
 * MASTER.md browser frame: one 12px surface, a thin bar with a mono URL, a real image inside. No fake chrome dots.
 * Shows public/screens/<slot>.png once scripts/capture-errors.mjs has written it; until then a logged picsum
 * placeholder (docs/image-todo.md) with empty alt, since the description would not match a random photo.
 */
export function BrowserFrame({
  slot,
  url,
  alt,
  className = "",
  realOnly = false,
  preload = false,
}: {
  slot: string;
  url: string;
  alt: string;
  className?: string;
  realOnly?: boolean; // render nothing until the real capture exists (guide pages)
  preload?: boolean; // above-the-fold use
}) {
  const real = `/screens/${slot}.png`;
  const isReal = existsSync(join(process.cwd(), "public", real));
  if (realOnly && !isReal) return null;
  const src = isReal ? real : `https://picsum.photos/seed/fixmywp-${slot}/1600/1000`;
  return (
    <figure className={`overflow-hidden rounded-card border border-line bg-surface shadow-card ${className}`}>
      <div className="flex h-9 items-center border-b border-line px-4 font-mono text-[12px] text-muted">
        <span className="truncate">{url}</span>
      </div>
      <Image src={src} alt={isReal ? alt : ""} width={1600} height={1000} sizes="(min-width: 768px) 40vw, 100vw" preload={preload} className="block h-auto w-full" />
    </figure>
  );
}
