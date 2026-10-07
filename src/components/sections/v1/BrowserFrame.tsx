import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

const hasCapture = (slot: string) => existsSync(join(process.cwd(), "public", "screens", `${slot}.png`));

/**
 * MASTER.md browser frame: one 12px surface, a thin bar with a mono URL, a real image inside. No fake chrome dots.
 * Only ever wraps a real capture written by scripts/capture-errors.mjs, so the chrome never implies a screenshot
 * that does not exist. Renders nothing until then (docs/image-todo.md).
 */
export function BrowserFrame({
  slot,
  url,
  alt,
  className = "",
  preload = false,
}: {
  slot: string;
  url: string;
  alt: string;
  className?: string;
  preload?: boolean; // above-the-fold use
}) {
  if (!hasCapture(slot)) return null;
  return (
    <figure className={`overflow-hidden rounded-card border border-line bg-surface shadow-card ${className}`}>
      <div className="flex h-9 items-center border-b border-line px-4 font-mono text-[12px] text-muted">
        <span className="truncate">{url}</span>
      </div>
      <Image src={`/screens/${slot}.png`} alt={alt} width={1600} height={1000} sizes="(min-width: 768px) 40vw, 100vw" preload={preload} className="block h-auto w-full" />
    </figure>
  );
}

/**
 * The real capture in its frame once it exists, otherwise a plain on-brand photograph from
 * public/site_images/services/. The photograph is never framed: browser chrome around stock imagery would read as a
 * screenshot, which the section contract bans. It carries no information the heading does not, so alt stays empty.
 *
 * `slot` is optional: some places (the Repair step of the home timeline) have no screen state worth capturing and
 * stay a photograph for good.
 */
export function ScreenOrPhoto({
  slot,
  url,
  alt,
  photo,
  className = "",
  preload = false,
}: {
  slot?: string;
  url?: string;
  alt?: string;
  photo?: string;
  className?: string;
  preload?: boolean;
}) {
  if (slot && url && alt && hasCapture(slot)) return <BrowserFrame slot={slot} url={url} alt={alt} className={className} preload={preload} />;
  if (!photo) return null;
  return (
    <Image
      src={`/site_images/services/${photo}.jpg`}
      alt=""
      width={1600}
      height={1000}
      sizes="(min-width: 768px) 40vw, 100vw"
      preload={preload}
      quality={65}
      className={`block h-auto w-full rounded-card border border-line object-cover ${className}`}
    />
  );
}
