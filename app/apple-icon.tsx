import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          border: "16px solid #c1121f",
          borderRadius: 36
        }}
      >
        <div
          style={{
            color: "#c1121f",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.1em",
            lineHeight: 1
          }}
        >
          FS2S
        </div>
      </div>
    ),
    size
  );
}
