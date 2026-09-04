export type Mode = "easy" | "medium" | "hard";

export const MODE_ORDER: Mode[] = ["easy", "medium", "hard"];

export const MODES: Record<
  Mode,
  { label: string; size: number; count: number; sub: string }
> = {
  easy: { label: "Easy", size: 7, count: 100, sub: "7×7" },
  medium: { label: "Medium", size: 9, count: 200, sub: "9×9" },
  hard: { label: "Hard", size: 11, count: 200, sub: "11×11" },
};

// Server progress stores a single levelId; encode the mode as an offset.
export const MODE_OFFSET: Record<Mode, number> = {
  easy: 0,
  medium: 1000,
  hard: 2000,
};

export function storedLevelId(mode: Mode, level: number): number {
  return MODE_OFFSET[mode] + level;
}

export function modeOfStored(id: number): { mode: Mode; level: number } {
  if (id >= MODE_OFFSET.hard) return { mode: "hard", level: id - MODE_OFFSET.hard };
  if (id >= MODE_OFFSET.medium)
    return { mode: "medium", level: id - MODE_OFFSET.medium };
  return { mode: "easy", level: id };
}

export interface NumberCell {
  r: number;
  c: number;
  value: number;
}

export interface Level {
  id: number;
  mode: Mode;
  size: number;
  numbers: NumberCell[];
  solution: number[][];
  difficulty: Mode;
}

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.range(0, arr.length - 1)];
  }
}

function canPlaceRect(
  grid: number[][],
  r: number,
  c: number,
  h: number,
  w: number
): boolean {
  if (r + h > grid.length || c + w > grid[0].length) return false;
  for (let i = r; i < r + h; i++) {
    for (let j = c; j < c + w; j++) {
      if (grid[i][j] !== 0) return false;
    }
  }
  return true;
}

function getAllRectSizes(
  grid: number[][],
  r: number,
  c: number,
  maxArea: number,
  minArea: number
): { h: number; w: number; area: number }[] {
  const sizes: { h: number; w: number; area: number }[] = [];
  const maxH = grid.length - r;
  const maxW = grid[0].length - c;

  for (let h = 1; h <= maxH; h++) {
    for (let w = 1; w <= maxW; w++) {
      const area = h * w;
      if (area < minArea || area > maxArea) continue;
      if (canPlaceRect(grid, r, c, h, w)) {
        sizes.push({ h, w, area });
      }
    }
  }
  return sizes;
}

function tierFor(
  mode: Mode,
  t: number
): { pieces: [number, number]; minArea: number; maxArea: number } {
  if (mode === "easy") {
    if (t < 0.3) return { pieces: [4, 6], minArea: 4, maxArea: 25 };
    if (t < 0.7) return { pieces: [6, 10], minArea: 2, maxArea: 16 };
    return { pieces: [10, 15], minArea: 2, maxArea: 12 };
  }
  if (mode === "medium") {
    if (t < 0.3) return { pieces: [6, 10], minArea: 3, maxArea: 25 };
    if (t < 0.7) return { pieces: [10, 16], minArea: 2, maxArea: 20 };
    return { pieces: [16, 24], minArea: 2, maxArea: 16 };
  }
  if (t < 0.3) return { pieces: [10, 16], minArea: 3, maxArea: 30 };
  if (t < 0.7) return { pieces: [16, 24], minArea: 2, maxArea: 20 };
  return { pieces: [24, 32], minArea: 2, maxArea: 14 };
}

function generateLevel(mode: Mode, level: number): Level {
  const cfg = MODES[mode];
  const size = cfg.size;
  const rng = new SeededRandom((MODE_OFFSET[mode] + level) * 12345 + 98765);
  const t = (level - 1) / Math.max(1, cfg.count - 1);
  const tier = tierFor(mode, t);
  const targetPieces = rng.range(tier.pieces[0], tier.pieces[1]);
  const { minArea, maxArea } = tier;

  let solution: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
  const pieces: { r: number; c: number; h: number; w: number }[] = [];

  let attempts = 0;
  while (attempts < 200) {
    solution = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
    pieces.length = 0;

    let regionId = 1;
    let filled = 0;

    while (filled < size * size) {
      let startR = -1;
      let startC = -1;
      for (let r = 0; r < size && startR === -1; r++) {
        for (let c = 0; c < size; c++) {
          if (solution[r][c] === 0) {
            startR = r;
            startC = c;
            break;
          }
        }
      }

      if (startR === -1) break;

      const remainingCells = size * size - filled;
      const remainingPieces = Math.max(1, targetPieces - pieces.length);
      const preferredMax = Math.min(
        maxArea,
        Math.max(minArea, Math.floor(remainingCells / remainingPieces) + 2)
      );
      const preferredMin = Math.min(minArea, preferredMax);

      const candidates = getAllRectSizes(
        solution,
        startR,
        startC,
        preferredMax,
        preferredMin
      );
      if (candidates.length === 0) {
        const fallback = getAllRectSizes(solution, startR, startC, remainingCells, 1);
        if (fallback.length === 0) break;
        const rect = rng.pick(fallback);
        for (let i = startR; i < startR + rect.h; i++) {
          for (let j = startC; j < startC + rect.w; j++) {
            solution[i][j] = regionId;
          }
        }
        pieces.push({ r: startR, c: startC, h: rect.h, w: rect.w });
        filled += rect.area;
      } else {
        const targetAvg = remainingCells / remainingPieces;
        candidates.sort(
          (a, b) => Math.abs(a.area - targetAvg) - Math.abs(b.area - targetAvg)
        );
        const topCandidates = candidates.slice(
          0,
          Math.max(1, Math.floor(candidates.length / 2))
        );
        const rect = rng.pick(topCandidates);
        for (let i = startR; i < startR + rect.h; i++) {
          for (let j = startC; j < startC + rect.w; j++) {
            solution[i][j] = regionId;
          }
        }
        pieces.push({ r: startR, c: startC, h: rect.h, w: rect.w });
        filled += rect.area;
      }
      regionId++;
    }

    if (filled === size * size) {
      break;
    }
    attempts++;
  }

  const remap = new Map<number, number>();
  let nextId = 1;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const id = solution[r][c];
      if (!remap.has(id)) {
        remap.set(id, nextId++);
      }
    }
  }

  const finalSolution: number[][] = solution.map((row) =>
    row.map((id) => remap.get(id)!)
  );

  const pieceMap = new Map<number, { r: number; c: number; h: number; w: number }>();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const id = finalSolution[r][c];
      if (!pieceMap.has(id)) {
        pieceMap.set(id, { r, c, h: 1, w: 1 });
      } else {
        const p = pieceMap.get(id)!;
        p.r = Math.min(p.r, r);
        p.c = Math.min(p.c, c);
        p.h = Math.max(p.h, r - p.r + 1);
        p.w = Math.max(p.w, c - p.c + 1);
      }
    }
  }

  const numbers: NumberCell[] = [];
  for (const [, rect] of pieceMap) {
    const value = rect.h * rect.w;
    const candidates: { r: number; c: number; weight: number }[] = [];
    for (let r = rect.r; r < rect.r + rect.h; r++) {
      for (let c = rect.c; c < rect.c + rect.w; c++) {
        const isEdge =
          r === rect.r ||
          r === rect.r + rect.h - 1 ||
          c === rect.c ||
          c === rect.c + rect.w - 1;
        const isCorner =
          (r === rect.r || r === rect.r + rect.h - 1) &&
          (c === rect.c || c === rect.c + rect.w - 1);
        if (isCorner) candidates.push({ r, c, weight: 4 });
        else if (isEdge) candidates.push({ r, c, weight: 2 });
        else candidates.push({ r, c, weight: 1 });
      }
    }

    const totalWeight = candidates.reduce((sum, cand) => sum + cand.weight, 0);
    let pick = rng.next() * totalWeight;
    let chosen = candidates[0];
    for (const cand of candidates) {
      pick -= cand.weight;
      if (pick <= 0) {
        chosen = cand;
        break;
      }
    }

    numbers.push({ r: chosen.r, c: chosen.c, value });
  }

  return {
    id: level,
    mode,
    size,
    numbers,
    solution: finalSolution,
    difficulty: mode,
  };
}

export function getLevel(mode: Mode, level: number): Level {
  const cfg = MODES[mode];
  if (level < 1 || level > cfg.count) {
    throw new Error(`Level must be between 1 and ${cfg.count} for mode ${mode}`);
  }
  return generateLevel(mode, level);
}

export function getAllLevels(mode: Mode): Level[] {
  return Array.from({ length: MODES[mode].count }, (_, i) => getLevel(mode, i + 1));
}

export function getDifficultyColor(difficulty: Mode): string {
  switch (difficulty) {
    case "easy":
      return "#22c55e";
    case "medium":
      return "#3b82f6";
    case "hard":
      return "#f59e0b";
    default:
      return "#6b7280";
  }
}
