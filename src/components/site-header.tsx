import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LatticeMark } from "@/components/mark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "首頁" },
  { to: "/works", label: "作品庫" },
  { to: "/github", label: "GitHub" },
  { to: "/about", label: "關於" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75 print:hidden">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex h-11 items-center gap-2.5 text-fg"
          onClick={() => setOpen(false)}
        >
          <LatticeMark className="size-5 text-accent" />
          <span className="text-sm font-semibold tracking-[0.08em]">ZOLAND WORKS</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主要選單">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",
                  "after:absolute after:inset-x-3 after:-bottom-[11px] after:h-0.5 after:rounded-full after:transition-colors",
                  active
                    ? "font-medium text-fg after:bg-accent"
                    : "text-muted after:bg-transparent hover:bg-surface-2 hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center text-fg md:hidden"
          aria-label={open ? "關閉選單" : "開啟選單"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg shadow-[0_8px_16px_-12px_rgb(11_21_38/0.25)] md:hidden">
          <nav className="wrap flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-12 items-center border-l-2 pl-3 text-base",
                  isActive(pathname, item.to)
                    ? "border-accent font-medium text-fg"
                    : "border-transparent text-muted",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}
