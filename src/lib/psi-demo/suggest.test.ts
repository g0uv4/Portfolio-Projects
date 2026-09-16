import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { suggestAction, type DummyCell, type MonthCells } from "./snapshot.ts";

function cell(
  inventory: number,
  po: number,
  p: number,
  rolling: number,
  fcst: number,
): DummyCell {
  return { inventory, po, p, rolling, fcst };
}

function months(
  m0: DummyCell,
  m1: DummyCell,
  m2: DummyCell,
  m3: DummyCell,
  m4: DummyCell,
  m5: DummyCell,
): MonthCells {
  return [m0, m1, m2, m3, m4, m5];
}

const balanced = cell(20, 5, 10, 8, 10);

describe("suggestAction", () => {
  it("is Pull in when the first shortage is before any surplus", () => {
    // net: -12, +17, +27, +27, +27, +27
    assert.equal(
      suggestAction(
        months(
          cell(0, 0, 0, 12, 8),
          balanced,
          balanced,
          balanced,
          balanced,
          balanced,
        ),
      ),
      "Pull in",
    );
  });

  it("is Pull in when there is a shortage and never a surplus", () => {
    const alwaysShort = cell(0, 0, 0, 4, 4);
    assert.equal(
      suggestAction(
        months(
          alwaysShort,
          alwaysShort,
          alwaysShort,
          alwaysShort,
          alwaysShort,
          alwaysShort,
        ),
      ),
      "Pull in",
    );
  });

  it("is Push out when the first surplus is before the first shortage", () => {
    // net: +25, -9, +27, +27, +27, +27
    assert.equal(
      suggestAction(
        months(
          cell(20, 5, 0, 0, 0),
          cell(0, 0, 1, 10, 8),
          balanced,
          balanced,
          balanced,
          balanced,
        ),
      ),
      "Push out",
    );
  });

  it("is DONE when no month is short", () => {
    assert.equal(
      suggestAction(
        months(balanced, balanced, balanced, balanced, balanced, balanced),
      ),
      "DONE",
    );
  });
});
