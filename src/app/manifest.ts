import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Almanic - Shikaku Puzzle",
    short_name: "Almanic",
    description:
      "A minimalist Shikaku brain puzzle. Divide the grid into rectangles matching the numbers. 100 levels of logic, focus, and fun.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/game-screen.png",
        sizes: "512x1024",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/game-screen.png",
        sizes: "1024x512",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    categories: ["games", "puzzle", "education"],
    lang: "ko",
  };
}
