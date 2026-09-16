import type {
  DummyCell,
  DummyRow,
  DummySnapshot,
  MonthCells,
  PeriodAxis,
} from "./snapshot.ts";

const PERIODS: PeriodAxis = [
  { offset: 0, label: "4月", month: "2026-04" },
  { offset: 1, label: "5月", month: "2026-05" },
  { offset: 2, label: "6月", month: "2026-06" },
  { offset: 3, label: "7月", month: "2026-07" },
  { offset: 4, label: "8月", month: "2026-08" },
  { offset: 5, label: "9月", month: "2026-09" },
];

function cell(
  inventory: number,
  po: number,
  p: number,
  rolling: number,
  fcst: number,
): DummyCell {
  return { inventory, po, p, rolling, fcst };
}

/** First month short, later surplus → Pull in. */
function pullInMonths(seed: number): MonthCells {
  const gap = 30 + seed * 3;
  return [
    cell(0, 0, 8 + seed, gap, 20),
    cell(40 + seed, 12, 18, 16, 18),
    cell(38, 8, 16, 14, 16),
    cell(36, 6, 14, 12, 14),
    cell(34, 4, 12, 10, 12),
    cell(32, 2, 10, 8, 10),
  ];
}

/** First month surplus, later short → Push out. */
function pushOutMonths(seed: number): MonthCells {
  const later = 24 + seed * 2;
  return [
    cell(70 + seed, 10, 12, 10, 12),
    cell(0, 0, 4, later, 22),
    cell(22, 4, 10, 10, 10),
    cell(20, 4, 10, 10, 10),
    cell(18, 2, 8, 8, 8),
    cell(16, 2, 8, 8, 8),
  ];
}

/** Never short → DONE. */
function doneMonths(seed: number): MonthCells {
  const inv = 28 + seed;
  return [
    cell(inv, 8, 12, 10, 12),
    cell(inv + 2, 6, 12, 10, 12),
    cell(inv + 4, 6, 10, 8, 10),
    cell(inv + 2, 4, 10, 8, 10),
    cell(inv, 4, 8, 6, 8),
    cell(inv - 2, 2, 8, 6, 8),
  ];
}

function row(
  id: DummyRow["id"],
  partNo: DummyRow["partNo"],
  productLine: DummyRow["productLine"],
  orderCustomer: DummyRow["orderCustomer"],
  shipCustomer: DummyRow["shipCustomer"],
  warehouse: DummyRow["warehouse"],
  months: MonthCells,
  qaHold?: DummyRow["qaHold"],
): DummyRow {
  return qaHold
    ? {
        id,
        partNo,
        productLine,
        orderCustomer,
        shipCustomer,
        warehouse,
        qaHold,
        months,
      }
    : {
        id,
        partNo,
        productLine,
        orderCustomer,
        shipCustomer,
        warehouse,
        months,
      };
}

export const FACTORY_DRAFT: Omit<DummySnapshot, "periodAxisId"> = {
  version: 1,
  releaseId: "demo-release",
  rowUniverseId: "demo-universe",
  periods: PERIODS,
  rows: [
    row(
      "row-01",
      "PN-A104",
      "LINE-A",
      "CUST-010",
      "CUST-110",
      "WH-N1",
      pullInMonths(1),
      "QA-1001",
    ),
    row(
      "row-02",
      "PN-A218",
      "LINE-A",
      "CUST-010",
      "CUST-120",
      "WH-N1",
      pushOutMonths(1),
    ),
    row(
      "row-03",
      "PN-B130",
      "LINE-B",
      "CUST-020",
      "CUST-210",
      "WH-S1",
      doneMonths(1),
    ),
    row(
      "row-04",
      "PN-B244",
      "LINE-B",
      "CUST-020",
      "CUST-220",
      "WH-S1",
      pullInMonths(2),
    ),
    row(
      "row-05",
      "PN-C156",
      "LINE-C",
      "CUST-030",
      "CUST-310",
      "WH-C1",
      pushOutMonths(2),
      "QA-1002",
    ),
    row(
      "row-06",
      "PN-C262",
      "LINE-C",
      "CUST-030",
      "CUST-320",
      "WH-C1",
      doneMonths(2),
    ),
    row(
      "row-07",
      "PN-D178",
      "LINE-D",
      "CUST-040",
      "CUST-410",
      "WH-W1",
      pullInMonths(3),
    ),
    row(
      "row-08",
      "PN-D280",
      "LINE-D",
      "CUST-040",
      "CUST-420",
      "WH-W1",
      pushOutMonths(3),
    ),
    row(
      "row-09",
      "PN-E192",
      "LINE-E",
      "CUST-050",
      "CUST-510",
      "WH-E1",
      doneMonths(3),
    ),
    row(
      "row-10",
      "PN-E204",
      "LINE-E",
      "CUST-050",
      "CUST-520",
      "WH-E1",
      pullInMonths(4),
    ),
    row(
      "row-11",
      "PN-A330",
      "LINE-A",
      "CUST-010",
      "CUST-130",
      "WH-N2",
      doneMonths(4),
    ),
    row(
      "row-12",
      "PN-B356",
      "LINE-B",
      "CUST-020",
      "CUST-230",
      "WH-S2",
      pushOutMonths(4),
    ),
  ],
};
