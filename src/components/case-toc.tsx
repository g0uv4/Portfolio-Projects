import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { Work, WorkLiveLink } from "@/content/types";
import { publicGithubHref } from "@/content/works";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#problem", label: "問題" },
  { href: "#approach", label: "作法" },
  { href: "#results", label: "成效" },
] as const;

export function CaseToc({ work }: { work: Work }) {
  const githubHref = publicGithubHref(work);

  return (
    <div className="no-print sticky top-16 z-10 border-y border-border bg-bg">
      <div className="flex flex-wrap items-center gap-2 py-2">
        <nav aria-label="本頁章節" className="flex min-w-0 flex-1 flex-wrap gap-1">
          {work.slug === "psi-dashboard" ? (
            <a
              href="#demo"
              className={cn(
                "inline-flex h-11 items-center px-3 text-sm text-muted",
                "transition-colors duration-150 hover:text-accent",
              )}
            >
              展示站
            </a>
          ) : null}
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "inline-flex h-11 items-center px-3 text-sm text-muted",
                "transition-colors duration-150 hover:text-accent",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap gap-2">
          {githubHref ? (
            <Button asChild variant="outline" size="sm">
              <a href={githubHref} target="_blank" rel="noreferrer">
                GitHub
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          ) : null}
          {work.live ? <WorkLiveLink live={work.live} /> : null}
        </div>
      </div>
    </div>
  );
}

function WorkLiveLink({ live }: { live: WorkLiveLink }) {
  switch (live.kind) {
    case "internal":
      return (
        <Button asChild size="sm">
          <Link to={live.to}>{live.label}</Link>
        </Button>
      );
    case "external":
      return (
        <Button asChild size="sm">
          <a href={live.href} target="_blank" rel="noreferrer">
            {live.label ?? "正式站"}
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      );
    default: {
      const _exhaustive: never = live;
      return _exhaustive;
    }
  }
}
