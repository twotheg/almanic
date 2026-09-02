"use client";

import { useState } from "react";
import { NumberCell } from "@/lib/levels";
import { getColor } from "@/lib/game";

interface GameBoardProps {
  size: number;
  grid: number[][];
  numbers: NumberCell[];
  completed: boolean;
  onCellDraw: (r: number, c: number) => void;
}

export function GameBoard({
  size,
  grid,
  numbers,
  completed,
  onCellDraw,
}: GameBoardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const numberMap = new Map<string, NumberCell>();
  for (const num of numbers) {
    numberMap.set(`${num.r},${num.c}`, num);
  }

  const handlePointerDown = (r: number, c: number) => {
    setIsDragging(true);
    onCellDraw(r, c);
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (isDragging) {
      onCellDraw(r, c);
    }
  };

  return (
    <div
      className="grid select-none gap-1 rounded-2xl border-2 border-slate-700 bg-slate-800 p-2 shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const num = numberMap.get(`${r},${c}`);
          const colorId = cell;
          const bgColor = colorId > 0 ? getColor(colorId - 1) : undefined;
          const isNumber = !!num;
          const isCompleted = completed && colorId > 0;

          return (
            <button
              key={`${r}-${c}`}
              data-row={r}
              data-col={c}
              type="button"
              onPointerDown={() => handlePointerDown(r, c)}
              onPointerEnter={() => handlePointerEnter(r, c)}
              className={[
                "relative flex aspect-square items-center justify-center rounded-lg text-sm font-bold transition-all",
                "touch-none active:scale-95",
                isNumber ? "text-white shadow-inner" : "text-slate-300",
                isCompleted ? "ring-2 ring-white/50" : "",
              ].join(" ")}
              style={{
                backgroundColor: bgColor ?? "#1e293b",
                color: isNumber ? "#ffffff" : "#94a3b8",
              }}
            >
              {isNumber ? num.value : ""}
              {colorId > 0 && !isNumber && (
                <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10" />
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
