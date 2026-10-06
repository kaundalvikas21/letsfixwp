import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const ogSize = { width: 1200, height: 630 };

// Minimal on purpose: each variation restyles this with its own type and layout.
export function ogImage(title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#FAFAFA",
          borderTop: `16px solid ${brand.accent}`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#18181B", lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 32, color: "#52525B" }}>{brand.name}</div>
      </div>
    ),
    ogSize,
  );
}
