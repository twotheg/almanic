"use client";

import { AdSlot, adsenseEnabled, BANNER_SLOT } from "@/components/adsense";

/**
 * Bottom bar-type ad.
 * - If NEXT_PUBLIC_ADSENSE_CLIENT + NEXT_PUBLIC_ADSENSE_BANNER_SLOT are set,
 *   a real AdSense banner is shown.
 * - Otherwise a built-in promo placeholder is shown so the layout is stable.
 */
export function BannerAd() {
  const showReal = adsenseEnabled && BANNER_SLOT;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[57px] z-30 flex justify-center bg-slate-950/90 px-2 py-1">
      {showReal ? (
        <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
          <AdSlot
            slot={BANNER_SLOT}
            style={{ display: "block", minHeight: 50 }}
          />
        </div>
      ) : (
        <div className="relative flex h-12 w-full max-w-md items-center justify-center gap-3 overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
          <span className="absolute left-1 top-1 rounded bg-slate-600 px-1 text-[8px] font-bold uppercase text-slate-300">
            Ad
          </span>
          <div className="flex gap-0.5">
            <span className="h-6 w-6 rounded-sm bg-yellow-400" />
            <span className="h-6 w-6 rounded-sm bg-purple-400" />
            <span className="h-6 w-6 rounded-sm bg-blue-400" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            블럭 매칭 게임 — 숫자에 맞춰 블럭을 나눠요!
          </p>
        </div>
      )}
    </div>
  );
}
