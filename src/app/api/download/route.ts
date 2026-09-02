import JSZip from "jszip";
import { NextResponse } from "next/server";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const EXCLUDED = [
  "node_modules",
  ".next",
  "dist",
  ".git",
  ".env.local",
  "npm-debug.log",
  "yarn-error.log",
  ".DS_Store",
  "Thumbs.db",
];

async function addDirectory(zip: JSZip, dir: string, root: string) {
  const entries = await readdir(dir);

  for (const entry of entries) {
    if (EXCLUDED.includes(entry)) continue;

    const fullPath = path.join(dir, entry);
    const relativePath = path.relative(root, fullPath);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      await addDirectory(zip, fullPath, root);
    } else {
      const content = await readFile(fullPath);
      zip.file(relativePath, content);
    }
  }
}

export async function GET() {
  try {
    const root = process.cwd();
    const zip = new JSZip();
    await addDirectory(zip, root, root);

    const buffer = await zip.generateAsync({ type: "arraybuffer" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="almanic-source.zip"',
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate source archive" },
      { status: 500 }
    );
  }
}
