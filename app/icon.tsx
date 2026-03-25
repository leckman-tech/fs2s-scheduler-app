import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #cf1728, #a70f1d)"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12
          }}
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: 186,
              fontWeight: 900,
              letterSpacing: "-0.12em",
              lineHeight: 0.9
            }}
          >
            FS2S
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase"
            }}
          >
            2026
          </div>
        </div>
      </div>
    ),
    size
  );
}
