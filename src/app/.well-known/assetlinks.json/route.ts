import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.twotheg.mygame_block_matching",
          sha256_cert_fingerprints: [
            "3A:3A:48:96:C3:E6:76:A6:81:43:41:41:A7:4B:B7:0E:3D:D2:F3:C1:B5:9C:8C:AF:C8:51:29:14:E3:0F:35:FA",
            "D8:D9:0C:BA:8F:8A:67:D6:BD:42:1E:66:52:26:38:13:EA:34:D3:BA:4C:DF:8A:42:E4:F9:A3:FB:25:4E:5A:8B"
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
