/** Six-month planning window. Offset is the only legal index into row cells. */
export type PeriodOffset = 0 | 1 | 2 | 3 | 4 | 5;

export type DummyPeriod = {
  offset: PeriodOffset;
  label: string;
  month: `${number}${number}${number}${number}-${number}${number}`;
};

export type PeriodAxis = readonly [
  DummyPeriod,
  DummyPeriod,
  DummyPeriod,
  DummyPeriod,
  DummyPeriod,
  DummyPeriod,
];

export type DummyCell = {
  p: number;
  rolling: number;
  inventory: number;
  fcst: number;
  po: number;
};

export type MonthCells = readonly [
  DummyCell,
  DummyCell,
  DummyCell,
  DummyCell,
  DummyCell,
  DummyCell,
];

export type DummyAction = "Pull in" | "Push out" | "DONE";

export type ProductLine = "LINE-A" | "LINE-B" | "LINE-C" | "LINE-D" | "LINE-E";

export type DummyRow = {
  id: `row-${string}`;
  partNo: `PN-${string}`;
  productLine: ProductLine;
  orderCustomer: `CUST-${string}`;
  shipCustomer: `CUST-${string}`;
  warehouse: `WH-${string}`;
  /** Absent on most rows. When present, a synthetic QA hold ticket. */
  qaHold?: `QA-${string}`;
  months: MonthCells;
};

export type DummySnapshot = {
  version: 1;
  releaseId: "demo-release";
  rowUniverseId: "demo-universe";
  /** Fingerprint of the six `month` values. Never authored by hand. */
  periodAxisId: string;
  periods: PeriodAxis;
  rows: readonly DummyRow[];
};

const sealedDummySnapshot: unique symbol = Symbol("sealedDummySnapshot");

/** Only `sealDummySnapshot` may produce this. */
export type SealedDummySnapshot = DummySnapshot & {
  readonly [sealedDummySnapshot]: true;
};

export type FailReason =
  | { code: "factory-seal"; detail: string }
  | { code: "empty-universe"; detail: string }
  | { code: "unsafe-token"; detail: string }
  | { code: "row-shape"; detail: string };

export type DemoEditInput = {
  rowId: DummyRow["id"];
  offset: PeriodOffset;
  field: "p" | "rolling";
  value: number;
};

export type DemoDisplayCell = DummyCell & {
  offset: PeriodOffset;
  month: DummyPeriod["month"];
  label: string;
};

export type DemoDisplayRow = {
  id: DummyRow["id"];
  partNo: DummyRow["partNo"];
  productLine: ProductLine;
  orderCustomer: DummyRow["orderCustomer"];
  shipCustomer: DummyRow["shipCustomer"];
  warehouse: DummyRow["warehouse"];
  qaHold: `QA-${string}` | null;
  action: DummyAction;
  months: readonly [
    DemoDisplayCell,
    DemoDisplayCell,
    DemoDisplayCell,
    DemoDisplayCell,
    DemoDisplayCell,
    DemoDisplayCell,
  ];
};

export type DemoBoardView =
  | {
      status: "ready";
      releaseId: DummySnapshot["releaseId"];
      periods: PeriodAxis;
      rows: readonly DemoDisplayRow[];
      dirty: boolean;
      overlayDiscarded: boolean;
    }
  | { status: "fail-closed"; reason: FailReason };

const PERIOD_COUNT = 6;
const MIN_ROWS = 8;
const MAX_ROWS = 20;
const TOKEN_RE = /^(PN|CUST|WH|QA)-[A-Z0-9-]+$/;
const LINE_RE = /^LINE-[A-E]$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const OFFSETS: readonly PeriodOffset[] = [0, 1, 2, 3, 4, 5];

export function fingerprintPeriodAxis(periods: PeriodAxis): string {
  return periods.map((period) => period.month).join(":");
}

export function suggestAction(months: MonthCells): DummyAction {
  const nets = months.map(
    (cell) => cell.inventory + cell.po + cell.p - cell.rolling,
  );
  const firstShort = nets.findIndex((net) => net < 0);
  const firstSurplus = nets.findIndex((net) => net > 0);
  if (firstShort < 0) return "DONE";
  if (firstShort < firstSurplus || firstSurplus < 0) return "Pull in";
  if (firstSurplus < firstShort) return "Push out";
  return "DONE";
}

export function projectDisplayRow(
  row: DummyRow,
  periods: PeriodAxis,
): DemoDisplayRow {
  return {
    id: row.id,
    partNo: row.partNo,
    productLine: row.productLine,
    orderCustomer: row.orderCustomer,
    shipCustomer: row.shipCustomer,
    warehouse: row.warehouse,
    qaHold: row.qaHold ?? null,
    action: suggestAction(row.months),
    months: [
      displayCell(row.months[0], periods[0]),
      displayCell(row.months[1], periods[1]),
      displayCell(row.months[2], periods[2]),
      displayCell(row.months[3], periods[3]),
      displayCell(row.months[4], periods[4]),
      displayCell(row.months[5], periods[5]),
    ],
  };
}

function displayCell(cell: DummyCell, period: DummyPeriod): DemoDisplayCell {
  return {
    ...cell,
    offset: period.offset,
    month: period.month,
    label: period.label,
  };
}

/**
 * Only constructor for SealedDummySnapshot.
 * Throws on invariant failure. Never returns a partial snapshot.
 */
export function sealDummySnapshot(
  draft: Omit<DummySnapshot, "periodAxisId">,
): SealedDummySnapshot {
  if (draft.version !== 1) {
    throw new Error("row-shape: version must be 1");
  }
  if (draft.releaseId !== "demo-release") {
    throw new Error("row-shape: releaseId");
  }
  if (draft.rowUniverseId !== "demo-universe") {
    throw new Error("row-shape: rowUniverseId");
  }
  if (draft.periods.length !== PERIOD_COUNT) {
    throw new Error("row-shape: period count");
  }
  const months = new Set<string>();
  for (let i = 0; i < PERIOD_COUNT; i += 1) {
    const period = draft.periods[i];
    if (!period || period.offset !== OFFSETS[i]) {
      throw new Error(`row-shape: period offset ${i}`);
    }
    if (!MONTH_RE.test(period.month)) {
      throw new Error(`row-shape: period month ${period.month}`);
    }
    if (months.has(period.month)) {
      throw new Error(`row-shape: duplicate month ${period.month}`);
    }
    months.add(period.month);
  }
  if (draft.rows.length < MIN_ROWS || draft.rows.length > MAX_ROWS) {
    throw new Error(`empty-universe: row count ${draft.rows.length}`);
  }
  const ids = new Set<string>();
  const partNos = new Set<string>();
  for (const row of draft.rows) {
    sealRow(row);
    if (ids.has(row.id)) throw new Error(`row-shape: duplicate id ${row.id}`);
    if (partNos.has(row.partNo)) {
      throw new Error(`row-shape: duplicate partNo ${row.partNo}`);
    }
    ids.add(row.id);
    partNos.add(row.partNo);
  }
  const periodAxisId = fingerprintPeriodAxis(draft.periods);
  return {
    version: 1,
    releaseId: "demo-release",
    rowUniverseId: "demo-universe",
    periodAxisId,
    periods: draft.periods,
    rows: draft.rows,
    [sealedDummySnapshot]: true,
  };
}

function sealRow(row: DummyRow): void {
  if (!row.id.startsWith("row-") || row.id === "row-") {
    throw new Error(`row-shape: id ${row.id}`);
  }
  assertToken(row.partNo, "PN");
  if (!LINE_RE.test(row.productLine)) {
    throw new Error(`unsafe-token: ${row.productLine}`);
  }
  assertToken(row.orderCustomer, "CUST");
  assertToken(row.shipCustomer, "CUST");
  assertToken(row.warehouse, "WH");
  if (row.qaHold !== undefined) assertToken(row.qaHold, "QA");
  if (row.months.length !== PERIOD_COUNT) {
    throw new Error(`row-shape: months ${row.id}`);
  }
  for (const cell of row.months) {
    sealCell(cell, row.id);
  }
}

function assertToken(value: string, prefix: "PN" | "CUST" | "WH" | "QA"): void {
  if (!TOKEN_RE.test(value) || !value.startsWith(`${prefix}-`)) {
    throw new Error(`unsafe-token: ${value}`);
  }
}

function sealCell(cell: DummyCell, rowId: string): void {
  for (const field of ["p", "rolling", "inventory", "fcst", "po"] as const) {
    const value = cell[field];
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`row-shape: ${rowId} ${field}`);
    }
  }
}

export function isPeriodOffset(value: number): value is PeriodOffset {
  return OFFSETS.includes(value as PeriodOffset);
}
