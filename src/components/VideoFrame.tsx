import { FilmSlateIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { ClipPlayer } from "@/components/ClipPlayer";
import { videos, type Clip as ClipData, type VideoId } from "@/content/videos";
import { hasScreen } from "@/components/Photo";
import { cn } from "@/lib/utils";

/**
 * A reserved video slot, in two layers so each host can take the one it needs.
 *
 * Server Components except the one leaf that has to hold a boolean: the poster and the frame are
 * rendered here, and `ClipPlayer` swaps in a real player on the first click (contract rule 2). There is
 * no player library. Until someone presses play the slot is one optimised image and no media element
 * at all, which is what the home page needed, measured at LCP 5.2s against the contract's 2.5s budget.
 *
 * The frame is not new: it is the capture frame from MASTER.md, the same --surface-2 bezel with 14px
 * outside and 14px inside that Restored.tsx and the error cards already use, so a clip and a capture
 * read as the same device photographed twice.
 */

/**
 * The capture frame from MASTER.md, as one string: `--surface-2` bezel, `p-2`, 14px outside and 14px
 * inside, `border-line`, `--shadow-card`. Same frame `Restored.tsx` has inline and the error cards use.
 *
 * **Do not import this into a client component.** This file reaches `node:fs` through `Photo.tsx`'s
 * `hasScreen`, which is right for a Server Component checking what is on disk and fatal for a client
 * one: Turbopack fails the production build with "the chunking context does not support external
 * modules (request: node:fs)", and neither `tsc` nor `eslint` sees it coming. If a client component
 * ever needs this string, move it to a module of its own rather than importing it from here.
 */
export const frameShell = "overflow-hidden rounded-[14px] border border-line bg-surface-2 p-2 shadow-card";

/**
 * The clip for a slot, but only if its files are actually on disk.
 *
 * One definition, because the box and the caption have to agree. If the box checked the filesystem and
 * the caption only checked for a non-null `clip`, a slot whose paths were written in ahead of the files
 * landing would render a dashed empty box under the words "28 seconds", which is worse than either
 * state on its own. Both read this.
 */
const playable = (id: VideoId): ClipData | null => {
  const { clip } = videos[id];
  if (!clip) return null;
  return hasScreen(clip.src) && hasScreen(clip.poster) ? clip : null;
};

/**
 * The slot's reserved box: the clip, or the empty state while there is no clip. The shape comes from
 * the slot rather than from here, because the two kinds of clip are not the same shape: 16/10 for the
 * captures, 9/16 for a client holding a phone. Either way the box is fixed before the file loads, so
 * filling a slot later shifts nothing. Written as two whole class strings because Tailwind reads
 * source text and cannot see `aspect-[${ratio}]`.
 *
 * `hasScreen` is the same existence gate Restored.tsx runs its captures through, applied here to the
 * clip and the poster. A slot whose paths are written in but whose files are not on disk falls back to
 * the empty state instead of shipping a player with a broken source and a black poster. That is the
 * difference between a slot being filled and a clip existing, and only the filesystem knows.
 *
 * The empty state is a dashed --line-strong border, which is this codebase's existing signal that
 * something is a placeholder (case-studies/page.tsx, the service page quote). It carries an icon and no text:
 * the words belong to the caption under the frame, because contract rule 6 bans labels on images.
 */
export function VideoSlotBox({
  id,
  sizes = "(min-width: 768px) 25vw, 50vw",
  className,
}: {
  id: VideoId;
  /** What width the poster will be asked to fill. The default suits a four up wall of clips. */
  sizes?: string;
  className?: string;
}) {
  const clip = playable(id);
  const { ratio } = videos[id];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] bg-surface",
        ratio === "9/16" ? "aspect-[9/16]" : ratio === "16/9" ? "aspect-[16/9]" : "aspect-[16/10]",
        className,
      )}
    >
      {clip ? (
        <ClipPlayer clip={clip}>
          <Image
            src={clip.poster}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
          />
        </ClipPlayer>
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
  const { label } = videos[id];
  const clip = playable(id);
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
    <figure className={cn(frameShell, className)}>
      <VideoSlotBox id={id} sizes="(min-width: 1024px) 1152px, 100vw" />
      <figcaption className="px-2 pt-3 pb-1 text-sm text-muted">{videoCaption(id)}</figcaption>
    </figure>
  );
}
