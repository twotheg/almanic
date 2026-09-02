"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  running: boolean;
  onTick?: (seconds: number) => void;
  resetKey?: number;
}

export function Timer({ running, onTick, resetKey }: TimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setSeconds(0);
  }, [resetKey]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, onTick]);

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return (
    <span className="font-mono text-2xl font-semibold tracking-wider text-white">
      {mins}:{secs}
    </span>
  );
}
