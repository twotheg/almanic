import { db } from "@/db";
import { progressTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!deviceId) {
    return NextResponse.json({ error: "deviceId required" }, { status: 400 });
  }

  const rows = await db
    .select({ levelId: progressTable.levelId, bestTimeSeconds: progressTable.bestTimeSeconds })
    .from(progressTable)
    .where(eq(progressTable.deviceId, deviceId));

  return NextResponse.json({ progress: rows });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, levelId, bestTimeSeconds } = body;

  if (!deviceId || typeof levelId !== "number") {
    return NextResponse.json({ error: "deviceId and levelId required" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(progressTable)
    .where(and(eq(progressTable.deviceId, deviceId), eq(progressTable.levelId, levelId)))
    .limit(1);

  if (existing.length > 0) {
    const currentBest = existing[0].bestTimeSeconds;
    const shouldUpdate =
      bestTimeSeconds !== undefined &&
      (currentBest === null || bestTimeSeconds < currentBest);

    if (shouldUpdate) {
      await db
        .update(progressTable)
        .set({ bestTimeSeconds, completedAt: new Date() })
        .where(and(eq(progressTable.deviceId, deviceId), eq(progressTable.levelId, levelId)));
    }
  } else {
    await db.insert(progressTable).values({
      deviceId,
      levelId,
      bestTimeSeconds: bestTimeSeconds ?? null,
      completedAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
