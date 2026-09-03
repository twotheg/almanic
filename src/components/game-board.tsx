"use client";

import { useRef, useState } from "react";
import type { NumberCell } from "@/lib/levels";
import { getColor } from "@/lib/game";

interface GameBoardProps {
  size: number;
  grid: number[][];
  numbers: NumberCell[];
  completed: boolean;
  previewColor: string | null;
  previewIsEraser: boolean;
  onRectSelect: (r1: number, c1: number, r2: number, c2: number) => void;
}

export function GameBoard({
  size,
  grid,
  numbers,
  completed,
  previewColor,
  previewIsEraser,
  onRectSelect,
}: GameBoardProps) {
  const [dragStart, setDragStart] = useState<{ r: number; c: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ r: number; c: number } | null>(null);
  const draggingRef = useRef(false);

  const numberMap = new Map<string, NumberCell>();
  for (const num of numbers) {
    numberMap.set(`${num.r},${num.c}`, num);
  }

  const previewRect =
    dragStart && dragCurrent
      ? {
          minR: Math.min(dragStart.r, dragCurrent.r),
          maxR: Math.max(dragStart.r, dragCurrent.r),
          minC: Math.min(dragStart.c, dragCurrent.c),
          maxC: Math.max(dragStart.c, dragCurrent.c),
        }
      : null;

  const cellFromPoint = (clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY);
    const btn = el?.closest("button[data-row]");
    if (!btn) return null;
    const r = btn.getAttribute("data-row");
    const c = btn.getAttribute("data-col");
    if (r === null || c === null) return null;
    return { r: parseInt(r, 10), c: parseInt(c, 10) };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (completed) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (!cell) return;
    e.preventDefault();
    draggingRef.current = true;
    setDragStart(cell);
    setDragCurrent(cell);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell) setDragCurrent(cell);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const start = dragStart;
    const cur = dragCurrent;
    setDragStart(null);
    setDragCurrent(null);
    if (start && cur) {
      onRectSelect(start.r, start.c, cur.r, cur.c);
    }
  };

  return (
    <div
      className="grid select-none touch-none gap-1 rounded-2xl border-2 border-slate-700 bg-slate-800 p-2 shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const num = numberMap.get(`${r},${c}`);
          const colorId = cell;
          const bgColor = colorId > 0 ? getColor(colorId - 1) : undefined;
          const isNumber = !!num;
          const isCompleted = completed && colorId > 0;
          const inPreview =
            !!previewRect &&
            r >= previewRect.minR &&
            r <= previewRect.maxR &&
            c >= previewRect.minC &&
            c <= previewRect.maxC;

          return (
            <button
              key={`${r}-${c}`}
              data-row={r}
              data-col={c}
              type="button"
              tabIndex={-1}
              className={[
                "relative flex aspect-square items-center justify-center rounded-lg text-sm font-bold",
                isCompleted ? "ring-2 ring-white/50" : "",
                inPreview ? "ring-2 ring-white" : "",
              ].join(" ")}
              style={{
                backgroundColor: bgColor ?? "#1e293b",
              }}
            >
              {inPreview && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{
                    backgroundColor: previewIsEraser
                      ? "rgba(2, 6, 23, 0.6)"
                      : previewColor ?? "rgba(255, 255, 255, 0.4)",
                    opacity: previewIsEraser ? 1 : 0.55,
                  }}
                />
              )}
              <span
                className="relative z-10"
                style={{ color: isNumber ? "#ffffff" : "#94a3b8" }}
              >
                {isNumber ? num.value : ""}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}
