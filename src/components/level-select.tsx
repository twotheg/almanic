"use client";

import { MODES, MODE_ORDER, getDifficultyColor, type Mode } from "@/lib/levels";
import { Lock, Check } from "lucide-react";

interface LevelSelectProps {
  mode: Mode;
  currentLevel: number;
  completed: Set<number>;
  onSelect: (level: number) => void;
  onModeChange: (mode: Mode) => void;
}

export function LevelSelect({
  mode,
  currentLevel,
  completed,
  onSelect,
  onModeChange,
}: LevelSelectProps) {
  const cfg = MODES[mode];
  const levels = Array.from({ length: cfg.count }, (_, i) => i + 1);

  let maxCompleted = 0;
  for (const lvl of completed) {
    if (lvl > maxCompleted) maxCompleted = lvl;
  }
  const unlockedUpTo = Math.min(cfg.count, maxCompleted + 1);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex justify-center gap-1.5">
        {MODE_ORDER.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={[
              "rounded-full px-3 py-1 text-xs font-bold transition-colors",
              m === mode
                ? "text-white"
                : "bg-slate-800 text-slate-400 hover:text-white",
            ].join(" ")}
            style={m === mode ? { backgroundColor: getDifficultyColor(m) } : undefined}
          >
            {MODES[m].label} {MODES[m].sub}
          </button>
        ))}
      </div>

      <h2 className="mb-1 text-center text-xl font-bold text-white">Select Level</h2>
      <p className="mb-4 text-center text-sm text-slate-400">
        {completed.size} / {cfg.count} cleared
      </p>

      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
        {levels.map((level) => {
          const isLocked = level > unlockedUpTo && !completed.has(level);
          const isCompleted = completed.has(level);
          const isCurrent = level === currentLevel;
          const diffColor = getDifficultyColor(mode);

          return (
            <button
              key={level}
              type="button"
              disabled={isLocked}
              onClick={() => onSelect(level)}
              className={[
                "relative flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition-all",
                isLocked
                  ? "cursor-not-allowed bg-slate-800 text-slate-600"
                  : "bg-slate-700 text-white hover:scale-105 hover:bg-slate-600",
                isCurrent ? "ring-2 ring-white" : "",
              ].join(" ")}
            >
              {level}
              {!isLocked && (
                <span
                  className="absolute bottom-0.5 left-1 right-1 h-0.5 rounded-full"
                  style={{ backgroundColor: diffColor }}
                />
              )}
              {isCompleted && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check size={9} />
                </span>
              )}
              {isLocked && <Lock size={10} className="absolute bottom-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
