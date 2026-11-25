import { ImageResponse } from "next/og";
import { RasterMonogram, V4 } from "@/lib/brand-raster";

/**
 * The favicon. Replaces `favicon.ico`, which was the file `create-next-app` wrote and was never changed.
 *
 * 32px is the size a browser actually paints in a tab, so the monogram is drawn to fill it: the droplet is
 * taller than it is wide, so the width is what the box leaves after the padding, and the height follows.
 * No background plate, because the page behind a tab is the browser's, not ours; `--bg` here would be a
 * near-black square in a light tab strip.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: V4.bg }}>
        <RasterMonogram width={24} />
      </div>
    ),
    size,
  );
}
