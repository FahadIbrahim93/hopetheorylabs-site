#!/usr/bin/env node
/** Informational first-load script gzip report for prerendered Next.js HTML. */
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  { html: join(root, ".next", "server", "app", "index.html"), type: "next" },
  { html: join(root, "out", "index.html"), type: "export" },
];
const found = candidates.find(({ html }) => existsSync(html));
if (!found) {
  console.log("No prerendered homepage HTML was found; first-load inspection unavailable (informational only).");
  process.exit(0);
}
const html = readFileSync(found.html, "utf8");
const scripts = [...html.matchAll(/<script[^>]*src="(\/_next\/static\/[^"]+\.js)"[^>]*>/g)];
const all = new Map();
for (const match of scripts) {
  const url = match[1];
  const dest = found.type === "next"
    ? join(root, ".next", url.replace(/^\/_next\//, ""))
    : join(root, "out", url.slice(1));
  if (!existsSync(dest)) continue;
  if (!all.has(url)) all.set(url, { bytes: gzipSync(readFileSync(dest)).length, head: false });
  if (html.indexOf(match[0]) < html.indexOf("</head>") && !/fetchPriority="low"/i.test(match[0])) {
    all.get(url).head = true;
  }
}
const headBytes = [...all.values()].filter(v => v.head).reduce((s, v) => s + v.bytes, 0);
const total = [...all.values()].reduce((s, v) => s + v.bytes, 0);
console.log("Prerendered page source:", found.html);
console.log("Critical-head JavaScript:", (headBytes/1024).toFixed(1), "KB gzip");
console.log("Total referenced JavaScript:", (total/1024).toFixed(1), "KB gzip");
console.log("Legacy 120 KB budget (informational):", headBytes <= 120*1024 ? "PASS" : "EXCEEDED");
