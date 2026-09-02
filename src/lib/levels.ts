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

interface Rect {
  r: number;
  c: number;
  h: number;
  w: number;
}

function splitRect(
  rng: SeededRandom,
  rect: Rect,
  targetPieces: number,
  pieces: Rect[],
  minArea: number,
  maxArea: number
): boolean {
  if (pieces.length >= targetPieces) {
    return true;
  }

  const area = rect.h * rect.w;
  if (area <= minArea) {
    pieces.push(rect);
    return true;
  }

  const remaining = targetPieces - pieces.length;
  if (remaining <= 1) {
    pieces.push(rect);
    return true;
  }

  // Decide how many pieces this rectangle should be split into
  const maxSplit = Math.min(remaining, Math.floor(area / minArea));
  const piecesFromThis = rng.range(1, Math.min(maxSplit, 4));

  if (piecesFromThis === 1 || area < minArea * 2) {
    pieces.push(rect);
    return splitRect(rng, rect, targetPieces, pieces, minArea, maxArea);
  }

  // Split horizontally or vertically
  const canSplitH = rect.h >= 2;
  const canSplitV = rect.w >= 2;

  if (!canSplitH && !canSplitV) {
    pieces.push(rect);
    return true;
  }

  const splitH = canSplitH && (!canSplitV || rng.next() < 0.5);

  if (splitH) {
    const splitRow = rng.range(1, rect.h - 1);
    const top: Rect = { r: rect.r, c: rect.c, h: splitRow, w: rect.w };
    const bottom: Rect = {
      r: rect.r + splitRow,
      c: rect.c,
      h: rect.h - splitRow,
      w: rect.w,
    };

    const topPieces = rng.range(1, Math.min(piecesFromThis - 1, Math.floor(top.h * top.w / minArea)) || 1);
    const bottomPieces = piecesFromThis - topPieces;

    if (
      top.h * top.w >= minArea * topPieces &&
      bottom.h * bottom.w >= minArea * bottomPieces
    ) {
      splitRect(rng, top, pieces.length + topPieces, pieces, minArea, maxArea);
      splitRect(rng, bottom, targetPieces, pieces, minArea, maxArea);
    } else {
      pieces.push(rect);
    }
  } else {
    const splitCol = rng.range(1, rect.w - 1);
    const left: Rect = { r: rect.r, c: rect.c, h: rect.h, w: splitCol };
    const right: Rect = {
      r: rect.r,
      c: rect.c + splitCol,
      h: rect.h,
      w: rect.w - splitCol,
    };

    const leftPieces = rng.range(1, Math.min(piecesFromThis - 1, Math.floor(left.h * left.w / minArea)) || 1);
    const rightPieces = piecesFromThis - leftPieces;

    if (
      left.h * left.w >= minArea * leftPieces &&
      right.h * right.w >= minArea * rightPieces
    ) {
      splitRect(rng, left, pieces.length + leftPieces, pieces, minArea, maxArea);
      splitRect(rng, right, targetPieces, pieces, minArea, maxArea);
    } else {
      pieces.push(rect);
    }
  }

  return true;
}

function generateLevel(id: number): Level {
  const size = 7;
  const rng = new SeededRandom(id * 12345 + 98765);

  let targetPieces: number;
  let minArea: number;
  let maxArea: number;
  let difficulty: Level["difficulty"];

  if (id <= 10) {
    targetPieces = rng.range(4, 6);
    minArea = 4;
    maxArea = 25;
    difficulty = "easy";
  } else if (id <= 30) {
    targetPieces = rng.range(6, 10);
    minArea = 2;
    maxArea = 20;
    difficulty = "medium";
  } else if (id <= 60) {
    targetPieces = rng.range(10, 15);
    minArea = 2;
    maxArea = 16;
    difficulty = "hard";
  } else {
    targetPieces = rng.range(15, 22);
    minArea = 1;
    maxArea = 12;
    difficulty = "expert";
  }

  // Try multiple times to get a good split
  let pieces: Rect[] = [];
  let attempts = 0;
  while (pieces.length < targetPieces && attempts < 50) {
    pieces = [];
    splitRect(
      rng,
      { r: 0, c: 0, h: size, w: size },
      targetPieces,
      pieces,
      minArea,
      maxArea
    );
    attempts++;
  }

  // Build solution grid
  const solution: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  pieces.forEach((rect, index) => {
    const id = index + 1;
    for (let r = rect.r; r < rect.r + rect.h; r++) {
      for (let c = rect.c; c < rect.c + rect.w; c++) {
        solution[r][c] = id;
      }
    }
  });

  // Place numbers
  const numbers: NumberCell[] = pieces.map((rect, index) => {
    const value = rect.h * rect.w;
    // Place number somewhat randomly inside the rectangle, prefer corners/edges
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

    // Weighted random pick
    const totalWeight = candidates.reduce((sum, cand) => sum + (cand.weight || 1), 0);
    let pick = rng.next() * totalWeight;
    let chosen = candidates[0];
    for (const cand of candidates) {
      pick -= cand.weight || 1;
      if (pick <= 0) {
        chosen = cand;
        break;
      }
    }

    return { r: chosen.r, c: chosen.c, value };
  });

  return {
    id,
    size,
    numbers,
    solution,
    difficulty,
  };
}

export function getLevel(id: number): Level {
  if (id < 1 || id > 100) {
    throw new Error("Level must be between 1 and 100");
  }
  return generateLevel(id);
}

export function getAllLevels(): Level[] {
  return Array.from({ length: 100 }, (_, i) => getLevel(i + 1));
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
