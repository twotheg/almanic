import { db } from "@/db";
import { pushSubscriptionsTable } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT;

if (publicKey && privateKey && subject) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function POST(request: NextRequest) {
  if (!publicKey || !privateKey || !subject) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { title, message, tag, url } = body;

  const payload = JSON.stringify({
    title: title ?? "The Almanic",
    body: message ?? "Time for a brain workout!",
    tag: tag ?? "almanic-reminder",
    url: url ?? "/",
  });

  const subscriptions = await db.select().from(pushSubscriptionsTable);

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      )
    )
  );

  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({
    sent: subscriptions.length - failed,
    failed,
    total: subscriptions.length,
  });
}
