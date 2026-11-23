"use client";

import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [offline, setOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const goOffline = () => { setOffline(true); setDismissed(false); };
    const goOnline = () => { setOffline(false); setShowReconnected(true); setTimeout(() => setShowReconnected(false), 3000); };
    setOffline(!navigator.onLine);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);

  if (dismissed) return null;

  if (offline) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
        <div className="flex items-center justify-between gap-3">
          <span>You're offline — changes saved locally.</span>
          <button onClick={() => setDismissed(true)} className="text-xs opacity-70 hover:opacity-100" aria-label="Dismiss">✕</button>
        </div>
      </div>
    );
  }
  if (showReconnected) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
        Back online ✓
      </div>
    );
  }
  return null;
}
