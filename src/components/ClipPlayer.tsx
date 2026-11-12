"use client";

import { PlayIcon, XIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Clip } from "@/content/videos";

/**
 * A clip as its poster plus a play control, which opens the film in a modal.
 *
 * **Why a facade and not `video controls` on its own.** Native chrome is a different shape on every
 * browser and cannot be styled, so four cards in a row would not match each other, let alone the
 * frame around them. More usefully, there is no `video` element on the page at all until someone asks
 * for one: `preload="none"` still created the element and its poster request, where this renders an
 * optimised `next/image` and nothing else. The home page was measured at LCP 5.2s against contract
 * rule 13's 2.5s budget, and that is the reason this exists.
 *
 * **Why a modal rather than swapping in place.** A clip in its own card plays at the size of the card,
 * which on a phone is a 9:16 clip about 142px wide and a 16:9 film about 200px tall. The modal gives
 * every clip the viewport instead, and darkens the page behind it so the film is the only thing on
 * screen. The poster, the caption and the slot's reserved box are unchanged: only playback moved.
 *
 * **Why `ui/dialog` and not a hand-rolled overlay.** It is already in the bundle (`NavBar`,
 * `CommandPalette`, `ChatProvider`), so the modal costs no new vendor code, and it brings the focus
 * trap, Escape, the portal, the return of focus to the trigger and the body scroll lock with it.
 * Radix unmounts the content on close, which is also what stops playback: there is no pause to wire.
 *
 * Its defaults are v3 era, so three are overridden here rather than changed at the source, where
 * three other components depend on them: the 20px radius and the `rounded-full` close button both
 * break v4's 14px shape lock, and `top-[12dvh] max-w-xl` is a reading box, not a film.
 *
 * **How the box is guaranteed to fit.** One expression constrains both axes at once:
 *
 *     width: min(96vw, calc((100dvh - 7rem) * w / h))
 *
 * The first term caps the width against the viewport, the second caps the height by asking what width
 * that height allows at this clip's own ratio. Whichever is smaller wins, so the box can never exceed
 * either axis, in any orientation, for a 16:9 film and a 9:16 phone clip alike. `dvh` rather than `vh`
 * so a mobile browser's collapsing toolbar is counted. The 7rem is the close button, its gap and the
 * margins above and below. `max-h` and `max-w` repeat the same limits as a floor under the arithmetic,
 * and the video is `object-contain`, so a browser that disagrees about `dvh` letterboxes rather than
 * overflowing. Nothing here introduces page scroll in either axis: the dialog is portalled and fixed,
 * and the body behind it is locked while it is open.
 */
export function ClipPlayer({ clip, children }: { clip: Clip; children: ReactNode }) {
  const fit = {
    width: `min(96vw, calc((100dvh - 7rem) * ${clip.width} / ${clip.height}))`,
    aspectRatio: `${clip.width} / ${clip.height}`,
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Play: ${clip.alt}`}
          className="group relative block size-full cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {/* The poster, scaling inside the frame rather than the frame scaling on the page. A card
              that grows pushes against its neighbours in a four up row; the image moving under a fixed
              edge says the same thing and cannot shift anything. */}
          <span className="absolute inset-0 transition-[scale] duration-300 ease-(--motion-ease) [@media(hover:hover)]:group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:scale-100!">
            {children}
          </span>

          {/* The dark wash on hover. Opacity on a flat --bg layer, not a background-color transition,
              because contract rule 10 allows transform and opacity and nothing else. Kept through
              reduced motion: it is a colour change that says the card is live, not movement. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-bg opacity-0 transition-[opacity] duration-200 ease-(--motion-ease) [@media(hover:hover)]:group-hover:opacity-30"
          />

          {/* Visible at rest, the way a thumbnail with a play button is read at a glance, and it grows
              a little under the pointer. 44px below 768 and 56px above: at 375 a clip is 142px wide,
              where a 56px badge covers nearly 40% of the frame and reads as a button with a picture
              behind it rather than the other way round. */}
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[14px] bg-text text-bg shadow-card transition-[scale] duration-200 ease-(--motion-ease) md:size-14 [@media(hover:hover)]:group-hover:scale-105 group-active:scale-[0.97] motion-reduce:transition-none motion-reduce:scale-100!"
          >
            <PlayIcon weight="fill" className="size-5 translate-x-px md:size-6" />
          </span>
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="top-1/2 w-auto max-w-none -translate-y-1/2 overflow-visible rounded-none border-0 bg-transparent p-0 shadow-none"
      >
        {/* The dialog's accessible name. The film carries its own words on screen and its captions
            track, so a visible title above it would be the same sentence twice. */}
        <DialogTitle className="sr-only">{clip.alt}</DialogTitle>

        <div className="flex flex-col items-end gap-3">
          <DialogClose
            aria-label="Close the clip"
            className="grid size-11 cursor-pointer place-items-center rounded-[14px] border border-line bg-surface text-muted shadow-card transition-[scale] duration-200 ease-(--motion-ease) hover:text-text focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98] motion-reduce:transition-none motion-reduce:scale-100!"
          >
            <XIcon weight="duotone" className="size-5" aria-hidden />
          </DialogClose>

          <div
            style={fit}
            className="max-h-[calc(100dvh-7rem)] max-w-[96vw] overflow-hidden rounded-[14px] border border-line bg-bg shadow-card"
          >
            {/* autoPlay is legitimate here and only here: it follows a click on the trigger, so it is
                the visitor starting the clip rather than the page starting it at them. playsInline
                keeps iOS from taking the whole screen uninvited. */}
            <video
              autoPlay
              controls
              playsInline
              poster={clip.poster}
              width={clip.width}
              height={clip.height}
              aria-label={clip.alt}
              className="size-full object-contain"
            >
              <source src={clip.src} type="video/mp4" />
              <track kind="captions" src={clip.captions} srcLang="en" label="English" default />
            </video>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
