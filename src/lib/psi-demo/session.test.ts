import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { FACTORY_DRAFT } from "./fixture.ts";
import { createDemoSession, OVERLAY_STORAGE_KEY } from "./session.ts";
import { fingerprintPeriodAxis } from "./snapshot.ts";

class MemoryStorage implements Storage {
  #map = new Map<string, string>();

  get length(): number {
    return this.#map.size;
  }

  clear(): void {
    this.#map.clear();
  }

  getItem(key: string): string | null {
    return this.#map.has(key) ? (this.#map.get(key) ?? null) : null;
  }

  key(index: number): string | null {
    return [...this.#map.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.#map.delete(key);
  }

  setItem(key: string, value: string): void {
    this.#map.set(key, String(value));
  }
}

const originalStorage = globalThis.localStorage;

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
});

afterEach(() => {
  if (originalStorage === undefined) {
    Reflect.deleteProperty(globalThis, "localStorage");
    return;
  }
  globalThis.localStorage = originalStorage;
});

function readyView(session: ReturnType<typeof createDemoSession>) {
  const view = session.view();
  assert.equal(view.status, "ready");
  if (view.status !== "ready") throw new Error("expected ready");
  return view;
}

describe("createDemoSession", () => {
  it("first view is factory-only even when localStorage has edits", () => {
    const rowId = FACTORY_DRAFT.rows[0]?.id;
    assert.ok(rowId);
    globalThis.localStorage.setItem(
      OVERLAY_STORAGE_KEY,
      JSON.stringify({
        releaseId: "demo-release",
        rowUniverseId: "demo-universe",
        periodAxisId: fingerprintPeriodAxis(FACTORY_DRAFT.periods),
        edits: [{ rowId, offset: 0, field: "p", value: 42 }],
      }),
    );
    const session = createDemoSession();
    const before = readyView(session);
    assert.equal(before.dirty, false);
    assert.equal(before.rows[0]?.months[0]?.p, FACTORY_DRAFT.rows[0]?.months[0]?.p);
    session.attachBrowser();
    const after = readyView(session);
    assert.equal(after.dirty, true);
    assert.equal(after.rows[0]?.months[0]?.p, 42);
  });

  it("discards overlay when periodAxisId disagrees", () => {
    const rowId = FACTORY_DRAFT.rows[0]?.id;
    assert.ok(rowId);
    globalThis.localStorage.setItem(
      OVERLAY_STORAGE_KEY,
      JSON.stringify({
        releaseId: "demo-release",
        rowUniverseId: "demo-universe",
        periodAxisId: "wrong-pin",
        edits: [{ rowId, offset: 0, field: "p", value: 99 }],
      }),
    );
    const session = createDemoSession();
    session.attachBrowser();
    const view = readyView(session);
    assert.equal(view.overlayDiscarded, true);
    assert.equal(view.dirty, false);
    assert.equal(view.rows[0]?.months[0]?.p, FACTORY_DRAFT.rows[0]?.months[0]?.p);
    assert.equal(globalThis.localStorage.getItem(OVERLAY_STORAGE_KEY), null);
  });

  it("stores one overlay entry when the same edit is applied twice", () => {
    const session = createDemoSession();
    const rowId = readyView(session).rows[0]?.id;
    assert.ok(rowId);
    session.edit({ rowId, offset: 2, field: "rolling", value: 11 });
    session.edit({ rowId, offset: 2, field: "rolling", value: 11 });
    const raw = globalThis.localStorage.getItem(OVERLAY_STORAGE_KEY);
    assert.ok(raw);
    const stored = JSON.parse(raw) as { edits: unknown[] };
    assert.equal(stored.edits.length, 1);
    const view = readyView(session);
    assert.equal(view.rows[0]?.months[2]?.rolling, 11);
    assert.equal(view.dirty, true);
  });

  it("reset returns to the factory snapshot and clears storage", () => {
    const session = createDemoSession();
    const rowId = readyView(session).rows[0]?.id;
    assert.ok(rowId);
    session.edit({ rowId, offset: 0, field: "p", value: 8 });
    assert.equal(readyView(session).dirty, true);
    session.reset();
    const reset = readyView(session);
    assert.equal(reset.dirty, false);
    assert.equal(reset.overlayDiscarded, false);
    assert.equal(reset.rows[0]?.months[0]?.p, FACTORY_DRAFT.rows[0]?.months[0]?.p);
    assert.equal(globalThis.localStorage.getItem(OVERLAY_STORAGE_KEY), null);
  });
});
