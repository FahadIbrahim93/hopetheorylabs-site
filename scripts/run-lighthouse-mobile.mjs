#!/usr/bin/env node
/** Build then run this script to measure Lighthouse on the actual Next server. */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const ownServer = !process.argv[2];
const url = process.argv[2] || "http://127.0.0.1:4173";
const port = new URL(url).port || "4173";
const out = "/tmp/htl-lighthouse.json";
let server;
try {
  if (ownServer) {
    server = spawn("npm", ["run", "start", "--", "-p", port], { stdio: "inherit" });
    let ready = false;
    for (let i = 0; i < 80; i++) {
      if (server.exitCode !== null) throw new Error("Next server stopped early");
      try { const r = await fetch(url, { signal: AbortSignal.timeout(1000) }); if (r.ok) { ready = true; break; } } catch {}
      await delay(500);
    }
    if (!ready) throw new Error("Next production server did not become ready");
  }
  const flags = [
    url,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--form-factor=mobile",
    "--screenEmulation.mobile=true",
    "--chrome-flags=--headless=new",
    `--output-path=${out}`,
    "--output=json",
    "--quiet",
  ];
  await new Promise((resolve, reject) => {
    const child = spawn("npx", ["--yes", "lighthouse", ...flags], { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`Lighthouse exit ${code}`)));
  });
  const report = JSON.parse(readFileSync(out, "utf8"));
  const c=report.categories;
  console.log(JSON.stringify({
    performance: Math.round(c.performance.score*100),
    accessibility: Math.round(c.accessibility.score*100),
    bestPractices: Math.round(c["best-practices"].score*100),
    seo: Math.round(c.seo.score*100),
    lcp: report.audits["largest-contentful-paint"]?.numericValue ?? null,
    cls: report.audits["cumulative-layout-shift"]?.numericValue ?? null,
  }, null, 2));
} finally {
  if (server && server.exitCode === null) server.kill("SIGTERM");
}
