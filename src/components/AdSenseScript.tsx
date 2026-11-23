"use client";

import { useEntitlement } from "@/hooks/useEntitlement";
import { useEffect } from "react";
import Script from "next/script";

export function AdSenseScript() {
  const { isPro, loading } = useEntitlement();

  if (loading || isPro) return null;

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
