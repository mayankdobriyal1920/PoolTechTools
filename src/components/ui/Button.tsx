import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  outline: "border border-brand-500 text-brand-700 hover:bg-brand-50 rounded-[10px] px-4 py-2 font-semibold",
};
const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base",
  lg: "text-lg px-6 py-3",
};

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(variants[variant], sizes[size], (disabled || loading) && "opacity-60 cursor-not-allowed", className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}
