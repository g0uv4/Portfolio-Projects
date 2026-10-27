import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkCover } from "@/components/work-shot";
import { CATEGORY_LABEL, STATUS_LABEL, type Work } from "@/content/types";
import { cn } from "@/lib/utils";

export function WorkCard({
  work,
  compact = false,
}: {
  work: Work;
  compact?: boolean;
}) {
  return (
    <Card
      className={cn(
        "card-hover group overflow-hidden",
        compact && "flex-row sm:flex-col",
      )}
    >
      <Link
        to="/works/$slug"
        params={{ slug: work.slug }}
        className={cn(
          "block shrink-0 overflow-hidden border-border",
          compact ? "w-28 border-r sm:w-auto sm:border-r-0 sm:border-b" : "border-b",
        )}
        tabIndex={-1}
      >
        <WorkCover work={work} compact={compact} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <CardHeader className={compact ? "gap-1.5 px-4 pt-4 sm:px-5" : "gap-2.5"}>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="muted">{CATEGORY_LABEL[work.category]}</Badge>
            <Badge tone="muted">{work.year}</Badge>
            {compact ? null : <Badge tone="accent">{STATUS_LABEL[work.status]}</Badge>}
          </div>
          <CardTitle className={compact ? "text-base leading-snug" : "leading-snug"}>
            <Link
              to="/works/$slug"
              params={{ slug: work.slug }}
              className="whitespace-normal transition-colors duration-150 hover:text-accent"
            >
              {work.title}
            </Link>
          </CardTitle>
          <CardDescription className={compact ? "line-clamp-2" : undefined}>
            {work.subtitle}
          </CardDescription>
        </CardHeader>
        {compact ? null : (
          <CardContent className="pb-5">
            <p className="line-clamp-3 text-sm leading-relaxed text-muted">{work.summary}</p>
          </CardContent>
        )}
        <CardFooter
          className={cn(
            "no-print",
            compact ? "border-t-0 px-2 pt-1 pb-2 sm:px-3" : undefined,
          )}
        >
          <Button
            asChild
            variant={compact ? "ghost" : "outline"}
            size="sm"
            className={compact ? "text-accent hover:text-accent" : undefined}
          >
            <Link to="/works/$slug" params={{ slug: work.slug }}>
              看案例
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
