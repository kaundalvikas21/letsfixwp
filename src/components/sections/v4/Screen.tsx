import Image from "next/image";

/** A real 1600x1000 capture from scripts/capture-errors.mjs, in the v4 frame (14px, no fake chrome). */
export function Screen({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] bg-surface-2 p-2">
      <Image src={src} alt={alt} width={1600} height={1000} sizes={sizes} className="rounded-[14px]" />
    </div>
  );
}
