import { ImageResponse } from "next/og";
import type { Problem } from "@/content/schema";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

// Minimal on purpose: the variation prompts restyle this with the chosen type and layout.
export function problemOg(p: Problem) {
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
          background: "#ffffff",
          borderTop: `16px solid ${site.colors.primary}`,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#111111", lineHeight: 1.1 }}>{p.h1}</div>
        <div style={{ fontSize: 32, color: "#444444" }}>{site.name}</div>
      </div>
    ),
    ogSize,
  );
}
