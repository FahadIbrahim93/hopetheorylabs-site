#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const url = process.argv[2] ?? "http://127.0.0.1:4173";
const out = "/tmp/htl-lighthouse.json";

const args = [
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
  const child = spawn("npx", ["--yes", "lighthouse", ...args], { stdio: "inherit" });
  child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`lighthouse exit ${code}`))));
});

const report = JSON.parse(readFileSync(out, "utf8"));
const c = report.categories;
const row = {
  performance: Math.round(c.performance.score * 100),
  accessibility: Math.round(c.accessibility.score * 100),
  bestPractices: Math.round(c["best-practices"].score * 100),
  seo: Math.round(c.seo.score * 100),
  cls: report.audits["cumulative-layout-shift"]?.displayValue ?? "—",
  lcp: report.audits["largest-contentful-paint"]?.displayValue ?? "—",
};
console.log(JSON.stringify(row, null, 2));
