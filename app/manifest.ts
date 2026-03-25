import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "From Silos to Solutions 2026",
    short_name: "FS2S 2026",
    description:
      "National convening in Washington, D.C. focused on coordinating supports for opportunity and justice-involved youth and young adults.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c1121f",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };
}
