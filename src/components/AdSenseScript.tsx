"use client";

import { useEntitlement } from "@/hooks/useEntitlement";
import Script from "next/script";

export function AdSenseScript() {
  const { isPro, loading } = useEntitlement();
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (loading || isPro || !clientId) return null;

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
