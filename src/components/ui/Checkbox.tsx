import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, id, ...rest }: CheckboxProps) {
  const cbId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label htmlFor={cbId} className={cn("flex items-center gap-2 text-sm text-brand-800 cursor-pointer", className)}>
      <input id={cbId} type="checkbox" className="h-4 w-4 rounded border-brand-400 text-brand-600 focus:ring-brand-500" {...rest} />
      <span>{label}</span>
    </label>
  );
}
