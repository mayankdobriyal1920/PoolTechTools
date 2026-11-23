"use client";
import { useEffect, useState } from "react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  if (!offline || dismissed) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
      <div className="flex items-center justify-between gap-3">
        <span>You're offline — changes saved locally.</span>
        <button onClick={() => setDismissed(true)} className="text-xs opacity-70 hover:opacity-100" aria-label="Dismiss">✕</button>
      </div>
    </div>
  );
}
