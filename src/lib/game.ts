export interface NumberCell {
  r: number;
  c: number;
  value: number;
}

export const COLORS = [
  "#facc15", // yellow
  "#a78bfa", // purple
  "#60a5fa", // blue
  "#f87171", // red
  "#4ade80", // green
  "#fb923c", // orange
  "#2dd4bf", // teal
  "#f472b6", // pink
  "#a3e635", // lime
  "#c084fc", // violet
  "#38bdf8", // sky
  "#fb7185", // rose
  "#34d399", // emerald
  "#fbbf24", // amber
  "#818cf8", // indigo
  "#5eead4", // cyan
  "#e879f9", // fuchsia
  "#bef264", // lime light
  "#fca5a5", // red light
  "#93c5fd", // blue light
  "#fcd34d", // yellow light
  "#86efac", // green light
  "#c4b5fd", // purple light
  "#fdba74", // orange light
];

export function getColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  completed: boolean;
}

export function validateGrid(
  grid: number[][],
  numbers: NumberCell[]
): ValidationResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const errors: string[] = [];

  // Check all cells filled
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        return { valid: false, errors: ["All cells must be filled"], completed: false };
      }
    }
  }

  const numberMap = new Map<string, NumberCell>();
  for (const num of numbers) {
    numberMap.set(`${num.r},${num.c}`, num);
  }

  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));
  const checkedNumbers = new Set<string>();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (visited[r][c]) continue;

      const colorId = grid[r][c];
      const stack: { r: number; c: number }[] = [{ r, c }];
      const cells: { r: number; c: number }[] = [];
      visited[r][c] = true;

      while (stack.length > 0) {
        const cell = stack.pop()!;
        cells.push(cell);

        const dirs = [
          { dr: -1, dc: 0 },
          { dr: 1, dc: 0 },
          { dr: 0, dc: -1 },
          { dr: 0, dc: 1 },
        ];

        for (const { dr, dc } of dirs) {
          const nr = cell.r + dr;
          const nc = cell.c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            !visited[nr][nc] &&
            grid[nr][nc] === colorId
          ) {
            visited[nr][nc] = true;
            stack.push({ r: nr, c: nc });
          }
        }
      }

      // Check rectangle
      const minR = Math.min(...cells.map((cell) => cell.r));
      const maxR = Math.max(...cells.map((cell) => cell.r));
      const minC = Math.min(...cells.map((cell) => cell.c));
      const maxC = Math.max(...cells.map((cell) => cell.c));

      const expectedArea = (maxR - minR + 1) * (maxC - minC + 1);
      if (expectedArea !== cells.length) {
        errors.push(`Region is not a rectangle`);
        continue;
      }

      // Find number in this region
      const regionNumbers: NumberCell[] = [];
      for (const cell of cells) {
        const key = `${cell.r},${cell.c}`;
        if (numberMap.has(key)) {
          regionNumbers.push(numberMap.get(key)!);
          checkedNumbers.add(key);
        }
      }

      if (regionNumbers.length !== 1) {
        errors.push(`Each rectangle must contain exactly one number`);
        continue;
      }

      const num = regionNumbers[0];
      if (num.value !== cells.length) {
        errors.push(`Rectangle size does not match number ${num.value}`);
      }
    }
  }

  // Check all numbers are included
  for (const num of numbers) {
    const key = `${num.r},${num.c}`;
    if (!checkedNumbers.has(key)) {
      errors.push(`Number ${num.value} is not in a valid rectangle`);
    }
  }

  const completed = errors.length === 0;
  return { valid: completed, errors, completed };
}

export function createsDisconnectedRegion(
  grid: number[][],
  r: number,
  c: number,
  color: number
): boolean {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let colorExists = false;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] !== color) continue;
      colorExists = true;
      const isAdjacent = Math.abs(i - r) + Math.abs(j - c) === 1;
      if (isAdjacent) {
        return false;
      }
    }
  }

  return colorExists;
}

export function isRectangle(cells: { r: number; c: number }[]): boolean {
  if (cells.length === 0) return false;
  const minR = Math.min(...cells.map((c) => c.r));
  const maxR = Math.max(...cells.map((c) => c.r));
  const minC = Math.min(...cells.map((c) => c.c));
  const maxC = Math.max(...cells.map((c) => c.c));
  const expected = (maxR - minR + 1) * (maxC - minC + 1);
  return expected === cells.length;
}

export function createEmptyGrid(size: number): number[][] {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
}

export function cloneGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}
