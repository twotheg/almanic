"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { PartyPopper } from "lucide-react";

const STORAGE_KEY = "almanic-tutorial-done";

interface Step {
  target: string;
  title: string;
  desc: string;
  fingerBelow: boolean;
}

const STEPS: Step[] = [
  {
    target: "board",
    title: "1단계 · 숫자의 의미",
    desc: "그림 속 숫자는 '이 숫자만큼의 칸으로 직사각형을 만들라'는 뜻이에요. 10이면 10칸짜리 직사각형!",
    fingerBelow: true,
  },
  {
    target: "palette",
    title: "2단계 · 색 고르기",
    desc: "팔레트에서 색을 선택해요. 색 하나 = 직사각형 하나! 이미 사용 중인 색에는 흰 점이 찍혀요.",
    fingerBelow: false,
  },
  {
    target: "board",
    title: "3단계 · 드래그로 칠하기",
    desc: "모서리를 누르고 반대쪽 모서리까지 손가락으로 드래그하면 사각형이 한 번에 칠해져요.",
    fingerBelow: true,
  },
  {
    target: "actions",
    title: "4단계 · 도구",
    desc: "Undo = 되돌리기, Reset = 처음부터, Hint = 광고 시청 후 직사각형 전체 공개!",
    fingerBelow: false,
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function Tutorial() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [showEnd, setShowEnd] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setActive(true);
    } catch {
      setActive(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (!active || showEnd) return;

    const measure = (withScroll: boolean) => {
      const el = document.querySelector(
        `[data-tut="${STEPS[step].target}"]`
      );
      if (!el) return;
      // Bring off-screen targets (palette, lower part of board) into view
      if (withScroll && STEPS[step].target !== "actions") {
        el.scrollIntoView({ block: "center" });
      }
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const minTop = 200; // stay below the explanation card
        const maxBottom = vh - 16;

        let top = Math.max(r.top, minTop);
        let bottom = Math.min(r.bottom, maxBottom);
        if (bottom - top < 120) {
          const c = (top + bottom) / 2;
          top = Math.max(minTop, c - 60);
          bottom = Math.min(maxBottom, c + 60);
        }
        setRect({
          top,
          left: r.left,
          width: r.width,
          height: bottom - top,
        });
      });
    };

    measure(true);
    const onMove = () => measure(false);
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove);
    };
  }, [active, step, showEnd]);

  if (!active) return null;

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setActive(false);
  };

  if (showEnd) {
    return (
      <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
            <PartyPopper size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">튜토리얼 완료!</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            이제 숫자에 맞춰 블럭을 나누는
            <br />
            여정을 시작해 볼까요?
          </p>
          <button
            type="button"
            onClick={finish}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-500"
          >
            게임 시작하기
          </button>
        </div>
      </div>
    );
  }

  const s = STEPS[step];
  const pad = 6;
  const hole = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const rawFingerTop = hole
    ? s.fingerBelow
      ? hole.top + hole.height - 10
      : hole.top - 46
    : 0;
  const fingerTop = hole
    ? Math.min(Math.max(rawFingerTop, 200), vh - 60)
    : 0;
  const fingerLeft = hole ? hole.left + hole.width / 2 - 20 : 0;

  return (
    <div className="fixed inset-0 z-[90]">
      {hole ? (
        <div
          className="absolute rounded-2xl transition-all duration-300"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.85)",
            border: "2px solid #818cf8",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-950/85" />
      )}

      {hole && (
        <div
          className="pointer-events-none absolute z-10 animate-bounce text-4xl drop-shadow-lg"
          style={{ top: fingerTop, left: fingerLeft }}
        >
          👆
        </div>
      )}

      <div className="absolute inset-x-4 top-4 z-20 rounded-2xl border border-indigo-500/40 bg-slate-900/95 p-5 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">{s.title}</h3>
          <span className="text-xs text-slate-400">
            {step + 1} / {STEPS.length}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={[
                  "h-1.5 w-1.5 rounded-full",
                  i === step ? "bg-indigo-400" : "bg-slate-600",
                ].join(" ")}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={finish}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
            >
              건너뛰기
            </button>
            <button
              type="button"
              onClick={() => {
                if (step < STEPS.length - 1) setStep(step + 1);
                else setShowEnd(true);
              }}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-500"
            >
              {step < STEPS.length - 1 ? "다음" : "이해했어요"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
