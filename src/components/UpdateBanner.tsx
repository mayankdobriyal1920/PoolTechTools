"use client";

import { useEffect, useState } from "react";

export function UpdateBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setShow(true);
          }
        });
      });
    });
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
      <div className="flex items-center gap-3">
        <span>🔄</span>
        <span>Update available — reload to get the latest version.</span>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30"
        >
          Reload
        </button>
        <button onClick={() => setShow(false)} className="text-xs opacity-70 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}
