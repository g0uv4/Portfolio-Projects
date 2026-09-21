import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type {
  DemoBoardView,
  DemoDisplayCell,
  DemoDisplayRow,
  DemoEditInput,
  DummyAction,
  FailReason,
  ProductLine,
} from "@/lib/psi-demo";
import { cn } from "@/lib/utils";

const PRODUCT_LINES: readonly ProductLine[] = [
  "LINE-A",
  "LINE-B",
  "LINE-C",
  "LINE-D",
  "LINE-E",
];

const METRICS = ["P", "Rolling", "Inv", "Fcst", "PO"] as const;

type LineFilter = ProductLine | "all";

export function PsiDemoBoard({
  view,
  onEdit,
  onReset,
  backTo,
}: {
  view: DemoBoardView;
  onEdit: (input: DemoEditInput) => void;
  onReset: () => void;
  backTo: { to: "/works/$slug"; params: { slug: string } };
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2 sm:px-4">
        <Link
          to={backTo.to}
          params={backTo.params}
          className="text-sm text-muted hover:text-accent"
        >
          返回案例
        </Link>
        <p className="min-w-0 flex-1 text-sm text-muted">
          示意資料 · 非正式站 · 不會寫入雲端
        </p>
        {view.status === "ready" ? (
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            重設試算
          </Button>
        ) : null}
      </header>
      {renderBody(view, onEdit)}
    </div>
  );
}

function renderBody(
  view: DemoBoardView,
  onEdit: (input: DemoEditInput) => void,
) {
  switch (view.status) {
    case "fail-closed":
      return <FailClosed reason={view.reason} />;
    case "ready":
      return <ReadyBoard view={view} onEdit={onEdit} />;
    default: {
      const _exhaustive: never = view;
      return _exhaustive;
    }
  }
}

function FailClosed({ reason }: { reason: FailReason }) {
  return (
    <div
      role="alert"
      className="m-6 max-w-xl rounded-lg bg-surface p-6 shadow-[var(--shadow-border)]"
    >
      <p className="font-semibold">示意資料無法顯示</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {failCopy(reason)}
      </p>
    </div>
  );
}

function failCopy(reason: FailReason): string {
  switch (reason.code) {
    case "factory-seal":
      return `出廠資料無法密封。${reason.detail}`;
    case "empty-universe":
      return `沒有可顯示的列。${reason.detail}`;
    case "unsafe-token":
      return `示意代碼不符合前綴。${reason.detail}`;
    case "row-shape":
      return `列形狀不一致。${reason.detail}`;
    default: {
      const _exhaustive: never = reason;
      return _exhaustive;
    }
  }
}

function ReadyBoard({
  view,
  onEdit,
}: {
  view: Extract<DemoBoardView, { status: "ready" }>;
  onEdit: (input: DemoEditInput) => void;
}) {
  const [line, setLine] = useState<LineFilter>("all");
  const rows = useMemo(
    () =>
      line === "all"
        ? view.rows
        : view.rows.filter((row) => row.productLine === line),
    [line, view.rows],
  );

  return (
    <>
      {view.overlayDiscarded ? (
        <p className="border-b border-border px-3 py-2 text-sm text-muted sm:px-4">
          先前試算與目前示意資料不符，已回到出廠資料。
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 border-b border-border px-3 py-2 sm:px-4">
        <LineChip
          label="全部"
          pressed={line === "all"}
          onClick={() => setLine("all")}
        />
        {PRODUCT_LINES.map((item) => (
          <LineChip
            key={item}
            label={item}
            pressed={line === item}
            onClick={() => setLine(item)}
          />
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="min-w-max border-separate border-spacing-0 text-xs">
          <caption className="sr-only">示意規劃表</caption>
          <thead>
            <tr>
              <IdentityHead rowSpan={2} sticky="line">
                產線
              </IdentityHead>
              <IdentityHead rowSpan={2} sticky="part">
                料號
              </IdentityHead>
              <IdentityHead rowSpan={2}>出貨客戶</IdentityHead>
              <IdentityHead rowSpan={2}>接單客戶</IdentityHead>
              <th
                rowSpan={2}
                className="sticky top-0 z-10 bg-surface px-2 py-2 text-left font-medium text-faint"
              >
                倉
              </th>
              <th
                rowSpan={2}
                className="sticky top-0 z-10 bg-surface px-2 py-2 text-left font-medium text-faint"
              >
                QA
              </th>
              <th
                rowSpan={2}
                className="sticky top-0 z-10 bg-surface px-2 py-2 text-left font-medium text-faint"
              >
                建議
              </th>
              {view.periods.map((period) => (
                <th
                  key={period.month}
                  colSpan={METRICS.length}
                  className="sticky top-0 z-10 border-l border-border bg-surface px-2 py-2 text-center font-medium text-fg"
                >
                  {period.label}
                  <span className="ml-1 font-mono text-faint">{period.month}</span>
                </th>
              ))}
            </tr>
            <tr>
              {view.periods.map((period) =>
                METRICS.map((metric) => (
                  <th
                    key={`${period.month}-${metric}`}
                    className={cn(
                      "sticky top-8 z-10 bg-surface px-2 py-1.5 text-center font-medium text-faint",
                      metric === "P" && "border-l border-border",
                    )}
                  >
                    {metric}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7 + view.periods.length * METRICS.length}
                  className="px-3 py-8 text-center text-sm text-muted"
                >
                  沒有符合的產線。
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <DemoRow key={row.id} row={row} onEdit={onEdit} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IdentityHead({
  sticky,
  children,
  rowSpan,
}: {
  rowSpan: number;
  sticky?: "line" | "part";
  children: string;
}) {
  return (
    <th
      rowSpan={rowSpan}
      className={cn(
        "sticky top-0 bg-surface px-2 py-2 text-left font-medium text-faint",
        sticky ? cn("z-30", stickyLeft[sticky]) : "z-10 min-w-28",
      )}
    >
      {children}
    </th>
  );
}

const stickyLeft = {
  line: "left-0 w-20 min-w-20",
  part: "left-20 w-28 min-w-28",
} as const;

function DemoRow({
  row,
  onEdit,
}: {
  row: DemoDisplayRow;
  onEdit: (input: DemoEditInput) => void;
}) {
  return (
    <tr className="border-b border-border">
      <IdentityCell sticky="line">{row.productLine}</IdentityCell>
      <IdentityCell sticky="part">
        <span className="font-mono">{row.partNo}</span>
      </IdentityCell>
      <IdentityCell>
        <span className="font-mono">{row.shipCustomer}</span>
      </IdentityCell>
      <IdentityCell>
        <span className="font-mono">{row.orderCustomer}</span>
      </IdentityCell>
      <td className="bg-bg px-2 py-1 font-mono">{row.warehouse}</td>
      <td className="bg-bg px-2 py-1 font-mono">{row.qaHold ?? "—"}</td>
      <td className="bg-bg px-2 py-1">
        <ActionChip action={row.action} />
      </td>
      {row.months.map((cell) => (
        <MonthMetricCells
          key={`${row.id}-${cell.offset}`}
          rowId={row.id}
          cell={cell}
          onEdit={onEdit}
        />
      ))}
    </tr>
  );
}

function IdentityCell({
  sticky,
  children,
}: {
  sticky?: "line" | "part";
  children: ReactNode;
}) {
  return (
    <td
      className={cn(
        "bg-bg px-2 py-1",
        sticky && cn("sticky z-20", stickyLeft[sticky]),
      )}
    >
      {children}
    </td>
  );
}

function MonthMetricCells({
  rowId,
  cell,
  onEdit,
}: {
  rowId: DemoDisplayRow["id"];
  cell: DemoDisplayCell;
  onEdit: (input: DemoEditInput) => void;
}) {
  return (
    <>
      <td className="border-l border-border bg-bg px-1 py-1">
        <MetricInput
          label={`${rowId} ${cell.label} P`}
          value={cell.p}
          onChange={(value) =>
            onEdit({ rowId, offset: cell.offset, field: "p", value })
          }
        />
      </td>
      <td className="bg-bg px-1 py-1">
        <MetricInput
          label={`${rowId} ${cell.label} Rolling`}
          value={cell.rolling}
          onChange={(value) =>
            onEdit({ rowId, offset: cell.offset, field: "rolling", value })
          }
        />
      </td>
      <td className="bg-bg px-1 py-1">
        <ReadMetric value={cell.inventory} />
      </td>
      <td className="bg-bg px-1 py-1">
        <ReadMetric value={cell.fcst} />
      </td>
      <td className="bg-bg px-1 py-1">
        <ReadMetric value={cell.po} />
      </td>
    </>
  );
}

function MetricInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      step="any"
      aria-label={label}
      value={Number.isFinite(value) ? value : 0}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const next =
          event.target.value === "" ? 0 : Number(event.target.value);
        if (!Number.isFinite(next) || next < 0) return;
        onChange(next);
      }}
      className="h-7 w-16 rounded-sm bg-surface px-1 text-right font-mono text-xs tabular-nums text-fg outline-none ring-border focus-visible:ring-2 focus-visible:ring-accent/40"
    />
  );
}

function ReadMetric({ value }: { value: number }) {
  return (
    <span className="block w-16 px-1 text-right font-mono tabular-nums text-muted">
      {value}
    </span>
  );
}

function ActionChip({ action }: { action: DummyAction }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2 font-mono text-[11px] font-medium",
        actionClass(action),
      )}
    >
      {action}
    </span>
  );
}

function actionClass(action: DummyAction): string {
  switch (action) {
    case "Pull in":
      return "bg-accent/10 text-accent";
    case "Push out":
      return "bg-warn/10 text-warn";
    case "DONE":
      return "bg-ok/10 text-ok";
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

function LineChip({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full px-3 font-mono text-xs",
        pressed
          ? "bg-accent text-accent-fg"
          : "bg-surface-2 text-muted hover:text-fg",
      )}
    >
      {label}
    </button>
  );
}
