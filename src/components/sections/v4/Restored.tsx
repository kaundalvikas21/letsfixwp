import Image from "next/image";
import { hasScreen, Photo } from "@/components/Photo";
import { ZoomImage } from "./ZoomImage";

const CAPTURE = "/screens/restored.png";

/**
 * The result: the same site, loading. No text sits on the image, so the capture is never a backdrop
 * for a headline, and nothing has to survive a scrim.
 */
export function Restored() {
  return (
    <section aria-labelledby="same-site" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <h2
        id="same-site"
        className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
      >
        Same site. Working again.
      </h2>

      <ZoomImage>
        {hasScreen(CAPTURE) ? (
          <Image
            src={CAPTURE}
            alt="The same WordPress site loading normally again"
            width={1600}
            height={1000}
            sizes="(min-width: 768px) 72rem, 92vw"
            className="w-full rounded-[14px]"
          />
        ) : (
          // The restored capture is one `npm run capture` away (docs/image-todo.md). Until then a real
          // frame stands in, with an empty alt: it is not a screen of your site and does not claim to
          // be. A lit screen, not the dark monitor this first used: under "Working again" an unlit
          // screen reads as the site still being down.
          <div className="aspect-[16/10] overflow-hidden rounded-[14px]">
            <Photo id="store" decorative sizes="(min-width: 768px) 72rem, 92vw" />
          </div>
        )}
      </ZoomImage>

      <p className="mt-8 max-w-[52ch] text-lg text-muted">
        The same pages, the same content, the same theme. Nothing rebuilt, nothing redesigned.
      </p>
    </section>
  );
}
