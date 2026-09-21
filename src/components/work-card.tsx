import { Link } from "@tanstack/react-router";
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

export function WorkCard({
  work,
  compact = false,
}: {
  work: Work;
  compact?: boolean;
}) {
  return (
    <Card className="card-hover overflow-hidden">
      <Link
        to="/works/$slug"
        params={{ slug: work.slug }}
        className="block"
        tabIndex={-1}
      >
        <WorkCover work={work} compact={compact} />
      </Link>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="muted">{CATEGORY_LABEL[work.category]}</Badge>
          <Badge tone="muted">{work.year}</Badge>
          {compact ? null : <Badge tone="fg">{STATUS_LABEL[work.status]}</Badge>}
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
      </CardFooter>
    </Card>
  );
}
