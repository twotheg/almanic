"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getLevel,
  MODES,
  MODE_ORDER,
  storedLevelId,
  modeOfStored,
  getDifficultyColor,
  type Mode,
} from "@/lib/levels";
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
} from "lucide-react";

type CompletedByMode = Record<Mode, Set<number>>;

const emptyCompleted = (): CompletedByMode => ({
  easy: new Set(),
  medium: new Set(),
  hard: new Set(),
});

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
  const [mode, setMode] = useState<Mode>("easy");
  const [levelNum, setLevelNum] = useState(1);
  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(7));
  const [history, setHistory] = useState<number[][][]>([]);
  const [selectedColor, setSelectedColor] = useState(1);
  const [eraser, setEraser] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedByMode, setCompletedByMode] =
    useState<CompletedByMode>(emptyCompleted);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [modalMode, setModalMode] = useState<Mode>("easy");
  const [showComplete, setShowComplete] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const level = useMemo(() => getLevel(mode, levelNum), [mode, levelNum]);

  const usedColors = useMemo(
    () => new Set(grid.flat().filter((v) => v > 0)),
    [grid]
  );

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

    const savedCurrent = localStorage.getItem("almanic-current-v2");
    if (savedCurrent) {
      try {
        const parsed = JSON.parse(savedCurrent) as { mode: Mode; level: number };
        if (parsed.mode && MODES[parsed.mode]) {
          setMode(parsed.mode);
          setModalMode(parsed.mode);
          setLevelNum(Math.min(Math.max(1, parsed.level), MODES[parsed.mode].count));
        }
      } catch {
        // ignore
      }
    }

    const savedCompleted = localStorage.getItem("almanic-completed-v2");
    if (savedCompleted) {
      try {
        const parsed = JSON.parse(savedCompleted) as Partial<
          Record<Mode, number[]>
        >;
        setCompletedByMode((prev) => {
          const next = emptyCompleted();
          for (const m of MODE_ORDER) {
            const arr = parsed[m] ?? [];
            for (const lvl of arr) {
              if (lvl >= 1 && lvl <= MODES[m].count) next[m].add(lvl);
            }
            for (const lvl of prev[m]) next[m].add(lvl);
          }
          return next;
        });
      } catch {
        // ignore
      }
    }

    if (id) {
      fetch(`/api/progress?deviceId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.progress) {
            setCompletedByMode((prev) => {
              const next = emptyCompleted();
              for (const m of MODE_ORDER) {
                for (const lvl of prev[m]) next[m].add(lvl);
              }
              for (const p of data.progress as { levelId: number }[]) {
                const { mode: m, level: lvl } = modeOfStored(p.levelId);
                if (lvl >= 1 && lvl <= MODES[m].count) next[m].add(lvl);
              }
              return next;
            });
          }
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    setGrid(createEmptyGrid(level.size));
    setHistory([]);
    setCompleted(false);
    setShowComplete(false);
    setTimerRunning(false);
    setTimerKey((k) => k + 1);
    setElapsedSeconds(0);
    localStorage.setItem(
      "almanic-current-v2",
      JSON.stringify({ mode, level: levelNum })
    );
  }, [mode, levelNum, level.size]);

  const persistCompleted = useCallback(
    (next: CompletedByMode) => {
      const plain: Record<Mode, number[]> = {
        easy: [...next.easy],
        medium: [...next.medium],
        hard: [...next.hard],
      };
      localStorage.setItem("almanic-completed-v2", JSON.stringify(plain));
    },
    []
  );

  const saveCompleted = useCallback(
    async (m: Mode, lvl: number, seconds: number) => {
      setCompletedByMode((prev) => {
        const next = {
          easy: new Set(prev.easy),
          medium: new Set(prev.medium),
          hard: new Set(prev.hard),
        };
        next[m].add(lvl);
        persistCompleted(next);
        return next;
      });

      if (deviceId) {
        try {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceId,
              levelId: storedLevelId(m, lvl),
              bestTimeSeconds: seconds,
            }),
          });
        } catch (err) {
          console.error("Failed to save progress", err);
        }
      }
    },
    [deviceId, persistCompleted]
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
          saveCompleted(mode, levelNum, elapsedSeconds);
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
      mode,
      levelNum,
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
    setGrid(createEmptyGrid(level.size));
    setHistory([]);
    setCompleted(false);
    setTimerRunning(false);
    setTimerKey((k) => k + 1);
    setElapsedSeconds(0);
  };

  const handleHint = () => {
    const { solution, size } = level;
    const candidates: { r: number; c: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
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
    if (levelNum < MODES[mode].count) {
      setLevelNum((l) => l + 1);
    } else {
      setShowComplete(false);
    }
  };

  const goTo = (m: Mode, lvl: number) => {
    setMode(m);
    setModalMode(m);
    setLevelNum(lvl);
    setShowLevelSelect(false);
  };

  const handleDownload = () => {
    window.location.href = "/api/download";
  };

  const modeColor = getDifficultyColor(mode);

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 px-4 pb-24 pt-6 text-slate-100">
      <header className="mb-4 flex w-full max-w-md items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">The Almanic</h1>
          <p className="text-xs text-slate-400">Shikaku Puzzle • 3 Modes • 500 Levels</p>
        </div>
        <div className="flex items-center gap-2">
          <InstallButton />
          <PushManager />
        </div>
      </header>

      <section className="mb-4 flex w-full max-w-md items-center justify-between rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 shadow-lg">
        <div>
          <div className="mb-1 flex gap-1">
            {MODE_ORDER.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors",
                  m === mode ? "text-white" : "bg-slate-700 text-slate-400",
                ].join(" ")}
                style={m === mode ? { backgroundColor: getDifficultyColor(m) } : undefined}
              >
                {MODES[m].label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setModalMode(mode);
              setShowLevelSelect(true);
            }}
            className="flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <Grid3X3 size={16} />
            Level {levelNum}
          </button>
          <span className="text-xs font-medium" style={{ color: modeColor }}>
            {MODES[mode].sub}
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
          size={level.size}
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

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-900/95 px-3 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-700 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-600 disabled:opacity-40"
          >
            <Undo2 size={14} />
            Undo
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-700 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-600"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleHint}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-700 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-600"
          >
            <Lightbulb size={14} />
            Hint
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-slate-700 px-2 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-600"
          >
            <Download size={14} />
            Source
          </button>
        </div>
      </div>

      {showLevelSelect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowLevelSelect(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <LevelSelect
              mode={modalMode}
              currentLevel={modalMode === mode ? levelNum : -1}
              completed={completedByMode[modalMode]}
              onSelect={(lvl) => goTo(modalMode, lvl)}
              onModeChange={setModalMode}
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
              {MODES[mode].label} • Level {levelNum} in{" "}
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
              {levelNum < MODES[mode].count ? "Next Level" : "All Clear!"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {toast}
        </div>
      )}
    </main>
  );
}
