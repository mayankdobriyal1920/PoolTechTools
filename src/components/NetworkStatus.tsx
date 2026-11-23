"use client";

import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [offline, setOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    setOffline(!navigator.onLine);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (offline) {
    return (
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-amber-700 px-5 py-2 text-sm font-medium text-white shadow-lg">
        You're offline — changes are saved locally.
      </div>
    );
  }
  if (showReconnected) {
    return (
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-lg">
        Back online ✓
      </div>
    );
  }
  return null;
}
