import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      tone: {
        muted: "bg-surface-2 text-muted",
        accent: "bg-accent/10 text-accent",
        fg: "bg-fg/5 text-fg",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
