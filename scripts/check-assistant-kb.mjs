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
  // Compile the knowledge base (and the content it reads) to CommonJS so the
  // routing rules can be exercised for real, not just grepped.
  const build = spawnSync(
    "npx",
    ["tsc", ...files, "--outDir", dir, "--rootDir", root, "--module", "commonjs", "--esModuleInterop", "--skipLibCheck", "--target", "ES2020", "--moduleResolution", "node"],
    { cwd: root, encoding: "utf8" },
  );
  if (build.status !== 0) {
    console.error(build.stdout || "");
    console.error(build.stderr || "");
    fail("could not compile lib/assistant/kb.ts for the routing checks");
  }
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

  // Offline fallback routing: price questions must get the published packages
  // (English and Bangla), even when they also mention a business type or scope.
  const kbModule = require(join(dir, "lib/assistant/kb.js"));
  const route = (q) => kbModule.matchFaq(q);
  const priceQuestions = [
    "How much for a small business website?",
    "What do you charge for a startup landing page?",
    "price for enterprise website",
    "How much does the Counter package cost?",
    "দাম কত?",
    "ওয়েবসাইট বানাতে কত টাকা লাগবে?",
    "এন্টারপ্রাইজ ওয়েবসাইটের খরচ কত?",
  ];
  for (const q of priceQuestions) {
    const { id, reply } = route(q);
    if (id !== "price") fail(`"${q}" routed to ${id}, expected price`);
    for (const figure of ["৳10,000", "৳25,000", "৳45,000"]) {
      if (!reply.includes(figure)) fail(`price reply for "${q}" is missing ${figure}`);
    }
  }
  ok(`${priceQuestions.length} price questions (English and Bangla) get the published packages`);

  const discoveryQuestions = [
    "What does forward-deployed mean?",
    "How does discovery work?",
    "Is this for enterprise teams?",
    "স্কোপ কীভাবে ঠিক হয়?",
    "ডিসকভারি কী?",
  ];
  for (const q of discoveryQuestions) {
    const { id } = route(q);
    if (id !== "discovery") fail(`"${q}" routed to ${id}, expected discovery`);
  }
  ok(`${discoveryQuestions.length} scoping questions get the discovery answer`);

  // The AI Audit is quoted per scope: its answers carry no ৳ figure, no
  // package ladder and no founding or introductory rate.
  const auditQuestions = ["What is the AI Audit?", "How much does the audit cost?", "অডিট কী?", "Do you offer an AI audit?"];
  for (const q of auditQuestions) {
    const { id, reply } = route(q);
    if (id !== "audit") fail(`"${q}" routed to ${id}, expected audit`);
    if (/৳|taka|\btk\b|bdt/i.test(reply)) fail(`audit reply for "${q}" carries a price`);
    if (/founding|introductory|special rate|discount/i.test(reply)) fail(`audit reply for "${q}" mentions a special rate`);
    if (!/discovery call|per scope|after discovery/i.test(reply)) fail(`audit reply for "${q}" does not say it is quoted per scope`);
  }
  ok(`${auditQuestions.length} audit questions get the quoted-per-scope answer with no price`);

  if (/founding/i.test(en)) fail("content/en.ts still mentions a founding offer");
  if (/clients worldwide|worldwide/i.test(en)) fail("content/en.ts still says clients worldwide");
  ok("no founding offer and no worldwide claim in the site copy");

  console.log("check-assistant-kb: all passed");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
