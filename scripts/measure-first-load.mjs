#!/usr/bin/env node
/**
 * Sum gzip sizes of sync/async script tags referenced from out/index.html.
 * Gate from issue #7: first-load JS under 120 KB gzipped (best-effort on static export).
 */
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "out", "index.html");
if (!existsSync(indexPath)) {
  console.error("Run npm run build first (missing out/index.html).");
  process.exit(1);
}

const html = readFileSync(indexPath, "utf8");
/** Scripts in <head> without fetchPriority=low (Next runtime + page shell). */
const headHtml = html.split("</head>")[0] ?? html;
const headSrcRe = /<script[^>]*src="(\/_next\/static\/[^"]+\.js)"[^>]*>/g;
const seen = new Set();
let headTotal = 0;

let headMatch;
while ((headMatch = headSrcRe.exec(headHtml)) !== null) {
  const tag = headMatch[0];
  const rel = headMatch[1];
  if (/fetchPriority="low"/i.test(tag)) continue;
  if (seen.has(rel)) continue;
  seen.add(rel);
  const abs = join(root, "out", rel);
  if (!existsSync(abs)) continue;
  headTotal += gzipSync(readFileSync(abs)).length;
}

const allSrcRe = /src="(\/_next\/static\/[^"]+\.js)"/g;
const allSeen = new Set();
let allTotal = 0;
for (const match of html.matchAll(allSrcRe)) {
  const rel = match[1];
  if (allSeen.has(rel)) continue;
  allSeen.add(rel);
  const abs = join(root, "out", rel);
  if (!existsSync(abs)) continue;
  allTotal += gzipSync(readFileSync(abs)).length;
}

const headKb = (headTotal / 1024).toFixed(1);
const allKb = (allTotal / 1024).toFixed(1);
const pass = headTotal <= 120 * 1024;
console.log(`Critical path JS (head, excl. low-priority preload): ${headKb} KB gzip`);
console.log(`All scripts referenced in index.html: ${allKb} KB gzip`);
console.log(`Gate critical path <120 KB: ${pass ? "PASS" : "FAIL"}`);
process.exit(pass ? 0 : 1);
