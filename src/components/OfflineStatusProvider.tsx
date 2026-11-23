"use client";

import { createContext, useContext, useEffect, useState } from "react";

const OfflineContext = createContext<{ online: boolean }>({ online: true });

export function OfflineStatusProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return <OfflineContext.Provider value={{ online }}>{children}</OfflineContext.Provider>;
}

export function useOfflineStatus() {
  return useContext(OfflineContext);
}
