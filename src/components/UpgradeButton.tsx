"use client";

import { useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function UpgradeButton() {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

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
    const opts: any = { items: [{ priceId, quantity: 1 }] };
    if (appliedCode) opts.discountCode = appliedCode;
    paddle.Checkout.open(opts);
    setLoading(false);
  }

  function applyCode() {
    if (discountCode.trim()) setAppliedCode(discountCode.trim());
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Discount code (optional)"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={applyCode} disabled={!discountCode.trim()}>
          Apply
        </Button>
      </div>
      {appliedCode && (
        <p className="text-xs text-poolgreen-600">Discount code &quot;{appliedCode}&quot; will be applied at checkout.</p>
      )}
      <Button onClick={openCheckout} loading={loading} className="w-full">
        Upgrade to Pro
      </Button>
    </div>
  );
}
