import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "블록 매칭 게임 (Shikaku Puzzle) - 두뇌 트레이닝 논리 퍼즐",
  description:
    "직사각형과 정사각형을 활용하여 빈칸 없이 보드를 채우는 고전 논리 퍼즐 게임입니다. Easy, Medium, Hard 3가지 난이도와 500개 이상의 다채로운 레벨을 통해 공간 지각 능력과 논리적 사고력을 향상시켜 보세요. 언제 어디서나 무료로 즐길 수 있습니다.",
  keywords: [
    "블록 매칭", "퍼즐 게임", "논리 퍼즐", "Shikaku", "두뇌 게임", 
    "무료 웹 게임", "두뇌 트레이닝", "숫자 퍼즐", "킬링타임 게임"
  ],
  openGraph: {
    title: "블록 매칭 게임 - 두뇌 트레이닝 논리 퍼즐",
    description: "500개 이상의 레벨! 숫자에 맞춰 사각형을 그리고 보드를 채우는 중독성 강한 논리 퍼즐 게임을 지금 무료로 즐겨보세요.",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "블록매칭게임",
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
