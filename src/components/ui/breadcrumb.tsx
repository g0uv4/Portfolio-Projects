import { ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return <nav aria-label="麵包屑" className={cn("text-sm", className)} {...props} />;
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      className={cn("flex min-h-11 flex-wrap items-center gap-1 text-muted", className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("inline-flex items-center gap-1", className)} {...props} />;
}

export function BreadcrumbSeparator() {
  return (
    <li aria-hidden className="text-faint">
      <ChevronRight className="size-3.5" />
    </li>
  );
}

export function BreadcrumbPage({ children }: { children: ReactNode }) {
  return (
    <span className="font-medium text-fg" aria-current="page">
      {children}
    </span>
  );
}
