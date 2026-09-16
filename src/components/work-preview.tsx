import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LABEL, STATUS_LABEL, type Work } from "@/content/types";

export function WorkPreviewDialog({ work }: { work: Work }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          預覽
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{CATEGORY_LABEL[work.category]}</Badge>
            <Badge tone="muted">{work.year}</Badge>
            <Badge tone="fg">{STATUS_LABEL[work.status]}</Badge>
          </div>
          <DialogTitle className="mt-2">{work.title}</DialogTitle>
          <DialogDescription>{work.subtitle}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="problem" className="mt-4 gap-4">
          <TabsList>
            <TabsTrigger value="problem">問題</TabsTrigger>
            <TabsTrigger value="approach">作法</TabsTrigger>
            <TabsTrigger value="results">成效</TabsTrigger>
          </TabsList>
          <TabsContent value="problem" className="text-sm leading-relaxed text-muted">
            <p>{work.problem.context}</p>
            <p className="mt-3">{work.problem.pain}</p>
          </TabsContent>
          <TabsContent value="approach" className="text-sm leading-relaxed text-muted">
            <p>{work.approach.overview}</p>
          </TabsContent>
          <TabsContent value="results" className="text-sm leading-relaxed text-muted">
            <p>{work.results.narrative}</p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {work.results.metrics.slice(0, 4).map((metric) => (
                <div key={metric.label}>
                  <dd className="text-base font-semibold tracking-tight text-fg tabular-nums">
                    {metric.value}
                  </dd>
                  <dt className="text-xs text-muted">{metric.label}</dt>
                </div>
              ))}
            </dl>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button asChild>
            <Link to="/works/$slug" params={{ slug: work.slug }}>
              開啟完整案例
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
