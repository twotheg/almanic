let ctx: AudioContext | null = null;
let muted = false;

if (typeof window !== "undefined") {
  muted = localStorage.getItem("almanic-muted") === "1";
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  if (typeof window !== "undefined") {
    localStorage.setItem("almanic-muted", m ? "1" : "0");
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.15
) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playTap() {
  tone(520, 0.08, "triangle", 0.12);
}

export function playErase() {
  tone(300, 0.08, "triangle", 0.1);
}

export function playError() {
  tone(180, 0.2, "sawtooth", 0.12);
}

export function playComplete() {
  tone(523, 0.12, "sine", 0.15);
  setTimeout(() => tone(659, 0.12, "sine", 0.15), 120);
  setTimeout(() => tone(784, 0.2, "sine", 0.15), 240);
}
