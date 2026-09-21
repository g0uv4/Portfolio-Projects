import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkPreviewDialog } from "@/components/work-preview";
import { workCoverSrc } from "@/components/work-shot";
import { CATEGORY_LABEL, STATUS_LABEL, type Work } from "@/content/types";

export function WorkCard({
  work,
  compact = false,
}: {
  work: Work;
  compact?: boolean;
}) {
  const isPrivate = work.github?.visibility === "private";

  return (
    <Card className="card-hover overflow-hidden">
      <Link
        to="/works/$slug"
        params={{ slug: work.slug }}
        className="block"
        tabIndex={-1}
      >
        <img
          src={workCoverSrc(work.slug)}
          alt=""
          width={1200}
          height={676}
          className={compact ? "aspect-[16/7] w-full object-cover" : "aspect-video w-full object-cover"}
        />
      </Link>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="muted">{CATEGORY_LABEL[work.category]}</Badge>
          <Badge tone="muted">{work.year}</Badge>
          {compact ? null : <Badge tone="fg">{STATUS_LABEL[work.status]}</Badge>}
          {isPrivate ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex size-11 items-center justify-center text-faint">
                  <Lock className="size-3" />
                  <span className="sr-only">私人倉</span>
                </span>
              </TooltipTrigger>
              <TooltipContent>私人倉只顯示名稱與摘要，不含原始碼。</TooltipContent>
            </Tooltip>
          ) : null}
        </div>
        <CardTitle>
          <Link
            to="/works/$slug"
            params={{ slug: work.slug }}
            className="whitespace-normal hover:text-accent"
          >
            {work.title}
          </Link>
        </CardTitle>
        <CardDescription>{work.subtitle}</CardDescription>
      </CardHeader>
      {compact ? null : (
        <CardContent>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{work.summary}</p>
        </CardContent>
      )}
      <CardFooter className="no-print">
        <Button asChild variant={compact ? "ghost" : "outline"} size="sm">
          <Link to="/works/$slug" params={{ slug: work.slug }}>
            看案例
          </Link>
        </Button>
        {compact ? null : <WorkPreviewDialog work={work} />}
      </CardFooter>
    </Card>
  );
}
