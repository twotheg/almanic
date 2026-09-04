"use client";

import { Eraser } from "lucide-react";
import { getColor } from "@/lib/game";

interface ColorPaletteProps {
  count: number;
  selected: number;
  eraser: boolean;
  usedColors: Set<number>;
  onSelect: (colorId: number) => void;
  onEraser: () => void;
}

export function ColorPalette({
  count,
  selected,
  eraser,
  usedColors,
  onSelect,
  onEraser,
}: ColorPaletteProps) {
  const colors = Array.from({ length: Math.min(count, 36) }, (_, i) => i + 1);
  const small = count > 14;

  return (
    <div
      className={[
        "flex flex-wrap items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 p-2",
        small ? "gap-1.5" : "gap-3",
      ].join(" ")}
    >
      {colors.map((id) => {
        const used = usedColors.has(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            title={used ? "사용 중인 색상" : `색상 ${id}`}
            className={[
              "relative flex items-center justify-center rounded-full shadow-md transition-transform",
              small ? "h-8 w-8" : "h-10 w-10",
              selected === id && !eraser
                ? "scale-110 ring-2 ring-white"
                : "hover:scale-105",
            ].join(" ")}
            style={{ backgroundColor: getColor(id - 1) }}
            aria-label={`Select color ${id}${used ? " (in use)" : ""}`}
          >
            <span
              className={[
                "font-bold text-slate-900",
                small ? "text-[10px]" : "text-xs",
              ].join(" ")}
            >
              {id}
            </span>
            {used && (
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-white ring-2 ring-slate-800">
                <span className="h-1 w-1 rounded-full bg-slate-800" />
              </span>
            )}
          </button>
        );
      })}
      <button
        type="button"
        onClick={onEraser}
        className={[
          "flex items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-white shadow-md transition-transform",
          small ? "h-8 w-8" : "h-10 w-10",
          eraser ? "scale-110 ring-2 ring-white" : "hover:scale-105",
        ].join(" ")}
        aria-label="Eraser"
      >
        <Eraser size={small ? 14 : 18} />
      </button>
    </div>
  );
}
