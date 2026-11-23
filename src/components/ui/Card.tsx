import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ children, className, strong = false }: { children: ReactNode; className?: string; strong?: boolean }) {
  return <div className={cn(strong ? "glass-strong" : "glass-card", "p-6", className)}>{children}</div>;
}
