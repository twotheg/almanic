"use client";

import { getDifficultyColor } from "@/lib/levels";
import { Lock, Check } from "lucide-react";

interface LevelSelectProps {
  currentLevel: number;
  completed: Set<number>;
  onSelect: (level: number) => void;
}

export function LevelSelect({ currentLevel, completed, onSelect }: LevelSelectProps) {
  const levels = Array.from({ length: 300 }, (_, i) => i + 1);

  const getDifficulty = (level: number) => {
    if (level <= 30) return "easy";
    if (level <= 90) return "medium";
    if (level <= 180) return "hard";
    return "expert";
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mb-1 text-center text-xl font-bold text-white">Select Level</h2>
      <p className="mb-4 text-center text-sm text-slate-400">
        {completed.size} / 300 cleared
      </p>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7">
        {levels.map((level) => {
          const isLocked = level > Math.max(1, ...Array.from(completed)) + 1 && !completed.has(level);
          const isCompleted = completed.has(level);
          const isCurrent = level === currentLevel;
          const difficulty = getDifficulty(level);
          const diffColor = getDifficultyColor(difficulty);

          return (
            <button
              key={level}
              type="button"
              disabled={isLocked}
              onClick={() => onSelect(level)}
              className={[
                "relative flex aspect-square items-center justify-center rounded-xl text-sm font-bold transition-all",
                isLocked
                  ? "cursor-not-allowed bg-slate-800 text-slate-600"
                  : "bg-slate-700 text-white hover:scale-105 hover:bg-slate-600",
                isCurrent ? "ring-2 ring-white" : "",
              ].join(" ")}
            >
              {level}
              {!isLocked && (
                <span
                  className="absolute bottom-1 left-1 right-1 h-1 rounded-full"
                  style={{ backgroundColor: diffColor }}
                />
              )}
              {isCompleted && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  <Check size={10} />
                </span>
              )}
              {isLocked && <Lock size={12} className="absolute bottom-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
