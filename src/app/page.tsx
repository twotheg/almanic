"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLevel } from "@/lib/levels";
import {
  createEmptyGrid,
  cloneGrid,
  validateGrid,
  wouldDisconnectOnRectFill,
  getColor,
} from "@/lib/game";
import { GameBoard } from "@/components/game-board";
import { ColorPalette } from "@/components/color-palette";
import { Timer } from "@/components/timer";
import { LevelSelect } from "@/components/level-select";
import { InstallButton } from "@/components/install-button";
import { PushManager } from "@/components/push-manager";
import {
  RotateCcw,
  Undo2,
  Lightbulb,
  Grid3X3,
  ChevronRight,
  Trophy,
  Download,
  Play,
} from "lucide-react";

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("almanic-device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("almanic-device-id", id);
  }
  return id;
}

export default function HomePage() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(7));
  const [history, setHistory] = useState<number[][][]>([]);
  const [selectedColor, setSelectedColor] = useState(1);
  const [eraser, setEraser] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const level = useMemo(() => getLevel(currentLevel), [currentLevel]);

  const usedColors = useMemo(
    () => new Set(grid.flat().filter((v) => v > 0)),
    [grid]
  );

  const nextLevel = useMemo(() => {
    for (let i = 1; i <= 300; i++) {
      if (!completedLevels.has(i)) return i;
    }
    return 300;
  }, [completedLevels]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);

    const savedLevel = localStorage.getItem("almanic-current-level");
    if (savedLevel) {
      setCurrentLevel(parseInt(savedLevel, 10));
    }

    const savedCompleted = localStorage.getItem("almanic-completed-levels");
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted);
        setCompletedLevels(new Set(parsed));
      } catch {
        // ignore
      }
    }

    // Load progress from server
    if (id) {
      fetch(`/api/progress?deviceId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.progress) {
            const levels = data.progress.map((p: { levelId: number }) => p.levelId);
            setCompletedLevels((prev) => new Set([...prev, ...levels]));
          }
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    setGrid(createEmptyGrid(7));
    setHistory([]);
    setCompleted(false);
    setShowComplete(false);
    setTimerRunning(false);
    setTimerKey((k) => k + 1);
    setElapsedSeconds(0);
    localStorage.setItem("almanic-current-level", currentLevel.toString());
  }, [currentLevel]);

  const saveCompleted = useCallback(
    async (levelId: number, seconds: number) => {
      setCompletedLevels((prev) => {
        const next = new Set(prev);
        next.add(levelId);
        localStorage.setItem("almanic-completed-levels", JSON.stringify([...next]));
        return next;
      });

      if (deviceId) {
        try {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceId,
              levelId,
              bestTimeSeconds: seconds,
            }),
          });
        } catch (err) {
          console.error("Failed to save progress", err);
        }
      }
    },
    [deviceId]
  );

  const handleRectSelect = useCallback(
    (r1: number, c1: number, r2: number, c2: number) => {
      if (completed) return;

      const minR = Math.min(r1, r2);
      const maxR = Math.max(r1, r2);
      const minC = Math.min(c1, c2);
      const maxC = Math.max(c1, c2);
      const value = eraser ? 0 : selectedColor;

      if (
        !eraser &&
        wouldDisconnectOnRectFill(grid, minR, maxR, minC, maxC, selectedColor)
      ) {
        showToast("이미 사용 중인 색상입니다. 다른 색을 선택하거나 지우개를 사용하세요.");
        return;
      }

      setGrid((prev) => {
        let changed = false;
        for (let r = minR; r <= maxR && !changed; r++) {
          for (let c = minC; c <= maxC && !changed; c++) {
            if (prev[r][c] !== value) changed = true;
          }
        }
        if (!changed) return prev;

        const next = cloneGrid(prev);
        setHistory((h) => [...h.slice(-49), cloneGrid(prev)]);
        for (let r = minR; r <= maxR; r++) {
          for (let c = minC; c <= maxC; c++) {
            next[r][c] = value;
          }
        }

        if (!timerRunning) setTimerRunning(true);

        const result = validateGrid(next, level.numbers);
        if (result.completed) {
          setCompleted(true);
          setTimerRunning(false);
          setShowComplete(true);
          saveCompleted(level.id, elapsedSeconds);
        }

        return next;
      });
    },
    [
      completed,
      eraser,
      selectedColor,
      level,
      timerRunning,
      elapsedSeconds,
      saveCompleted,
      grid,
      showToast,
    ]
  );

  const handleUndo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setGrid(prev);
      return h.slice(0, -1);
    });
  };

  const handleReset = () => {
    setGrid(createEmptyGrid(7));
    setHistory([]);
    setCompleted(false);
    setTimerRunning(false);
    setTimerKey((k) => k + 1);
    setElapsedSeconds(0);
  };

  const handleHint = () => {
    // Reveal one random cell from the solution that is currently wrong or empty
    const { solution } = level;
    const candidates: { r: number; c: number }[] = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (grid[r][c] !== solution[r][c]) {
          candidates.push({ r, c });
        }
      }
    }
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const correctColor = solution[pick.r][pick.c];
    setSelectedColor(correctColor);
    setEraser(false);

    setGrid((prev) => {
      const next = cloneGrid(prev);
      setHistory((h) => [...h.slice(-49), cloneGrid(prev)]);
      next[pick.r][pick.c] = correctColor;
      return next;
    });
  };

  const handleNextLevel = () => {
    if (currentLevel < 300) {
      setCurrentLevel((l) => l + 1);
    } else {
      setShowComplete(false);
    }
  };

  const handleDownload = () => {
    window.location.href = "/api/download";
  };

  const difficultyLabel =
    level.difficulty === "easy"
      ? "Easy"
      : level.difficulty === "medium"
      ? "Medium"
      : level.difficulty === "hard"
      ? "Hard"
      : "Expert";

  const difficultyColor =
    level.difficulty === "easy"
      ? "#22c55e"
      : level.difficulty === "medium"
      ? "#3b82f6"
      : level.difficulty === "hard"
      ? "#f59e0b"
      : "#ef4444";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 px-4 py-6 text-slate-100">
      <header className="mb-6 flex w-full max-w-md items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">The Almanic</h1>
          <p className="text-xs text-slate-400">Shikaku Puzzle • 300 Levels</p>
        </div>
        <div className="flex items-center gap-2">
          <InstallButton />
          <PushManager />
        </div>
      </header>

      <section className="mb-4 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 shadow-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-300">Progress</span>
          <span className="font-bold text-white">
            {completedLevels.size} / 300 cleared
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${Math.min(100, (completedLevels.size / 300) * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentLevel(nextLevel)}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
          >
            <Play size={14} />
            Continue (Lv.{nextLevel})
          </button>
          <button
            type="button"
            onClick={() => setShowLevelSelect(true)}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-700 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-600"
          >
            <Grid3X3 size={14} />
            Level Select
          </button>
        </div>
      </section>

      <section className="mb-4 flex w-full max-w-md items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 shadow-lg">
        <div>
          <button
            type="button"
            onClick={() => setShowLevelSelect(true)}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <Grid3X3 size={16} />
            Level {currentLevel}
          </button>
          <span className="text-xs font-medium" style={{ color: difficultyColor }}>
            {difficultyLabel}
          </span>
        </div>
        <Timer
          running={timerRunning}
          resetKey={timerKey}
          onTick={setElapsedSeconds}
        />
      </section>

      <div className="w-full max-w-md">
        <GameBoard
          size={7}
          grid={grid}
          numbers={level.numbers}
          completed={completed}
          previewColor={eraser ? null : getColor(selectedColor - 1)}
          previewIsEraser={eraser}
          onRectSelect={handleRectSelect}
        />
      </div>

      <div className="mt-4 w-full max-w-md">
        <ColorPalette
          count={Math.max(...level.solution.flat())}
          selected={selectedColor}
          eraser={eraser}
          usedColors={usedColors}
          onSelect={(id) => {
            setSelectedColor(id);
            setEraser(false);
          }}
          onEraser={() => setEraser((e) => !e)}
        />
      </div>

      <div className="mt-4 flex w-full max-w-md flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleUndo}
          disabled={history.length === 0}
          className="flex items-center gap-1 rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600 disabled:opacity-40"
        >
          <Undo2 size={16} />
          Undo
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          type="button"
          onClick={handleHint}
          className="flex items-center gap-1 rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
        >
          <Lightbulb size={16} />
          Hint
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1 rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-600"
        >
          <Download size={16} />
          Source
        </button>
      </div>

      {showLevelSelect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowLevelSelect(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <LevelSelect
              currentLevel={currentLevel}
              completed={completedLevels}
              onSelect={(lvl) => {
                setCurrentLevel(lvl);
                setShowLevelSelect(false);
              }}
            />
          </div>
        </div>
      )}

      {showComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              <Trophy size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Level Complete!</h2>
            <p className="mt-2 text-slate-400">
              You solved level {currentLevel} in {" "}
              {Math.floor(elapsedSeconds / 60)
                .toString()
                .padStart(2, "0")}
              :{(elapsedSeconds % 60).toString().padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={handleNextLevel}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-500"
            >
              Next Level
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}
