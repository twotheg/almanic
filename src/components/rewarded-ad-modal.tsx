"use client";

import { useEffect, useState } from "react";
import { Lightbulb, X } from "lucide-react";

interface RewardedAdModalProps {
  open: boolean;
  onReward: () => void;
  onClose: () => void;
}

const AD_SECONDS = 5;

export function RewardedAdModal({ open, onReward, onClose }: RewardedAdModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(AD_SECONDS);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(AD_SECONDS);
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  if (!open) return null;

  const ready = secondsLeft === 0;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between bg-slate-800 px-4 py-2">
          <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">
            AD
          </span>
          <span className="text-xs text-slate-400">
            {ready ? "보상을 받을 수 있어요" : `광고 종료까지 ${secondsLeft}초`}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ad"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Ad creative placeholder. Replace this block with a real ad unit
            (e.g. Google AdSense / AdMob via TWA) when credentials are ready. */}
        <div className="relative flex h-56 flex-col items-center justify-center gap-3 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 px-6 text-center">
          <div className="grid grid-cols-3 gap-1">
            <span className="h-8 w-8 rounded bg-yellow-400" />
            <span className="h-8 w-8 rounded bg-green-400" />
            <span className="h-8 w-8 rounded bg-blue-400" />
            <span className="col-span-2 h-8 rounded bg-red-400" />
            <span className="h-8 w-8 rounded bg-purple-300" />
          </div>
          <p className="text-lg font-black text-white drop-shadow">블럭 매칭 게임</p>
          <p className="text-xs font-medium text-white/90">
            숫자에 맞춰 블럭을 나누는 퍼즐! 지금 무료 플레이
          </p>
        </div>

        <div className="p-4">
          <button
            type="button"
            disabled={!ready}
            onClick={onReward}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors",
              ready
                ? "bg-green-500 text-white hover:bg-green-400"
                : "cursor-not-allowed bg-slate-700 text-slate-400",
            ].join(" ")}
          >
            <Lightbulb size={16} />
            {ready ? "광고 시청 완료 — 힌트 받기" : `광고 시청 중... ${secondsLeft}s`}
          </button>
        </div>
      </div>
    </div>
  );
}
