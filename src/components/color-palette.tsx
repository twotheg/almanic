"use client";

import { Eraser } from "lucide-react";
import { getColor } from "@/lib/game";

interface ColorPaletteProps {
  count: number;
  selected: number;
  eraser: boolean;
  onSelect: (colorId: number) => void;
  onEraser: () => void;
}

export function ColorPalette({
  count,
  selected,
  eraser,
  onSelect,
  onEraser,
}: ColorPaletteProps) {
  const colors = Array.from({ length: Math.min(count, 12) }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-3">
      {colors.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={[
            "flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-transform",
            selected === id && !eraser
              ? "scale-110 ring-2 ring-white"
              : "hover:scale-105",
          ].join(" ")}
          style={{ backgroundColor: getColor(id - 1) }}
          aria-label={`Select color ${id}`}
        >
          <span className="text-xs font-bold text-slate-900">{id}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onEraser}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-white shadow-md transition-transform",
          eraser ? "scale-110 ring-2 ring-white" : "hover:scale-105",
        ].join(" ")}
        aria-label="Eraser"
      >
        <Eraser size={18} />
      </button>
    </div>
  );
}
