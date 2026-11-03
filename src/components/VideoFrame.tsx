import { FilmSlateIcon } from "@phosphor-icons/react/ssr";
import { videos, type Clip as ClipData, type VideoId } from "@/content/videos";
import { cn } from "@/lib/utils";

/**
 * A reserved video slot, in three layers so each host can take the one it needs.
 *
 * Server Components throughout: a <video controls> needs no client boundary, which keeps these out of
 * the bundle entirely and satisfies contract rule 2. There is no player library, no custom chrome and
 * no autoplay, so the slot costs nothing until someone presses play. That matters on the home page,
 * measured at LCP 5.2s against the contract's 2.5s budget.
 *
 * The frame is not new: it is the capture frame from MASTER.md, the same --surface-2 bezel with 14px
 * outside and 14px inside that Restored.tsx and the error cards already use, so a clip and a capture
 * read as the same device photographed twice.
 */

/** The clip itself, for a host that already owns a frame. */
export function Clip({ clip, className }: { clip: ClipData; className?: string }) {
  return (
    <video
      controls
      preload="none"
      poster={clip.poster}
      width={clip.width}
      height={clip.height}
      aria-label={clip.alt}
      className={cn("size-full object-cover", className)}
    >
      <source src={clip.src} type="video/mp4" />
      <track kind="captions" src={clip.captions} srcLang="en" label="English" default />
    </video>
  );
}

/**
 * The 16/10 box: the clip, or the empty state while there is no clip. 16/10 is the house media ratio,
 * matching the 1600x1000 captures, and the box is fixed so filling a slot later shifts nothing.
 *
 * The empty state is a dashed --line-strong border, which is this codebase's existing signal that
 * something is a placeholder (QuoteCarousel.tsx, case-studies/page.tsx). It carries an icon and no text:
 * the words belong to the caption under the frame, because contract rule 6 bans labels on images.
 */
export function VideoSlotBox({ id, className }: { id: VideoId; className?: string }) {
  const { clip } = videos[id];
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden rounded-[14px] bg-surface", className)}>
      {clip ? (
        <Clip clip={clip} />
      ) : (
        <div className="grid size-full place-items-center rounded-[14px] border border-dashed border-line-strong">
          <FilmSlateIcon weight="duotone" className="size-10 text-muted" aria-hidden />
        </div>
      )}
    </div>
  );
}

/**
 * The line under a slot: what will play there, and whether it has been filmed.
 *
 * Exported because the home page's quote cards render the box without the frame around it, and still
 * need this exact sentence. One definition rather than the same two branches written twice.
 */
export const videoCaption = (id: VideoId) => {
  const { label, clip } = videos[id];
  return clip ? `${label} ${clip.seconds} seconds.` : `${label} Not filmed yet.`;
};

/**
 * The box in the capture frame with its caption under it.
 *
 * The caption is the honest part. While a slot is empty it names what will play there and says it is
 * not filmed yet, so the page never shows a play affordance for a video that does not exist. It is also
 * the empty state's text alternative, which is why the icon above it is aria-hidden.
 */
export function VideoFrame({ id, className }: { id: VideoId; className?: string }) {
  return (
    <figure className={cn("overflow-hidden rounded-[14px] border border-line bg-surface-2 p-2 shadow-card", className)}>
      <VideoSlotBox id={id} />
      <figcaption className="px-2 pt-3 pb-1 text-sm text-muted">{videoCaption(id)}</figcaption>
    </figure>
  );
}
