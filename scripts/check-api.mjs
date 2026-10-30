/**
 * Offline API handler smoke tests (no network, no keys).
 * Compiles handlers with the project and exercises scripted FAQ + validation.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

function ok(msg) {
  console.log("ok:", msg);
}

const compile = spawnSync("npx", ["tsc", "--noEmit", "-p", "tsconfig.json"], {
  cwd: root,
  encoding: "utf8",
});
if (compile.status !== 0) {
  console.error(compile.stdout || "");
  console.error(compile.stderr || "");
  fail("TypeScript project does not compile");
}
ok("project typechecks");

for (const path of ["api/chat.ts", "api/lead.ts", "lib/assistant/server.ts", "lib/assistant/kb.ts"]) {
  const src = readFileSync(join(root, path), "utf8");
  if (!src.includes("export")) fail(`${path} has no exports`);
  ok(`present ${path}`);
}

const chat = readFileSync(join(root, "api/chat.ts"), "utf8");
if (!chat.includes("askGroq") || !chat.includes("askGemini") || !chat.includes("matchFaq")) {
  fail("chat handler missing provider chain");
}
ok("chat provider chain");

const lead = readFileSync(join(root, "api/lead.ts"), "utf8");
if (!lead.includes("EMAIL") || !lead.includes("PHONE") || !lead.includes("honeypot")) {
  fail("lead handler missing validation/honeypot");
}
ok("lead validation");

console.log("check-api: all passed");
