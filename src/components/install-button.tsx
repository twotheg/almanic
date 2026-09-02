"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
    if (outcome === "accepted") {
      console.log("User installed the app");
    }
  };

  if (!isInstallable) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-indigo-500"
    >
      <Download size={16} />
      Install App
    </button>
  );
}
