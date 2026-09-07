import JSZip from "jszip";
import { NextRequest, NextResponse } from "next/server";

/**
 * Downloads store-ready assets (icons + screenshot) as a single ZIP.
 * Works on any host (sandbox preview, Vercel) because files are fetched
 * over HTTP from the app's own origin instead of the filesystem.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  const files = [
    { name: "icon-512x512.png", path: "/icons/icon-512x512.png" },
    { name: "icon-192x192.png", path: "/icons/icon-192x192.png" },
    { name: "feature-graphic-1024x500.png", path: "/store/feature-graphic-1024x500.png" },
    { name: "screenshot-game.png", path: "/screenshots/game-screen.png" },
  ];

  const zip = new JSZip();

  await Promise.all(
    files.map(async (file) => {
      const res = await fetch(`${origin}${file.path}`);
      if (!res.ok) return;
      const buffer = await res.arrayBuffer();
      zip.file(file.name, buffer);
    })
  );

  const output = await zip.generateAsync({ type: "arraybuffer" });

  return new NextResponse(output, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition":
        'attachment; filename="block-matching-store-assets.zip"',
    },
  });
}
