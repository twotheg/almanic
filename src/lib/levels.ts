export interface NumberCell {
  r: number;
  c: number;
  value: number;
}

export interface Level {
  id: number;
  size: number;
  numbers: NumberCell[];
  solution: number[][];
  difficulty: "easy" | "medium" | "hard" | "expert";
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

function generateLevel(id: number): Level {
  const size = 7;
  const rng = new SeededRandom(id * 12345 + 98765);

  let minArea: number;
  let maxArea: number;
  let targetPieces: number;
  let difficulty: Level["difficulty"];

  if (id <= 30) {
    targetPieces = rng.range(4, 6);
    minArea = 4;
    maxArea = 25;
    difficulty = "easy";
  } else if (id <= 90) {
    targetPieces = rng.range(6, 10);
    minArea = 2;
    maxArea = 16;
    difficulty = "medium";
  } else if (id <= 180) {
    targetPieces = rng.range(10, 15);
    minArea = 2;
    maxArea = 12;
    difficulty = "hard";
  } else {
    targetPieces = rng.range(15, 22);
    minArea = 1;
    maxArea = 8;
    difficulty = "expert";
  }

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
      // Find next empty cell
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

      // Determine preferred max area based on remaining pieces target
      const remainingCells = size * size - filled;
      const remainingPieces = Math.max(1, targetPieces - pieces.length);
      const preferredMax = Math.min(maxArea, Math.max(minArea, Math.floor(remainingCells / remainingPieces) + 2));
      const preferredMin = Math.min(minArea, preferredMax);

      const candidates = getAllRectSizes(solution, startR, startC, preferredMax, preferredMin);
      if (candidates.length === 0) {
        // fallback to any size that fits
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
        // Prefer sizes closer to target average
        const targetAvg = remainingCells / remainingPieces;
        candidates.sort((a, b) => Math.abs(a.area - targetAvg) - Math.abs(b.area - targetAvg));
        const topCandidates = candidates.slice(0, Math.max(1, Math.floor(candidates.length / 2)));
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

  // Reassign region IDs to be sequential (some IDs may be missing due to resets)
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

  const finalSolution: number[][] = solution.map((row) => row.map((id) => remap.get(id)!));

  // Rebuild pieces from final solution
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

  // Place numbers in each piece
  const numbers: NumberCell[] = [];
  for (const [id, rect] of pieceMap) {
    const value = rect.h * rect.w;
    // Prefer corners/edges for number placement
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
    id,
    size,
    numbers,
    solution: finalSolution,
    difficulty,
  };
}

export function getLevel(id: number): Level {
  if (id < 1 || id > 300) {
    throw new Error("Level must be between 1 and 300");
  }
  return generateLevel(id);
}

export function getAllLevels(): Level[] {
  return Array.from({ length: 300 }, (_, i) => getLevel(i + 1));
}

export function getDifficultyColor(difficulty: Level["difficulty"]): string {
  switch (difficulty) {
    case "easy":
      return "#22c55e";
    case "medium":
      return "#3b82f6";
    case "hard":
      return "#f59e0b";
    case "expert":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}
