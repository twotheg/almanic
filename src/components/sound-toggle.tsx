"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted } from "@/lib/sound";

export function SoundToggle() {
  const [muted, setM] = useState(isMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setM(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "소리 켜기" : "소리 끄기"}
      title={muted ? "소리 꺼짐" : "소리 켜짐"}
      className={[
        "flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-colors",
        muted
          ? "bg-slate-700 text-slate-400"
          : "bg-green-500 text-white",
      ].join(" ")}
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
