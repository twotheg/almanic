"use client";

import { useState } from "react";
import Link from "next/link";
import { X, HelpCircle } from "lucide-react";

const tabs = [
  { id: "how-to-play", label: "게임 방법" },
  { id: "tips", label: "팁 및 공략" },
  { id: "about", label: "게임 소개" },
  { id: "privacy", label: "개인정보" },
  { id: "terms", label: "이용약관" },
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
            <span className="font-semibold">게임 가이드 및 도움말</span>
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
        <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-800/50 scrollbar-hide">
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
        <div className="overflow-y-auto p-5 text-sm text-slate-300 leading-relaxed">
          {activeTab === "how-to-play" && (
            <div className="space-y-4">
              <p>
                <strong>블록 매칭 게임에 오신 것을 환영합니다!</strong><br />
                이 게임은 숫자 규칙에 따라 격자판 전체를 빈틈없이 직사각형 또는 정사각형 영역으로 나누는 논리 퍼즐입니다. 직관적이지만 깊은 사고력을 요구합니다.
              </p>
              <h4 className="font-semibold text-white">핵심 규칙:</h4>
              <ul className="list-inside list-disc space-y-2">
                <li><strong>숫자의 의미:</strong> 격자판 위에 있는 각 숫자는 해당 블록이 포함해야 하는 정확한 넓이(칸의 개수)를 의미합니다.</li>
                <li><strong>영역 나누기:</strong> 숫자를 포함하여 가로 세로로 드래그해 직사각형을 만드세요. 예를 들어 '6'은 1x6, 2x3 형태의 사각형으로 나눌 수 있습니다.</li>
                <li><strong>1구역 1숫자:</strong> 만들어진 영역 안에는 반드시 단 하나의 숫자만 포함되어야 합니다. 숫자가 두 개 이상 들어가거나 아예 없는 영역은 허용되지 않습니다.</li>
                <li><strong>중복 및 빈칸 불가:</strong> 영역끼리 서로 겹쳐서는 안 되며, 격자판 위의 모든 칸이 색칠된 사각형으로 꽉 채워져야 스테이지가 클리어됩니다.</li>
              </ul>
              <Link
                href="/how-to-play"
                onClick={onClose}
                className="inline-block mt-2 text-indigo-400 hover:underline"
              >
                상세 튜토리얼 문서 확인하기 →
              </Link>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-4">
              <p>퍼즐을 더 빠르고 논리적으로 풀기 위한 핵심 전략입니다.</p>
              <ul className="list-inside list-disc space-y-2">
                <li><strong>큰 숫자부터 공략하기:</strong> '12', '10'과 같이 면적이 넓은 큰 숫자들은 보드에서 차지할 수 있는 경우의 수가 상대적으로 적습니다. 이들을 먼저 고정하면 나머지 구역의 윤곽이 쉽게 드러납니다.</li>
                <li><strong>가장자리와 모서리 활용:</strong> 격자판의 구석에 있는 숫자는 뻗어나갈 수 있는 방향이 매우 제한적입니다. 이곳을 가장 먼저 분석하고 색칠하세요.</li>
                <li><strong>소수(Prime Number) 찾기:</strong> '5', '7'과 같은 숫자는 무조건 1x5, 1x7 형태로 1열 배치만 가능합니다. 이를 기준점 삼아 풀이를 전개하세요.</li>
                <li><strong>힌트 기능 적극 활용:</strong> 진행이 완전히 막혔을 경우, 하단의 힌트(Hint) 버튼을 사용하여 현재 상황에서 가장 확실한 다음 스텝을 가이드 받을 수 있습니다.</li>
              </ul>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-4">
              <p>
                <strong>Shikaku Puzzle 기반의 두뇌 트레이닝 게임</strong><br />
                블록 매칭 게임은 고전적인 종이 퍼즐인 Shikaku를 현대적인 웹 환경에 맞춰 재해석한 작품입니다. 
              </p>
              <p>
                사용자의 논리적 사고력과 공간 지각 능력을 향상시키기 위해 기획되었으며, 초보자를 위한 Easy 모드부터 극한의 두뇌 회전이 필요한 Hard 모드까지 총 500개 이상의 다채로운 레벨을 무료로 제공합니다. 지속적인 업데이트를 통해 새로운 레벨과 기능이 추가될 예정입니다.
              </p>
              <Link
                href="/about"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline"
              >
                개발자 노트 및 업데이트 내역 보기 →
              </Link>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <p>
                본 게임은 플레이어의 원활한 게임 환경 제공과 맞춤형 서비스 운영을 위해 최소한의 비식별 데이터만을 수집합니다. 민감한 개인정보는 일체 요구하거나 저장하지 않습니다.
              </p>
              <p>
                또한 무료 서비스 유지를 위해 Google AdSense 및 파트너사의 맞춤형 광고가 게재될 수 있으며, 이 과정에서 쿠키(Cookie) 기술이 사용될 수 있습니다. 자세한 내용은 전문을 통해 확인하실 수 있습니다.
              </p>
              <Link
                href="/privacy"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline font-semibold"
              >
                개인정보처리방침 전문 읽기 →
              </Link>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <p>
                본 서비스는 개인적인 비상업적 용도로 언제든지 무료로 이용하실 수 있습니다. 게임 내에 포함된 그래픽 요소, 알고리즘, 소스 코드 등 모든 콘텐츠의 지적재산권 및 저작권은 서비스 개발자에게 귀속됩니다.
              </p>
              <p>
                허가 없는 무단 복제, 배포 및 상업적 이용은 엄격히 금지됩니다.
              </p>
              <Link
                href="/terms"
                onClick={onClose}
                className="inline-block text-indigo-400 hover:underline font-semibold"
              >
                서비스 이용약관 전문 읽기 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
