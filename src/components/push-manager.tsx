"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData.split("").map((char) => char.charCodeAt(0)));
}

function getDeviceId(): string {
  let id = localStorage.getItem("almanic-device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("almanic-device-id", id);
  }
  return id;
}

export function PushManager() {
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasSW = "serviceWorker" in navigator;
    const hasPush = "PushManager" in window;
    setSupported(hasSW && hasPush);

    if (!hasSW) return;

    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    });
  }, []);

  const subscribe = async () => {
    if (!supported) return;
    setLoading(true);
    try {
      const res = await fetch("/api/push/vapid-public-key");
      const { publicKey } = await res.json();
      if (!publicKey) {
        alert("Push notifications are not configured on this server.");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: getDeviceId(), subscription: sub.toJSON() }),
      });

      setSubscribed(true);
    } catch (err) {
      console.error("Subscribe error:", err);
      alert("Failed to enable push notifications.");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!supported) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      }
      setSubscribed(false);
    } catch (err) {
      console.error("Unsubscribe error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      disabled={loading}
      onClick={subscribed ? unsubscribe : subscribe}
      className={[
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-colors",
        subscribed
          ? "bg-slate-700 text-white hover:bg-slate-600"
          : "bg-amber-500 text-white hover:bg-amber-400",
      ].join(" ")}
    >
      {subscribed ? <BellOff size={16} /> : <Bell size={16} />}
      {subscribed ? "Disable Reminders" : "Daily Reminder"}
    </button>
  );
}
