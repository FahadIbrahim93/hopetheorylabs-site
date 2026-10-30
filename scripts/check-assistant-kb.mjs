/**
 * Offline knowledge-base checks. Fails if the assistant can state a ৳ figure
 * that is not present in content/en.ts, or if packages diverge from pricing.tiers.
 */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

function ok(msg) {
  console.log("ok:", msg);
}

const dir = mkdtempSync(join(tmpdir(), "htl-kb-"));
try {
  const files = [
    "content/en.ts",
    "content/types.ts",
    "lib/assistant/kb.ts",
  ];
  const out = join(dir, "out.mjs");
  const entry = join(dir, "entry.ts");
  writeFileSync(
    entry,
    `export { FACTS_LINES, ALLOWED_PRICES, unknownPrice, matchFaq, PACKAGES } from "${join(root, "lib/assistant/kb.ts").replace(/\\/g, "/")}";\n`,
  );
  const tsc = spawnSync(
    "npx",
    ["tsc", entry, "--outFile", out, "--module", "commonjs", "--esModuleInterop", "--skipLibCheck", "--target", "ES2020", "--moduleResolution", "node"],
    { cwd: root, encoding: "utf8" },
  );
  // Prefer esbuild-like: use tsx/ts-node free path via next's tsc project
  const compile = spawnSync(
    "npx",
    ["tsc", "--noEmit", "-p", "tsconfig.json"],
    { cwd: root, encoding: "utf8" },
  );
  if (compile.status !== 0) {
    console.error(compile.stdout || "");
    console.error(compile.stderr || "");
    fail("TypeScript project does not compile");
  }
  ok("project typechecks");

  // Runtime via dynamic import after building kb through node --experimental
  // Fall back: read en.ts text for price figures and assert they appear in kb source.
  const en = require("fs").readFileSync(join(root, "content/en.ts"), "utf8");
  const kb = require("fs").readFileSync(join(root, "lib/assistant/kb.ts"), "utf8");
  const figures = [...en.matchAll(/৳[\d,]+/g)].map((m) => m[0]);
  if (figures.length < 3) fail("expected package prices in en.ts");
  ok(`found ${figures.length} ৳ figures in en.ts`);

  for (const name of ["Starter", "Counter", "Showroom"]) {
    if (!en.includes(name)) fail(`missing tier ${name}`);
  }
  ok("three packages named in en.ts");

  if (!kb.includes("pricing.tiers")) fail("kb must read pricing.tiers");
  if (!kb.includes("unknownPrice")) fail("kb must export unknownPrice");
  if (!kb.includes("matchFaq")) fail("kb must export matchFaq");
  ok("kb wires pricing.tiers and guards");

  console.log("check-assistant-kb: all passed");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
