"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { Button } from "@/components/ui/Button";

export function UpgradeButton() {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;
    initializePaddle({ token, environment: process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox" })
      .then((p) => setPaddle(p))
      .catch(() => {});
  }, []);

  const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

  function openCheckout() {
    if (!paddle || !priceId) {
      alert("Checkout is not configured yet. Set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN and NEXT_PUBLIC_PADDLE_PRICE_ID.");
      return;
    }
    setLoading(true);
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
    });
    setLoading(false);
  }

  return (
    <Button onClick={openCheckout} loading={loading}>
      Upgrade to Pro
    </Button>
  );
}
