import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { FACTORY_DRAFT } from "./fixture.ts";
import {
  fingerprintPeriodAxis,
  sealDummySnapshot,
  type DummyRow,
  type DummySnapshot,
  type MonthCells,
} from "./snapshot.ts";

type MutableDraft = Omit<DummySnapshot, "periodAxisId" | "rows"> & {
  rows: DummyRow[];
};

function cloneDraft(): MutableDraft {
  return structuredClone(FACTORY_DRAFT) as MutableDraft;
}

describe("sealDummySnapshot", () => {
  it("seals the factory draft with a derived periodAxisId", () => {
    const sealed = sealDummySnapshot(FACTORY_DRAFT);
    assert.equal(sealed.rows.length, 12);
    assert.equal(sealed.periods.length, 6);
    assert.equal(
      sealed.periodAxisId,
      fingerprintPeriodAxis(FACTORY_DRAFT.periods),
    );
    assert.equal(sealed.periodAxisId, "2026-04:2026-05:2026-06:2026-07:2026-08:2026-09");
    for (const [i, period] of sealed.periods.entries()) {
      assert.equal(period.offset, i);
    }
    for (const row of sealed.rows) {
      assert.equal(row.months.length, 6);
      assert.equal("action" in row, false);
    }
  });

  it("rejects a row count outside 8..20", () => {
    const tooFew = cloneDraft();
    tooFew.rows = tooFew.rows.slice(0, 7);
    assert.throws(() => sealDummySnapshot(tooFew), /row count 7/);
    const tooMany = cloneDraft();
    tooMany.rows = [
      ...tooMany.rows,
      ...tooMany.rows.map((row, i) => ({
        ...row,
        id: `row-x${i}` as DummySnapshot["rows"][number]["id"],
        partNo: `PN-X${i}` as DummySnapshot["rows"][number]["partNo"],
      })),
    ];
    assert.equal(tooMany.rows.length, 24);
    assert.throws(() => sealDummySnapshot(tooMany), /row count 24/);
  });

  it("rejects duplicate ids and part numbers", () => {
    const dupId = cloneDraft();
    dupId.rows[1] = { ...dupId.rows[1], id: dupId.rows[0].id };
    assert.throws(() => sealDummySnapshot(dupId), /duplicate id/);
    const dupPn = cloneDraft();
    dupPn.rows[1] = { ...dupPn.rows[1], partNo: dupId.rows[0].partNo };
    assert.throws(() => sealDummySnapshot(dupPn), /duplicate partNo/);
  });

  it("rejects negative or non-finite cells", () => {
    const negative = cloneDraft();
    negative.rows[0].months[0].p = -1;
    assert.throws(() => sealDummySnapshot(negative), /row-01 p/);
    const infinite = cloneDraft();
    infinite.rows[0].months[1].rolling = Number.POSITIVE_INFINITY;
    assert.throws(() => sealDummySnapshot(infinite), /row-01 rolling/);
  });

  it("rejects prefix misses and offset drift", () => {
    const badPn = cloneDraft();
    badPn.rows[0] = { ...badPn.rows[0], partNo: "PN-" as DummySnapshot["rows"][number]["partNo"] };
    assert.throws(() => sealDummySnapshot(badPn), /unsafe-token/);
    const drifted = cloneDraft();
    drifted.periods = [
      { ...drifted.periods[0], offset: 1 },
      drifted.periods[1],
      drifted.periods[2],
      drifted.periods[3],
      drifted.periods[4],
      drifted.periods[5],
    ];
    assert.throws(() => sealDummySnapshot(drifted), /period offset 0/);
  });

  it("changes periodAxisId when the month axis changes", () => {
    const shifted = cloneDraft();
    shifted.periods = [
      { offset: 0, label: "5月", month: "2026-05" },
      { offset: 1, label: "6月", month: "2026-06" },
      { offset: 2, label: "7月", month: "2026-07" },
      { offset: 3, label: "8月", month: "2026-08" },
      { offset: 4, label: "9月", month: "2026-09" },
      { offset: 5, label: "10月", month: "2026-10" },
    ];
    const a = sealDummySnapshot(FACTORY_DRAFT);
    const b = sealDummySnapshot(shifted);
    assert.notEqual(a.periodAxisId, b.periodAxisId);
  });
});

describe("MonthCells alignment", () => {
  it("cannot seal a row with five month cells", () => {
    const short = cloneDraft();
    const five = short.rows[0].months.slice(0, 5) as unknown as MonthCells;
    short.rows[0] = { ...short.rows[0], months: five };
    assert.throws(() => sealDummySnapshot(short), /months row-01/);
  });
});
