"use client";

import { useState } from "react";
import Link from "next/link";
import { X, HelpCircle } from "lucide-react";

const tabs = [
  { id: "how-to-play", label: "게임 방법" },
  { id: "tips", label: "팁" },
  { id: "about", label: "소개" },
  { id: "privacy", label: "개인정보" },
  { id: "terms", label: "약관" },
];

export default function HelpModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState("how-to-play");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <div className="flex items-center gap-2 text-white">
            <HelpCircle className="h-5 w-5" />
            <span className="font-semibold">도움말</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-800/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 내용 */}
        <div className="overflow-y-auto p-5 text-sm text-slate-300">
          {activeTab === "how-to-play" && (
            <div className="space-y-3">
              <p>
                격자판 전체를 직사각형 영역으로 나눕니다. 각 영역 안에는 숫자가
                딱 하나, 영역 칸 수는 숫자와 같아야 합니다.
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>영역끼리 겹치면 안 됩니다.</li>
                <li>모든 칸을 채워야 합니다.</li>
                <li>직사각형/정사각형만 가능합니다.</li>
              </ul>
              <Link
                href="/how-to-play"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline"
              >
                자세한 게임 방법 →
              </Link>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-3">
              <ul className="list-inside list-disc space-y-1">
                <li>큰 숫자부터 먼저 처리하세요.</li>
                <li>모서리와 가장자리를 먼저 채우세요.</li>
                <li>힌트는 정말 막혔을 때만 사용하세요.</li>
                <li>틀리면 즉시 지우고 다시 시작하세요.</li>
              </ul>
              <Link
                href="/tips"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline"
              >
                더 많은 팁 보기 →
              </Link>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-3">
              <p>
                블록 매칭 게임은 Shikaku 퍼즐을 현대적으로 재해석한 모바일
                게임입니다. 3가지 난이도, 500개 이상의 레벨을 제공합니다.
              </p>
              <Link
                href="/about"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline"
              >
                더 알아보기 →
              </Link>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-3">
              <p>
                본 서비스는 최소한의 정본만 수집하며, Google AdSense/AdMob 등
                제3자 서비스를 사용할 수 있습니다.
              </p>
              <Link
                href="/privacy"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline"
              >
                개인정보처리방침 전문 →
              </Link>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-3">
              <p>
                본 서비스는 개인적인 비상업적 용도로 이용할 수 있습니다. 모든
                콘텐츠의 저작권은 개발자에게 있습니다.
              </p>
              <Link
                href="/terms"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline"
              >
                이용약관 전문 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
