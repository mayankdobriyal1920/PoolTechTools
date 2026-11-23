"use client";

import { useEffect, useRef } from "react";

export function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let raf = 0;
    let t = 0;
    const ripples: { x: number; y: number; r: number; life: number }[] = [];
    let mx = width / 2;
    let my = height / 2;

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (ripples.length < 8) ripples.push({ x: mx, y: my, r: 0, life: 1 });
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    function draw() {
      t += 0.012;
      // base gradient
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, "#dff3fb");
      g.addColorStop(0.5, "#c8eaf6");
      g.addColorStop(1, "#b3dff2");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // animated waves
      const waves = [
        { amp: 18, freq: 0.008, speed: 1.2, color: "rgba(43,123,189,0.18)", y: height * 0.35 },
        { amp: 24, freq: 0.006, speed: 0.9, color: "rgba(89,168,213,0.22)", y: height * 0.55 },
        { amp: 14, freq: 0.01, speed: 1.5, color: "rgba(43,123,189,0.14)", y: height * 0.75 },
      ];
      for (const w of waves) {
        ctx.beginPath();
        ctx.moveTo(0, w.y);
        for (let x = 0; x <= width; x += 4) {
          // ripple influence
          let rippleBoost = 0;
          for (const rp of ripples) {
            const d = Math.hypot(x - rp.x, w.y - rp.y);
            if (d < 200) rippleBoost += Math.sin((200 - d) * 0.05 - rp.r * 0.1) * rp.life * 6;
          }
          const y = w.y + Math.sin(x * w.freq + t * w.speed) * w.amp + rippleBoost;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      }

      // ripples expanding rings
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 3;
        rp.life -= 0.012;
        if (rp.life <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(43,123,189,${rp.life * 0.35})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(89,168,213,${rp.life * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
