"use client";

import { PlayIcon } from "@phosphor-icons/react/ssr";
import { useState, type ReactNode } from "react";
import type { Clip } from "@/content/videos";

/**
 * A clip as its poster plus a play control, which becomes a real player on the first click.
 *
 * **Why a facade and not `video controls` on its own.** Native chrome is a different shape on every
 * browser and cannot be styled, so four cards in a row would not match each other, let alone the
 * frame around them. More usefully, this way there is no `video` element on the page at all until
 * someone asks for one: `preload="none"` still created the element and its poster request, where this
 * renders an optimised `next/image` and nothing else. On the pages this now sits on, that is four
 * fewer media elements under the LCP budget (contract rule 13).
 *
 * **The only client component in this feature, and it is a leaf.** It holds one boolean. The poster is
 * rendered on the server and handed in as a node, the way ExpandingRows takes its `image`, so nothing
 * from src/content/videos.ts is pulled into the bundle (contract rule 2).
 *
 * **The badge is a 14px square, not a circle.** Every other corner on this site is 14px and MASTER's
 * shape lock bans pills and any other radius by name, so a round play button would be the one circle
 * in the design system. A filled triangle in a rounded square reads as play without spending that.
 *
 * Accessibility: one real `button` covering the whole frame, named after what the clip shows, so a
 * screen reader hears "Play: a client on the morning her checkout stopped" rather than "play". After
 * the swap the native controls take over, which are keyboard operable and carry the captions track.
 * The scrim and the badge are `aria-hidden`; they repeat what the button already says.
 */
export function ClipPlayer({ clip, children }: { clip: Clip; children: ReactNode }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      // autoPlay is legitimate here and only here: it follows a click on this exact control, so it is
      // the visitor starting the clip rather than the page starting it at them. playsInline keeps iOS
      // from taking the whole screen uninvited.
      <video
        autoPlay
        controls
        playsInline
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        aria-label={clip.alt}
        className="size-full object-cover"
      >
        <source src={clip.src} type="video/mp4" />
        <track kind="captions" src={clip.captions} srcLang="en" label="English" default />
      </video>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${clip.alt}`}
      className="group relative block size-full cursor-pointer overflow-hidden"
    >
      {/* The poster, scaling inside the frame rather than the frame scaling on the page. A card that
          grows pushes against its neighbours in a four up row; the image moving under a fixed edge
          says the same thing and cannot shift anything. */}
      <span className="absolute inset-0 transition-[scale] duration-300 ease-(--motion-ease) [@media(hover:hover)]:group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:scale-100!">
        {children}
      </span>

      {/* The dark wash on hover. Opacity on a flat --bg layer, not a background-color transition,
          because contract rule 10 allows transform and opacity and nothing else. Kept through reduced
          motion: it is a colour change that says the card is live, not movement. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-bg opacity-0 transition-[opacity] duration-200 ease-(--motion-ease) [@media(hover:hover)]:group-hover:opacity-30"
      />

      {/* Visible at rest, the way a thumbnail with a play button is read at a glance, and it grows a
          little under the pointer. shadow-card rather than a ring, so the badge separates from a
          bright frame without inventing a shadow MASTER does not have.

          44px below 768 and 56px above. At 375 a clip is 142px wide, where a 56px badge covers nearly
          40% of the frame and reads as a button with a picture behind it rather than the other way
          round. 44 is the floor rather than a smaller number because contract rule 5 sets it, though
          the real tap target here is the whole card. */}
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[14px] bg-text text-bg shadow-card transition-[scale] duration-200 ease-(--motion-ease) md:size-14 [@media(hover:hover)]:group-hover:scale-105 group-active:scale-[0.97] motion-reduce:transition-none motion-reduce:scale-100!"
      >
        <PlayIcon weight="fill" className="size-5 translate-x-px md:size-6" />
      </span>
    </button>
  );
}
