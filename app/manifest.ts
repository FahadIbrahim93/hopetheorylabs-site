import type { MetadataRoute } from "next";

// Static web app manifest (docs/BRAND.md, Identity). Icons live in public/icons/.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hope Theory Labs",
    short_name: "HTL",
    description: "Founder-led, AI-first studio in Dhaka: AI Audit and forward-deployed AI engineering.",
    start_url: "/",
    display: "browser",
    background_color: "#07090C",
    theme_color: "#0F1B2D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
