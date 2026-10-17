import Image from "next/image";
import { hasScreen, Photo } from "@/components/Photo";
import { BeforeAfter } from "./BeforeAfter";
import { RestoredOverlay } from "./RestoredOverlay";
import { ZoomImage } from "./ZoomImage";

const CAPTURE = "/screens/restored.png";
// The same error the fix panel opens with, so the page tells one story about one screen.
const BROKEN = "/screens/critical-error-on-this-website.png";

const shot = (src: string, alt: string) => (
  <Image src={src} alt={alt} width={1600} height={1000} sizes="(min-width: 768px) 72rem, 92vw" className="w-full rounded-[14px]" />
);

/** The capture frame from MASTER.md, with the copy on it. */
const Framed = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-[14px] border border-line bg-surface-2 p-2 shadow-card">
    <div className="relative overflow-hidden rounded-[14px]">
      {children}
      <RestoredOverlay />
    </div>
  </div>
);

/**
 * The result: the same site, loading, with the section's words held on the frame rather than stacked
 * above and below it. The copy therefore does have to survive a scrim, which is why it sits on the
 * flat --photo-scrim in --text, the one pairing on this site measured for text over photography.
 */
export function Restored() {
  return (
    <section aria-labelledby="same-site" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <ZoomImage>
        {hasScreen(CAPTURE) && hasScreen(BROKEN) ? (
          // Both captures exist, so the visitor can do the repair themselves.
          <BeforeAfter
            label="Drag to compare the site before and after the fix"
            overlay={<RestoredOverlay />}
            before={shot(BROKEN, 'The same WordPress site showing "There has been a critical error on this website."')}
            after={shot(CAPTURE, "The same WordPress site loading normally again")}
          />
        ) : hasScreen(CAPTURE) ? (
          // Only the restored one: show it in the capture frame the MASTER specifies, the same frame
          // the error cards use, so the two read as one screen photographed twice.
          <Framed>{shot(CAPTURE, "The same WordPress site loading normally again")}</Framed>
        ) : (
          // The restored capture is one `npm run capture` away (docs/image-todo.md). Until then a real
          // frame stands in, with an empty alt: it is not a screen of your site and does not claim to
          // be. A lit screen, not the dark monitor this first used: under "Working again" an unlit
          // screen reads as the site still being down.
          <Framed>
            <div className="aspect-[16/10] overflow-hidden rounded-[14px]">
              <Photo id="store" decorative sizes="(min-width: 768px) 72rem, 92vw" />
            </div>
          </Framed>
        )}
      </ZoomImage>
    </section>
  );
}
