import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "블럭 매칭 게임 - Shikaku Puzzle",
  description:
    "숫자에 맞춰 블럭을 사각형으로 나누는 논리 퍼즐! 간단하고 똑똑한 챌린지로 사고력을 날카롭게. 3가지 모드, 500 레벨.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "블럭매칭",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#020617",
  viewportFit: "cover",
  colorScheme: "dark",
};

import { ServiceWorkerRegister } from "@/components/service-worker-register";

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="bg-slate-950">
      <head>
        {adsenseClient && adsenseClient.startsWith("ca-pub-") && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
