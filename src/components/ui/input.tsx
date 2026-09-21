import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full min-w-0 rounded-md bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
        "placeholder:text-faint",
        "transition-[box-shadow] duration-150",
        "hover:shadow-[var(--shadow-border-hover)]",
        "focus-visible:ring-2 focus-visible:ring-accent/40",
        "disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
