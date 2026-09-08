"use client";

import { useEffect } from "react";

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
export const BANNER_SLOT = process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT ?? "";
export const REWARDED_SLOT = process.env.NEXT_PUBLIC_ADSENSE_REWARDED_SLOT ?? "";

export const adsenseEnabled =
  typeof ADSENSE_CLIENT === "string" && ADSENSE_CLIENT.startsWith("ca-pub-");

interface AdSlotProps {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
  format?: string;
  fullWidthResponsive?: boolean;
}

/**
 * Renders a real Google AdSense unit. The adsbygoogle script is loaded
 * statically in app/layout.tsx when NEXT_PUBLIC_ADSENSE_CLIENT is set.
 */
export function AdSlot({
  slot,
  className,
  style,
  format = "auto",
  fullWidthResponsive = true,
}: AdSlotProps) {
  useEffect(() => {
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // ad blocked or script not ready — ignore
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`}
      style={style ?? { display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
