import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "블록 매칭 게임 - Shikaku Puzzle",
  description:
    "숫자에 맞춰 블록을 나누는 논리 퍼즐 게임. Easy, Medium, Hard 3가지 난이도, 500개 이상의 레벨을 즐겨보세요.",
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-white">
              블록 매칭 게임
            </Link>
            <nav className="flex items-center gap-1 overflow-x-auto text-sm">
              {[
                { href: "/", label: "플레이" },
                { href: "/how-to-play", label: "방법" },
                { href: "/tips", label: "팁" },
                { href: "/about", label: "소개" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap rounded-md px-3 py-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-5xl">{children}</div>

        <footer className="mt-16 border-t border-slate-800 bg-slate-900 px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <h3 className="mb-2 font-semibold text-white">블록 매칭 게임</h3>
                <p className="text-sm text-slate-400">
                  숫자에 맞춰 블록을 나누는 논리 퍼즐 게임
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white">바로가기</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>
                    <Link href="/how-to-play" className="hover:text-white">
                      게임 방법
                    </Link>
                  </li>
                  <li>
                    <Link href="/tips" className="hover:text-white">
                      팁과 공략
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white">
                      소개
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-white">정책</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>
                    <Link href="/privacy" className="hover:text-white">
                      개인정보처리방침
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white">
                      이용약관
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500">
              © {new Date().getFullYear()} 블록 매칭 게임. All rights reserved.
            </p>
          </div>
        </footer>

        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
