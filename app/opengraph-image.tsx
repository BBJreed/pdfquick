import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4efe6",
          color: "#16141c",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#d32616",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Q
          </div>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, maxWidth: 900 }}>
            Fix a PDF in 10 seconds.
          </div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#5e584f" }}>
            No watermark. Files never leave your browser.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
