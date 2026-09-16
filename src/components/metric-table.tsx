import { Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { WorkMetric } from "@/content/types";

export function MetricTable({
  metrics,
  caption,
}: {
  metrics: WorkMetric[];
  caption?: string;
}) {
  return (
    <Table>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
      <TableHeader>
        <TableRow>
          <TableHead>指標</TableHead>
          <TableHead>數值</TableHead>
          <TableHead className="hidden sm:table-cell">口徑</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((metric) => (
          <TableRow key={metric.label}>
            <TableCell className="text-muted">{metric.label}</TableCell>
            <TableCell>
              <span className="inline-flex items-center gap-1 font-medium tabular-nums">
                {metric.value}
                {metric.note ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex size-11 items-center justify-center text-faint hover:text-accent sm:hidden"
                        aria-label={`${metric.label}口徑：${metric.note}`}
                      >
                        <Info className="size-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{metric.note}</TooltipContent>
                  </Tooltip>
                ) : null}
              </span>
            </TableCell>
            <TableCell className="hidden text-muted sm:table-cell">
              {metric.note ?? <span className="text-faint">—</span>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
