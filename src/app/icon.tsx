import { ImageResponse } from "next/og";
import { RasterMonogram } from "@/lib/brand-raster";

/**
 * The favicon. Replaced the file `create-next-app` wrote, which was never changed.
 *
 * 32px is the size a browser actually paints in a tab, so the monogram is drawn to fill it: the droplet is
 * taller than it is wide, so the width is what the box leaves after the padding, and the height follows.
 * No background plate, because the page behind a tab is the browser's, not ours; `--bg` here would be a
 * near-black square in a light tab strip. The code said otherwise until Task 107, which set `--bg` on this
 * div while the paragraph above forbade it.
 *
 * **`src/app/favicon.ico` sits beside this and is not a leftover.** This route answers the `<link rel="icon">`
 * Next emits; a bare `GET /favicon.ico`, which feed readers, bookmark services and link-preview crawlers
 * still send without reading the document, answers from that file. Deleting the generated one left that
 * request 404ing. It carries the same monogram at the same 24-in-32 composition, drawn from `MONOGRAM_D`,
 * so the two cannot disagree; regenerate it if the path or the accent changes.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RasterMonogram width={24} />
      </div>
    ),
    size,
  );
}
