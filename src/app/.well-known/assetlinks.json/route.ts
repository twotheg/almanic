import { NextResponse } from "next/server";

/**
 * Digital Asset Links file required for publishing a PWA on Google Play
 * as a Trusted Web Activity (TWA). After building the signed app bundle
 * with Bubblewrap, replace package_name and sha256_cert_fingerprints
 * with the values from `bubblewrap fingerprint` / your Play signing key.
 */
export function GET() {
  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.almanic.brainpuzzle",
          sha256_cert_fingerprints: [
            "REPLACE_WITH_YOUR_UPLOAD_KEY_SHA256_FINGERPRINT",
          ],
        },
      },
    ],
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
