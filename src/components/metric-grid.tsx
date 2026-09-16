import type { WorkMetric } from "@/content/types";

export function MetricGrid({ metrics }: { metrics: WorkMetric[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <dd className="text-xl font-semibold tracking-tight text-fg tabular-nums">
            {metric.value}
          </dd>
          <dt className="mt-1 text-xs text-muted">{metric.label}</dt>
          {metric.note ? (
            <p className="mt-1 text-xs leading-snug text-faint">{metric.note}</p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
