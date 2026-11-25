import { ImageResponse } from "next/og";
import { RasterMonogram, V4 } from "@/lib/brand-raster";

/**
 * The touch icon, for a site saved to a home screen.
 *
 * 180px is the size iOS asks for. This one does carry `--bg`, unlike the favicon: a home screen icon is a
 * tile with its own corners, so the page colour is the tile and the drop sits on it.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: V4.bg }}>
        <RasterMonogram width={104} />
      </div>
    ),
    size,
  );
}
