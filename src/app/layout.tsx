import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Almanic - Shikaku Puzzle",
  description:
    "A minimalist Shikaku brain puzzle. Divide the grid into rectangles matching the numbers. 100 levels of logic, focus, and fun.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "The Almanic",
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
  themeColor: "#0f172a",
};

import { ServiceWorkerRegister } from "@/components/service-worker-register";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
