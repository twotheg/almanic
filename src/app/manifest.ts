import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "블럭 매칭 게임",
    short_name: "블럭매칭",
    description:
      "숫자에 맞춰 블럭을 사각형으로 나누는 논리 퍼즐! 간단하고 똑똑한 챌린지로 사고력을 날카롭게. 3가지 모드, 500 레벨.",
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
