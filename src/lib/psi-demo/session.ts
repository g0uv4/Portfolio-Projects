import { useCallback, useEffect, useSyncExternalStore } from "react";
import { FACTORY_DRAFT } from "./fixture.ts";
import {
  isPeriodOffset,
  projectDisplayRow,
  sealDummySnapshot,
  type DemoBoardView,
  type DemoEditInput,
  type DummyRow,
  type DummySnapshot,
  type MonthCells,
  type PeriodOffset,
  type SealedDummySnapshot,
} from "./snapshot.ts";

export const OVERLAY_STORAGE_KEY = "zw:psi-demo:overlay:v1";

type OverlayPins = {
  releaseId: DummySnapshot["releaseId"];
  rowUniverseId: DummySnapshot["rowUniverseId"];
  periodAxisId: string;
};

type OverlayEdit = {
  rowId: string;
  offset: PeriodOffset;
  field: "p" | "rolling";
  value: number;
};

/** Untrusted. Parsed privately inside the session. */
type DummyOverlay = OverlayPins & {
  edits: ReadonlyArray<OverlayEdit>;
};

const FACTORY: SealedDummySnapshot = sealDummySnapshot(FACTORY_DRAFT);

export type DemoSession = {
  view(): DemoBoardView;
  edit(input: DemoEditInput): DemoBoardView;
  reset(): DemoBoardView;
  subscribe(listener: () => void): () => void;
  /**
   * Read localStorage once. SSR and the first client render must not call this.
   * Pin mismatch discards quietly and sets overlayDiscarded on the next view().
   */
  attachBrowser(): void;
};

export function createDemoSession(): DemoSession {
  return new DemoSessionImpl();
}

class DemoSessionImpl implements DemoSession {
  private overlay: DummyOverlay | null = null;
  private discarded = false;
  private attached = false;
  private cached: DemoBoardView | null = null;
  private readonly listeners = new Set<() => void>();

  view = (): DemoBoardView => {
    this.cached ??= this.computeView();
    return this.cached;
  };

  edit = (input: DemoEditInput): DemoBoardView => {
    if (!this.isEditable(input)) return this.view();
    const next = upsertEdit(this.overlay?.edits ?? [], input);
    if (sameEdits(this.overlay?.edits ?? [], next)) return this.view();
    this.overlay = {
      releaseId: FACTORY.releaseId,
      rowUniverseId: FACTORY.rowUniverseId,
      periodAxisId: FACTORY.periodAxisId,
      edits: next,
    };
    this.persist();
    return this.invalidate();
  };

  reset = (): DemoBoardView => {
    this.overlay = null;
    this.discarded = false;
    this.persist();
    return this.invalidate();
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  attachBrowser = (): void => {
    if (this.attached) return;
    this.attached = true;
    if (this.overlay !== null) {
      this.persist();
      return;
    }
    const loaded = readOverlay(FACTORY);
    if (loaded.kind === "mismatch") {
      this.overlay = null;
      this.discarded = true;
      clearStoredOverlay();
      this.invalidate();
      return;
    }
    if (loaded.kind === "ok") {
      this.overlay = loaded.overlay;
      this.invalidate();
    }
  };

  private isEditable(input: DemoEditInput): boolean {
    if (!Number.isFinite(input.value) || input.value < 0) return false;
    if (!isPeriodOffset(input.offset)) return false;
    if (input.field !== "p" && input.field !== "rolling") return false;
    return FACTORY.rows.some((row) => row.id === input.rowId);
  }

  private persist(): void {
    if (typeof globalThis.localStorage === "undefined") return;
    if (!this.overlay || this.overlay.edits.length === 0) {
      globalThis.localStorage.removeItem(OVERLAY_STORAGE_KEY);
      return;
    }
    globalThis.localStorage.setItem(
      OVERLAY_STORAGE_KEY,
      JSON.stringify(this.overlay),
    );
  }

  private invalidate(): DemoBoardView {
    this.cached = null;
    const view = this.view();
    for (const listener of this.listeners) listener();
    return view;
  }

  private computeView(): DemoBoardView {
    try {
      const applied = applyOverlay(FACTORY, this.overlay);
      if (applied.snapshot.rows.length === 0) {
        return {
          status: "fail-closed",
          reason: { code: "empty-universe", detail: "no rows after overlay" },
        };
      }
      return {
        status: "ready",
        releaseId: applied.snapshot.releaseId,
        periods: applied.snapshot.periods,
        rows: applied.snapshot.rows.map((row) =>
          projectDisplayRow(row, applied.snapshot.periods),
        ),
        dirty: (this.overlay?.edits.length ?? 0) > 0,
        overlayDiscarded: this.discarded || applied.discarded,
      };
    } catch (error) {
      const detail = error instanceof Error ? error.message : "unknown";
      return { status: "fail-closed", reason: { code: "row-shape", detail } };
    }
  }
}

function upsertEdit(
  edits: ReadonlyArray<OverlayEdit>,
  input: DemoEditInput,
): OverlayEdit[] {
  const next: OverlayEdit = {
    rowId: input.rowId,
    offset: input.offset,
    field: input.field,
    value: input.value,
  };
  const index = edits.findIndex(
    (edit) =>
      edit.rowId === next.rowId &&
      edit.offset === next.offset &&
      edit.field === next.field,
  );
  if (index < 0) return [...edits, next];
  if (edits[index]?.value === next.value) return [...edits];
  return edits.map((edit, i) => (i === index ? next : edit));
}

function sameEdits(
  a: ReadonlyArray<OverlayEdit>,
  b: ReadonlyArray<OverlayEdit>,
): boolean {
  if (a.length !== b.length) return false;
  return a.every((edit, i) => {
    const other = b[i];
    return (
      other !== undefined &&
      edit.rowId === other.rowId &&
      edit.offset === other.offset &&
      edit.field === other.field &&
      edit.value === other.value
    );
  });
}

function applyOverlay(
  factory: SealedDummySnapshot,
  overlay: DummyOverlay | null,
): { snapshot: SealedDummySnapshot; discarded: boolean } {
  if (!overlay) return { snapshot: factory, discarded: false };
  if (
    overlay.releaseId !== factory.releaseId ||
    overlay.rowUniverseId !== factory.rowUniverseId ||
    overlay.periodAxisId !== factory.periodAxisId
  ) {
    return { snapshot: factory, discarded: true };
  }
  const rows = factory.rows.map(cloneRow);
  for (const edit of overlay.edits) {
    const row = rows.find((item) => item.id === edit.rowId);
    if (!row || !isPeriodOffset(edit.offset)) continue;
    if (edit.field !== "p" && edit.field !== "rolling") continue;
    if (!Number.isFinite(edit.value) || edit.value < 0) continue;
    const months: DummyCellBox[] = [
      { ...row.months[0] },
      { ...row.months[1] },
      { ...row.months[2] },
      { ...row.months[3] },
      { ...row.months[4] },
      { ...row.months[5] },
    ];
    months[edit.offset] = { ...months[edit.offset], [edit.field]: edit.value };
    row.months = months as unknown as MonthCells;
  }
  return {
    snapshot: sealDummySnapshot({
      version: 1,
      releaseId: factory.releaseId,
      rowUniverseId: factory.rowUniverseId,
      periods: factory.periods,
      rows,
    }),
    discarded: false,
  };
}

type DummyCellBox = DummyRow["months"][number];

function cloneRow(row: DummyRow): DummyRow {
  return {
    ...row,
    months: [
      { ...row.months[0] },
      { ...row.months[1] },
      { ...row.months[2] },
      { ...row.months[3] },
      { ...row.months[4] },
      { ...row.months[5] },
    ],
  };
}

type LoadedOverlay =
  | { kind: "none" }
  | { kind: "ok"; overlay: DummyOverlay }
  | { kind: "mismatch" };

function readOverlay(factory: SealedDummySnapshot): LoadedOverlay {
  if (typeof globalThis.localStorage === "undefined") return { kind: "none" };
  const raw = globalThis.localStorage.getItem(OVERLAY_STORAGE_KEY);
  if (!raw) return { kind: "none" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    clearStoredOverlay();
    return { kind: "none" };
  }
  if (!isOverlayShape(parsed)) {
    clearStoredOverlay();
    return { kind: "none" };
  }
  if (
    parsed.releaseId !== factory.releaseId ||
    parsed.rowUniverseId !== factory.rowUniverseId ||
    parsed.periodAxisId !== factory.periodAxisId
  ) {
    return { kind: "mismatch" };
  }
  return { kind: "ok", overlay: parsed };
}

function isOverlayShape(value: unknown): value is DummyOverlay {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (typeof record.releaseId !== "string") return false;
  if (typeof record.rowUniverseId !== "string") return false;
  if (typeof record.periodAxisId !== "string") return false;
  if (!Array.isArray(record.edits)) return false;
  return record.edits.every((edit) => {
    if (!edit || typeof edit !== "object") return false;
    const item = edit as Record<string, unknown>;
    return (
      typeof item.rowId === "string" &&
      isPeriodOffset(Number(item.offset)) &&
      (item.field === "p" || item.field === "rolling") &&
      typeof item.value === "number"
    );
  });
}

function clearStoredOverlay(): void {
  if (typeof globalThis.localStorage === "undefined") return;
  globalThis.localStorage.removeItem(OVERLAY_STORAGE_KEY);
}

let browserSession: DemoSession | undefined;

function getBrowserSession(): DemoSession {
  browserSession ??= createDemoSession();
  return browserSession;
}

/** First render is factory-only. Overlay resumes after attachBrowser. */
export function usePsiDemoSession(): {
  view: DemoBoardView;
  edit: (input: DemoEditInput) => void;
  reset: () => void;
} {
  const session = getBrowserSession();
  const view = useSyncExternalStore(session.subscribe, session.view, session.view);
  useEffect(() => {
    session.attachBrowser();
  }, [session]);
  const edit = useCallback(
    (input: DemoEditInput) => {
      session.edit(input);
    },
    [session],
  );
  const reset = useCallback(() => {
    session.reset();
  }, [session]);
  return { view, edit, reset };
}

