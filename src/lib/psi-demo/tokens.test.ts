import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FACTORY_DRAFT } from "./fixture.ts";
import { sealDummySnapshot, suggestAction } from "./snapshot.ts";

const TOKEN_RE = /^(PN|CUST|WH|QA)-[A-Z0-9-]+$/;
const LINE_RE = /^LINE-[A-E]$/;
const FORBIDDEN = [
  ["psi-dashboard-", "47c"].join(""),
  ["psi-dashboard-", "v", "22"].join(""),
  ["pages", ".dev"].join(""),
];

const here = dirname(fileURLToPath(import.meta.url));
const boardDir = join(here, "../../components/psi-demo");
const worksFile = join(here, "../../content/works.ts");
const routeFile = join(here, "../../routes/psi-demo.tsx");

describe("FACTORY_DRAFT tokens", () => {
  it("seals 12 rows across LINE-A..E with three actions and two QA holds", () => {
    const sealed = sealDummySnapshot(FACTORY_DRAFT);
    assert.equal(sealed.rows.length, 12);
    assert.deepEqual(
      sealed.periods.map((period) => period.month),
      ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"],
    );
    const lines = new Set(sealed.rows.map((row) => row.productLine));
    assert.deepEqual([...lines].sort(), [
      "LINE-A",
      "LINE-B",
      "LINE-C",
      "LINE-D",
      "LINE-E",
    ]);
    const holds = sealed.rows.filter((row) => row.qaHold);
    assert.equal(holds.length, 2);
    for (const hold of holds) {
      assert.match(hold.qaHold ?? "", TOKEN_RE);
      assert.equal(hold.qaHold?.startsWith("QA-"), true);
    }
    const actions = new Set(sealed.rows.map((row) => suggestAction(row.months)));
    assert.deepEqual([...actions].sort(), ["DONE", "Pull in", "Push out"]);
    for (const row of sealed.rows) {
      assert.match(row.id, /^row-.+/);
      assert.match(row.partNo, TOKEN_RE);
      assert.equal(row.partNo.startsWith("PN-"), true);
      assert.match(row.orderCustomer, TOKEN_RE);
      assert.equal(row.orderCustomer.startsWith("CUST-"), true);
      assert.match(row.shipCustomer, TOKEN_RE);
      assert.equal(row.shipCustomer.startsWith("CUST-"), true);
      assert.match(row.warehouse, TOKEN_RE);
      assert.equal(row.warehouse.startsWith("WH-"), true);
      assert.match(row.productLine, LINE_RE);
    }
  });
});

describe("psi-demo sources", () => {
  it("do not contain live host, packed dump, or unprefixed identity tokens", () => {
    const files = [
      ...listSources(here),
      ...listSources(boardDir),
      worksFile,
      routeFile,
    ];
    assert.ok(files.length > 0);
    for (const file of files) {
      const content = readFileSync(file, "utf8");
      for (const needle of FORBIDDEN) {
        assert.equal(
          content.includes(needle),
          false,
          `${file} contains ${needle}`,
        );
      }
      for (const literal of stringLiterals(content)) {
        if (literal.includes("${")) continue;
        if (/^(PN|CUST|WH|QA)-/.test(literal)) {
          assert.match(literal, TOKEN_RE, `${file} identity ${literal}`);
        }
        if (/^LINE-/.test(literal)) {
          assert.match(literal, LINE_RE, `${file} line ${literal}`);
        }
      }
    }
  });

  it("does not re-export suggestAction or DummySnapshot from the barrel", () => {
    const barrel = readFileSync(join(here, "index.ts"), "utf8");
    assert.equal(barrel.includes("suggestAction"), false);
    assert.equal(barrel.includes("DummySnapshot"), false);
  });
});

function listSources(dir: string): string[] {
  const out: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      out.push(...listSources(path));
      continue;
    }
    if (name.endsWith(".test.ts")) continue;
    if (extname(name) === ".ts" || extname(name) === ".tsx") out.push(path);
  }
  return out;
}

function stringLiterals(source: string): string[] {
  const out: string[] = [];
  const re = /(["'`])((?:\\.|(?!\1).)*)\1/g;
  for (const match of source.matchAll(re)) {
    const body = match[2];
    if (typeof body === "string") out.push(body);
  }
  return out;
}
